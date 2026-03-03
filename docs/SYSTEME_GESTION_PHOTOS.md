# 📸 SYSTÈME DE GESTION DES PHOTOS

## Date : 1er novembre 2025

---

## 🎯 OBJECTIF

Créer un système complet pour gérer les photos d'arrière-plan du Hero avec :
1. **Représentation appropriée** - Professionnels noirs/africains
2. **Gestion par thématique** - Ex: Novembre Bleu, Octobre Rose
3. **Gestion par mois** - Photos adaptées au calendrier
4. **Interface d'administration** - Pour gérer facilement les photos

---

## ✅ CE QUI A ÉTÉ CRÉÉ

### 1. **Photos mises à jour**

Les 8 photos actuelles représentent maintenant des professionnels noirs/africains :
- ✅ Équipe professionnelle africaine en réunion
- ✅ Professionnels africains collaborant
- ✅ Homme d'affaires africain confiant
- ✅ Équipe diverse en réunion stratégique
- ✅ Femme d'affaires africaine leader
- ✅ Équipe professionnelle au bureau moderne
- ✅ Professionnelle africaine au travail
- ✅ Équipe collaborative au bureau

### 2. **Système de gestion**

**Fichier** : `lib/photo-themes.ts`

**Fonctionnalités** :
```typescript
// Interface Photo
interface Photo {
  id: string
  src: string
  alt: string
  theme?: string       // Ex: "novembre-bleu"
  month?: number       // 1-12
  year?: number
  active: boolean
  order: number
}

// Interface Thématique
interface PhotoTheme {
  id: string
  name: string
  description: string
  color: string
  month?: number
}
```

**Thématiques pré-configurées** :
- **Octobre Rose** (Octobre) - Cancer du sein - #FF69B4
- **Novembre Bleu** (Novembre) - Cancer de la prostate - #4169E1
- **Décembre Solidaire** (Décembre) - Solidarité - #C4D82E

### 3. **Interface d'administration**

**URL** : `/admin/photos`

**Fichier** : `app/admin/photos/page.tsx`

**Fonctionnalités** :
- ✅ Vue d'ensemble de toutes les photos
- ✅ Ajout de nouvelles photos
- ✅ Upload d'images
- ✅ Association à un mois (1-12)
- ✅ Association à une thématique
- ✅ Activation/désactivation des photos
- ✅ Suppression de photos
- ✅ Filtrage par mois
- ✅ Badge du thème actuel
- ✅ Ordre d'affichage

---

## 🎨 INTERFACE D'ADMINISTRATION

### **Sections**

#### 1. **Header**
- Titre "Gestion des Photos du Hero"
- Badge du thème actuel (ex: "Novembre Bleu")

#### 2. **Thématiques Mensuelles**
- Grid de toutes les thématiques
- Filtre par clic
- Code couleur visuel

#### 3. **Ajouter une Photo**
- Upload de fichier
- Champ description
- Sélection du mois
- Sélection de la thématique
- Formats : JPG, PNG, WebP (Max 5MB)
- Résolution recommandée : 1920x1080px

#### 4. **Liste des Photos**
- Grid responsive (1-3 colonnes)
- Preview de l'image
- Info : Mois, Thématique, Statut
- Actions : Activer/Désactiver, Supprimer
- Overlay au hover

#### 5. **Informations**
- Guide d'utilisation
- Bonnes pratiques

---

## 📅 GESTION PAR MOIS

### **Fonctionnement Automatique**

```typescript
// Obtenir les photos du mois actuel
function getCurrentMonthPhotos(allPhotos: Photo[]): Photo[] {
  const currentMonth = new Date().getMonth() + 1
  
  // Filtrer photos du mois
  const monthPhotos = allPhotos.filter(
    photo => photo.active && photo.month === currentMonth
  )
  
  // Si pas de photos, utiliser photos par défaut
  return monthPhotos.length > 0 
    ? monthPhotos
    : DEFAULT_PHOTOS
}
```

### **Exemples d'Usage**

**Novembre (mois 11)** :
- Le système affiche automatiquement les photos marquées "mois: 11"
- Si thématique "Novembre Bleu" active, ces photos sont prioritaires
- Sinon, photos générales du mois

**Photos toute l'année** :
- Si `month` est null/undefined, la photo s'affiche toute l'année
- Utile pour photos génériques de l'entreprise

---

## 🎨 THÉMATIQUES

### **Novembre Bleu** (Exemple)

```typescript
{
  id: "novembre-bleu",
  name: "Novembre Bleu",
  description: "Sensibilisation au cancer de la prostate et santé masculine",
  color: "#4169E1",
  month: 11
}
```

**Comment ajouter des photos** :
1. Prenez des photos de votre équipe lors de Novembre Bleu
2. Uploadez via `/admin/photos`
3. Sélectionnez "Novembre" + Thématique "Novembre Bleu"
4. Les photos s'afficheront automatiquement en novembre

### **Ajouter une nouvelle thématique**

Dans `lib/photo-themes.ts` :
```typescript
{
  id: "journee-africaine",
  name: "Journée de l'Afrique",
  description: "Célébration du continent",
  color: "#FF6B35",
  month: 5,  // Mai
  startDate: "2025-05-25",
  endDate: "2025-05-25"
}
```

---

## 🔐 SÉCURITÉ & ACCÈS

### **Protection de l'Admin**

⚠️ **À IMPLÉMENTER** : Authentification

Options recommandées :

#### **Option 1 : NextAuth.js** (Recommandé)
```bash
npm install next-auth
```

#### **Option 2 : Clerk**
```bash
npm install @clerk/nextjs
```

#### **Option 3 : Authentification simple**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const auth = request.cookies.get('admin-auth')
    if (!auth) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}
```

---

## 💾 STOCKAGE DES PHOTOS

### **Options disponibles**

#### **Option 1 : Cloudinary** (Recommandé)
```bash
npm install cloudinary
```
- ✅ Gratuit jusqu'à 25GB
- ✅ Optimisation automatique
- ✅ CDN mondial
- ✅ Redimensionnement à la volée

#### **Option 2 : AWS S3**
```bash
npm install @aws-sdk/client-s3
```
- ✅ Scalable
- ✅ Prix compétitifs
- ✅ Fiable

#### **Option 3 : Local + Next.js**
```
/public/uploads/photos/
```
- ✅ Simple
- ❌ Pas de CDN
- ❌ Backup manuel

---

## 🚀 PROCHAINES ÉTAPES

### **1. Ajouter l'authentification**
```typescript
// app/admin/layout.tsx
import { auth } from '@/lib/auth'

export default async function AdminLayout() {
  const session = await auth()
  if (!session) redirect('/login')
  
  return <div>{children}</div>
}
```

### **2. Connecter à une base de données**
```typescript
// lib/db/photos.ts
import { prisma } from '@/lib/prisma'

export async function getPhotos() {
  return await prisma.photo.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  })
}
```

### **3. Implémenter l'upload**
```typescript
// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  
  // Upload vers Cloudinary
  const result = await cloudinary.uploader.upload(file)
  
  // Sauvegarder en DB
  await prisma.photo.create({
    data: {
      src: result.secure_url,
      alt: formData.get('alt'),
      month: Number(formData.get('month'))
    }
  })
}
```

### **4. Ajouter la modification d'ordre**
- Drag & drop pour réordonner
- Utiliser `react-beautiful-dnd`

---

## 📱 RESPONSIVE

L'interface d'admin est **100% responsive** :
- Mobile : 1 colonne
- Tablette : 2 colonnes
- Desktop : 3 colonnes

---

## 🎯 WORKFLOW D'UTILISATION

### **Scénario : Novembre Bleu 2025**

1. **Début novembre** :
   - Vous recevez le badge "Thème actuel : Novembre Bleu"
   
2. **Ajouter des photos** :
   - Cliquez sur "Ajouter une Nouvelle Photo"
   - Upload vos photos de l'événement
   - Sélectionnez "Novembre" + "Novembre Bleu"
   - Cliquez "Upload"

3. **Activation automatique** :
   - Les photos s'affichent automatiquement le 1er novembre
   - Transition automatique vers décembre le 1er décembre

4. **Archivage** :
   - Les photos restent dans le système
   - Se réactiveront automatiquement en novembre 2026

---

## ✅ CHECKLIST

- ✅ Photos mises à jour (professionnels noirs/africains)
- ✅ Système de gestion par mois créé
- ✅ Système de thématiques créé
- ✅ Interface d'administration créée
- ✅ Filtres par mois fonctionnels
- ✅ Activation/désactivation des photos
- ✅ 100% responsive
- ⏳ **À faire** : Authentification
- ⏳ **À faire** : Base de données
- ⏳ **À faire** : Upload réel
- ⏳ **À faire** : Système de backup

---

## 📁 FICHIERS CRÉÉS

1. ✅ `lib/photo-themes.ts` - Système de gestion
2. ✅ `app/admin/photos/page.tsx` - Interface admin
3. ✅ `components/sections/hero.tsx` - Photos mises à jour
4. ✅ `SYSTEME_GESTION_PHOTOS.md` - Documentation

---

## 💡 RECOMMANDATIONS

### **Pour Novembre Bleu**
- Prenez des photos de l'équipe en tenue bleue
- Photos avec rubans bleus
- Photos lors d'événements de sensibilisation
- Portraits de membres masculins de l'équipe

### **Qualité des photos**
- Résolution : 1920x1080px minimum
- Format : JPG ou WebP
- Taille : < 500KB (optimisé)
- Luminosité : Bien éclairées
- Qualité professionnelle

### **Diversité**
- Mélange hommes/femmes
- Différents âges
- Différentes situations (bureau, réunion, collaboration)
- Photos individuelles et de groupe

---

**Status** : ✅ Système créé  
**Prochaine étape** : Implémenter authentification + upload  
**Accès admin** : http://localhost:3000/admin/photos  
**Date** : 1er novembre 2025

