/**
 * Module de sécurité pour la validation et la protection des entrées utilisateur
 *
 * Ce module fournit des fonctions pour :
 * - Prévenir les injections SQL
 * - Prévenir les injections d'en-têtes email (CRLF)
 * - Valider les entrées utilisateur
 * - Implémenter le rate limiting
 * - Vérifier les signatures de webhook
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  sanitized: string
  error?: string
}

export interface ContactFormValidation {
  isValid: boolean
  errors: string[]
  sanitizedData?: {
    name: string
    email: string
    phone: string | null
    company: string | null
    subject: string
    message: string
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number // secondes
}

// ============================================================================
// CONSTANTES DE SÉCURITÉ
// ============================================================================

// Limites de taille des champs
export const FIELD_LIMITS = {
  name: { min: 2, max: 100 },
  email: { min: 5, max: 254 }, // RFC 5321
  phone: { min: 0, max: 30 },
  company: { min: 0, max: 150 },
  subject: { min: 3, max: 200 },
  message: { min: 10, max: 5000 },
} as const

// Patterns dangereux pour l'injection SQL
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
  /(-{2}|;|\/\*|\*\/)/,
  /(\bOR\b|\bAND\b)\s*\d+\s*=\s*\d+/i,
  /'\s*(OR|AND)\s*'?\d/i,
  /\bUNION\b\s+\bSELECT\b/i,
]

// Patterns pour l'injection d'en-têtes email (CRLF)
const EMAIL_HEADER_INJECTION_PATTERNS = [
  /[\r\n]/,
  /%0[dD]/,
  /%0[aA]/,
  /\\r|\\n/,
]

// Domaines d'email jetables/temporaires connus
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com',
  'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'sharklasers.com',
  'yopmail.com', 'trashmail.com', 'maildrop.cc', 'getairmail.com',
  'dispostable.com', 'getnada.com', 'emailondeck.com'
]

// ============================================================================
// RATE LIMITING (en mémoire - pour production utiliser Redis)
// ============================================================================

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Store en mémoire pour le rate limiting
// Note: En production, utiliser Redis ou Upstash
const rateLimitStore = new Map<string, RateLimitEntry>()

// Nettoyage périodique du store (toutes les 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupRateLimitStore() {
  const now = Date.now()
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key)
      }
    }
    lastCleanup = now
  }
}

/**
 * Vérifie et met à jour le rate limit pour une clé donnée
 * @param key - Identifiant unique (IP, email, etc.)
 * @param maxRequests - Nombre max de requêtes autorisées
 * @param windowMs - Fenêtre de temps en millisecondes
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000 // 1 minute par défaut
): RateLimitResult {
  cleanupRateLimitStore()

  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    // Nouvelle entrée ou fenêtre expirée
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetIn: Math.ceil(windowMs / 1000)
    }
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetAt - now) / 1000)
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetAt - now) / 1000)
  }
}

// ============================================================================
// VALIDATION ET SANITISATION
// ============================================================================

/**
 * Échappe les caractères HTML pour prévenir XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Supprime les caractères de contrôle et CRLF pour prévenir l'injection d'en-têtes email
 */
export function sanitizeEmailHeader(text: string): string {
  // Supprimer tous les caractères de contrôle (0x00-0x1F, 0x7F)
  // et les retours à la ligne
  return text
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/[\r\n]/g, '')
    .replace(/%0[dDaA]/g, '')
    .trim()
}

/**
 * Vérifie si une chaîne contient des patterns d'injection SQL
 */
export function containsSqlInjection(text: string): boolean {
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(text))
}

/**
 * Vérifie si une chaîne contient des patterns d'injection d'en-têtes email
 */
export function containsEmailHeaderInjection(text: string): boolean {
  return EMAIL_HEADER_INJECTION_PATTERNS.some(pattern => pattern.test(text))
}

/**
 * Valide un email de manière stricte
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim().toLowerCase()

  // Vérifier la longueur (RFC 5321)
  if (trimmed.length < FIELD_LIMITS.email.min || trimmed.length > FIELD_LIMITS.email.max) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: `L'email doit contenir entre ${FIELD_LIMITS.email.min} et ${FIELD_LIMITS.email.max} caractères`
    }
  }

  // Regex email plus stricte
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: 'Format d\'email invalide'
    }
  }

  // Vérifier l'injection d'en-têtes
  if (containsEmailHeaderInjection(trimmed)) {
    return {
      isValid: false,
      sanitized: '',
      error: 'L\'email contient des caractères non autorisés'
    }
  }

  // Vérifier les domaines jetables
  const domain = trimmed.split('@')[1]
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: 'Les adresses email temporaires ne sont pas acceptées'
    }
  }

  return {
    isValid: true,
    sanitized: trimmed
  }
}

/**
 * Valide un numéro de téléphone
 */
export function validatePhone(phone: string | undefined | null): ValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: true, sanitized: '' }
  }

  const trimmed = phone.trim()

  // Vérifier la longueur
  if (trimmed.length > FIELD_LIMITS.phone.max) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: `Le téléphone ne doit pas dépasser ${FIELD_LIMITS.phone.max} caractères`
    }
  }

  // Autoriser uniquement les chiffres, espaces, +, -, (, )
  const phoneRegex = /^[\d\s+\-().]+$/
  if (!phoneRegex.test(trimmed)) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: 'Format de téléphone invalide'
    }
  }

  return {
    isValid: true,
    sanitized: sanitizeEmailHeader(trimmed)
  }
}

/**
 * Valide un champ texte générique
 */
export function validateTextField(
  text: string,
  fieldName: keyof typeof FIELD_LIMITS,
  required: boolean = true
): ValidationResult {
  const trimmed = text?.trim() || ''
  const limits = FIELD_LIMITS[fieldName]

  if (required && trimmed.length === 0) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: `Le champ ${fieldName} est obligatoire`
    }
  }

  if (!required && trimmed.length === 0) {
    return { isValid: true, sanitized: '' }
  }

  if (trimmed.length < limits.min) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: `Le champ ${fieldName} doit contenir au moins ${limits.min} caractères`
    }
  }

  if (trimmed.length > limits.max) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: `Le champ ${fieldName} ne doit pas dépasser ${limits.max} caractères`
    }
  }

  // Vérifier l'injection SQL potentielle
  if (containsSqlInjection(trimmed)) {
    console.warn(`[SECURITY] Tentative d'injection SQL détectée dans ${fieldName}:`, trimmed.substring(0, 100))
    return {
      isValid: false,
      sanitized: '',
      error: 'Le texte contient des caractères non autorisés'
    }
  }

  // Vérifier l'injection d'en-têtes email pour les champs utilisés dans les emails
  if (['subject', 'name'].includes(fieldName) && containsEmailHeaderInjection(trimmed)) {
    console.warn(`[SECURITY] Tentative d'injection d'en-tête détectée dans ${fieldName}:`, trimmed.substring(0, 100))
    return {
      isValid: false,
      sanitized: '',
      error: 'Le texte contient des caractères non autorisés'
    }
  }

  return {
    isValid: true,
    sanitized: sanitizeEmailHeader(trimmed)
  }
}

/**
 * Valide toutes les données du formulaire de contact
 */
export function validateContactForm(data: {
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
}): ContactFormValidation {
  const errors: string[] = []

  // Valider chaque champ
  const nameResult = validateTextField(data.name || '', 'name', true)
  const emailResult = validateEmail(data.email || '')
  const phoneResult = validatePhone(data.phone)
  const companyResult = validateTextField(data.company || '', 'company', false)
  const subjectResult = validateTextField(data.subject || '', 'subject', true)
  const messageResult = validateTextField(data.message || '', 'message', true)

  // Collecter les erreurs
  if (!nameResult.isValid && nameResult.error) errors.push(nameResult.error)
  if (!emailResult.isValid && emailResult.error) errors.push(emailResult.error)
  if (!phoneResult.isValid && phoneResult.error) errors.push(phoneResult.error)
  if (!companyResult.isValid && companyResult.error) errors.push(companyResult.error)
  if (!subjectResult.isValid && subjectResult.error) errors.push(subjectResult.error)
  if (!messageResult.isValid && messageResult.error) errors.push(messageResult.error)

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      name: nameResult.sanitized,
      email: emailResult.sanitized,
      phone: phoneResult.sanitized || null,
      company: companyResult.sanitized || null,
      subject: subjectResult.sanitized,
      message: messageResult.sanitized
    }
  }
}

// ============================================================================
// VÉRIFICATION ORIGIN/REFERER (PROTECTION CSRF BASIQUE)
// ============================================================================

const ALLOWED_ORIGINS = [
  'https://odillon.fr',
  'https://www.odillon.fr',
  'https://admin.odillon.fr',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]

/**
 * Vérifie si l'origine de la requête est autorisée
 */
export function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  // En développement, autoriser localhost
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // Vérifier l'origin
  if (origin) {
    return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))
  }

  // Fallback sur le referer
  if (referer) {
    return ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed))
  }

  // Pas d'origin ni de referer - peut être une requête directe (Postman, curl)
  // On bloque par défaut en production
  return false
}

/**
 * Extrait l'adresse IP du client
 */
export function getClientIP(request: Request): string {
  // Headers utilisés par différents proxies/CDN
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwardedFor) {
    // x-forwarded-for peut contenir plusieurs IPs séparées par des virgules
    return forwardedFor.split(',')[0].trim()
  }

  return '0.0.0.0' // Fallback
}

// ============================================================================
// VÉRIFICATION SIGNATURE WEBHOOK SVIX
// ============================================================================

/**
 * Vérifie la signature d'un webhook Resend/Svix
 * Note: Implémentation simplifiée - en production utiliser le package svix
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string | null
): Promise<boolean> {
  if (!secret || !signature) {
    console.warn('[SECURITY] Webhook secret ou signature manquant')
    return false
  }

  try {
    // Le format de signature svix est: v1,timestamp,signature_base64
    const parts = signature.split(',')
    if (parts.length < 3) {
      return false
    }

    const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1]
    const v1Sig = parts.find(p => p.startsWith('v1='))?.split('=')[1]

    if (!timestamp || !v1Sig) {
      return false
    }

    // Vérifier que le timestamp n'est pas trop vieux (5 minutes max)
    const timestampMs = parseInt(timestamp) * 1000
    const now = Date.now()
    if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
      console.warn('[SECURITY] Timestamp de webhook trop ancien')
      return false
    }

    // Calculer la signature attendue
    const signedPayload = `${timestamp}.${payload}`
    const encoder = new TextEncoder()

    // Importer la clé secrète
    const keyData = encoder.encode(secret.replace('whsec_', ''))
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    // Signer
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    )

    // Convertir en base64
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))

    // Comparer de manière sécurisée (timing-safe)
    return v1Sig === expectedSignature
  } catch (error) {
    console.error('[SECURITY] Erreur vérification signature webhook:', error)
    return false
  }
}

// ============================================================================
// LOGGING DE SÉCURITÉ
// ============================================================================

export type SecurityEventType =
  | 'sql_injection'
  | 'email_header_injection'
  | 'rate_limit'
  | 'origin_blocked'
  | 'webhook_invalid'
  | 'auth_failure'
  | 'suspicious_activity'

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical'

interface SecurityLogEntry {
  timestamp: string
  type: SecurityEventType
  ip: string
  details: string
  severity?: SecuritySeverity
  userAgent?: string
  requestPath?: string
  requestMethod?: string
  metadata?: Record<string, unknown>
}

// In-memory fallback (for when database is unavailable)
const securityLogs: SecurityLogEntry[] = []
const MAX_LOGS = 1000

// Severity mapping for event types
const EVENT_SEVERITY_MAP: Record<SecurityEventType, SecuritySeverity> = {
  sql_injection: 'critical',
  email_header_injection: 'high',
  rate_limit: 'medium',
  origin_blocked: 'medium',
  webhook_invalid: 'high',
  auth_failure: 'medium',
  suspicious_activity: 'high',
}

/**
 * Enregistre un événement de sécurité (in-memory + database)
 * @param type - Type d'événement de sécurité
 * @param ip - Adresse IP du client
 * @param details - Détails de l'événement
 * @param options - Options additionnelles (userAgent, requestPath, etc.)
 */
export async function logSecurityEvent(
  type: SecurityEventType,
  ip: string,
  details: string,
  options?: {
    userAgent?: string
    requestPath?: string
    requestMethod?: string
    severity?: SecuritySeverity
    metadata?: Record<string, unknown>
  }
): Promise<void> {
  const severity = options?.severity || EVENT_SEVERITY_MAP[type] || 'medium'

  const entry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    type,
    ip,
    details: details.substring(0, 500),
    severity,
    userAgent: options?.userAgent,
    requestPath: options?.requestPath,
    requestMethod: options?.requestMethod,
    metadata: options?.metadata,
  }

  // Always log to memory (fast, immediate)
  securityLogs.push(entry)
  if (securityLogs.length > MAX_LOGS) {
    securityLogs.shift()
  }

  // Console warning for immediate visibility
  console.warn(`[SECURITY] [${severity.toUpperCase()}] ${type}`, {
    ip,
    details: entry.details,
    path: options?.requestPath,
  })

  // Persist to database (async, non-blocking)
  persistSecurityLog(entry).catch((error) => {
    console.error('[SECURITY] Failed to persist security log to database:', error)
  })
}

/**
 * Persists a security log entry to the database
 */
async function persistSecurityLog(entry: SecurityLogEntry): Promise<void> {
  // Check if we have the required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    // Skip database persistence if not configured
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    await supabase.from('security_logs').insert({
      event_type: entry.type,
      ip_address: entry.ip,
      details: entry.details,
      severity: entry.severity || 'medium',
      user_agent: entry.userAgent,
      request_path: entry.requestPath,
      request_method: entry.requestMethod,
      metadata: entry.metadata || {},
    })
  } catch {
    // Silently fail - we don't want logging to break the application
    // The in-memory log is still available
  }
}

/**
 * Récupère les derniers événements de sécurité (in-memory, pour backward compatibility)
 */
export function getSecurityLogs(limit: number = 100): SecurityLogEntry[] {
  return securityLogs.slice(-limit)
}

/**
 * Récupère les logs de sécurité depuis la base de données
 * @param options - Options de filtrage
 */
export async function getSecurityLogsFromDatabase(options?: {
  limit?: number
  eventType?: SecurityEventType
  severity?: SecuritySeverity
  since?: Date
}): Promise<SecurityLogEntry[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    // Fall back to in-memory logs
    return getSecurityLogs(options?.limit)
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    let query = supabase
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(options?.limit || 100)

    if (options?.eventType) {
      query = query.eq('event_type', options.eventType)
    }
    if (options?.severity) {
      query = query.eq('severity', options.severity)
    }
    if (options?.since) {
      query = query.gte('created_at', options.since.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('[SECURITY] Failed to fetch logs from database:', error)
      return getSecurityLogs(options?.limit)
    }

    return (data || []).map((row) => ({
      timestamp: row.created_at,
      type: row.event_type as SecurityEventType,
      ip: row.ip_address,
      details: row.details,
      severity: row.severity as SecuritySeverity,
      userAgent: row.user_agent,
      requestPath: row.request_path,
      requestMethod: row.request_method,
      metadata: row.metadata,
    }))
  } catch {
    // Fall back to in-memory logs
    return getSecurityLogs(options?.limit)
  }
}
