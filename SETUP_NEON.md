# Configuration PostgreSQL Cloud Gratuit (Neon)

La solution la plus rapide pour tester l'application sans installer PostgreSQL localement.

## 🚀 Étapes (5 minutes)

### 1. Créer un compte Neon (gratuit)

1. Aller sur **https://neon.tech/**
2. Cliquer sur "Sign Up" (gratuit, pas de carte bancaire)
3. Se connecter avec GitHub ou Google

### 2. Créer une base de données

1. Cliquer sur "Create a project"
2. Nom du projet : `artisan-posts`
3. Région : Choisir la plus proche (Europe)
4. PostgreSQL version : 15 ou 16
5. Cliquer sur "Create project"

### 3. Copier la connection string

Neon vous donnera une connection string comme :

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### 4. Configurer l'application

Ouvrir `backend/.env` et remplacer la ligne `DATABASE_URL` :

```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### 5. Lancer le backend

```bash
cd backend
npm run migrate
npm run dev
```

### 6. Le frontend est déjà lancé

Il tourne sur http://localhost:3000

## ✅ Test complet

Une fois le backend démarré :

1. Ouvrir http://localhost:3000
2. Créer un compte ou se connecter avec :
   - Email : `admin@artisan.com`
   - Password : `Admin123!Change`
3. Tester la création de post avec photos
4. Vérifier la génération AI

## 💰 Gratuit

- **Neon Free Tier** : 
  - 0.5 GB stockage
  - Largement suffisant pour ce projet
  - Pas de carte bancaire requise
  - Pas d'expiration

## 🔄 Alternative : Docker

Si vous préférez Docker :

```bash
# Démarrer Docker Desktop puis :
docker-compose up -d
docker-compose exec backend npm run migrate
```

Accès : http://localhost:3000
