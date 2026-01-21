/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'youtu.be',
      },
      {
        protocol: 'https',
        hostname: 'youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'www.emploi.ga',
      },
      // Allow other external company logos
      {
        protocol: 'https',
        hostname: '**.ga',
      },
      {
        protocol: 'https',
        hostname: 'www.seeg-gabon.com',
      },
      {
        protocol: 'https',
        hostname: 'www.startpage.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Configuration pour supporter les sous-domaines
  // Le proxy (proxy.ts) gère le routage admin.odillon.fr
  async headers() {
    return [
      {
        // Appliquer les headers de sécurité à toutes les routes
        source: '/:path*',
        headers: [
          // Prévenir le clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prévenir le MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Contrôler les informations envoyées dans le Referer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Activer la protection XSS du navigateur (pour les anciens navigateurs)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Politique de sécurité du contenu (CSP)
          // Note: 'unsafe-inline' est nécessaire pour Next.js et styled-jsx
          // En production, envisager d'utiliser des nonces pour plus de sécurité
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + inline (nécessaire pour Next.js) + Google Analytics si utilisé
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              // Styles: self + inline (nécessaire pour Tailwind/styled-jsx)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Images: self + data URIs + sources autorisées
              "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://i.ytimg.com https://img.youtube.com https://*.fbcdn.net https://www.googletagmanager.com",
              // Polices
              "font-src 'self' https://fonts.gstatic.com",
              // Connexions (API, fetch, WebSocket)
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://api.resend.com",
              // Médias
              "media-src 'self' https://*.supabase.co",
              // Frames (YouTube embeds si nécessaire)
              "frame-src 'self' https://www.youtube.com https://youtube.com",
              // Formulaires
              "form-action 'self'",
              // Base URI
              "base-uri 'self'",
              // Objets (désactiver les plugins)
              "object-src 'none'",
              // Mise à niveau des requêtes HTTP vers HTTPS
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Politique de permissions (désactiver les fonctionnalités non utilisées)
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()', // Désactiver FLoC
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
            ].join(', '),
          },
          // Empêcher les requêtes cross-domain non autorisées
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
        ],
      },
      {
        // Headers spécifiques pour les routes API
        source: '/api/:path*',
        headers: [
          // Pas de cache pour les API
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
          // Empêcher l'indexation des API
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        // HSTS (HTTP Strict Transport Security)
        // Activer uniquement en production avec HTTPS
        source: '/:path*',
        headers: process.env.NODE_ENV === 'production' ? [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ] : [],
      },
    ]
  },
}

module.exports = nextConfig
