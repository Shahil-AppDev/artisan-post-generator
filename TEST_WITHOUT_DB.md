# Test de l'Application Sans Base de Données

Pour tester rapidement l'application sans PostgreSQL, voici les étapes :

## ⚠️ Limitations du Test

Sans base de données PostgreSQL :
- ❌ L'authentification ne fonctionnera pas
- ❌ Les posts ne seront pas sauvegardés
- ✅ Le frontend s'affichera correctement
- ✅ L'interface utilisateur sera testable
- ✅ La génération AI fonctionnera (si clé API configurée)

## 🚀 Lancement Frontend Seul

```bash
cd frontend
npm run dev
```

Accès : http://localhost:3000

## 📋 Pour un Test Complet

Vous avez besoin de PostgreSQL. Options :

### Option 1: Docker Desktop (Recommandé)
1. Démarrer Docker Desktop
2. `docker-compose up -d`
3. `docker-compose exec backend npm run migrate`

### Option 2: PostgreSQL Local
1. Installer PostgreSQL : https://www.postgresql.org/download/windows/
2. Créer la base de données :
```sql
CREATE DATABASE artisan_posts;
```
3. Lancer backend : `cd backend && npm run dev`
4. Lancer frontend : `cd frontend && npm run dev`

### Option 3: PostgreSQL Cloud (Gratuit)
1. Créer un compte sur https://neon.tech/ (gratuit)
2. Créer une base de données
3. Copier la connection string
4. Mettre à jour `backend/.env` :
```env
DATABASE_URL=postgresql://user:password@host.neon.tech/artisan_posts
```
5. Lancer : `npm run dev` dans backend et frontend

## 🎯 Test Rapide du Frontend

Le frontend peut être testé indépendamment :

```bash
cd frontend
npm run dev
```

Vous verrez l'interface mais l'authentification échouera sans backend.
