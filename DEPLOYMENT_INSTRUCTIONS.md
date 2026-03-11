# Instructions de Déploiement GitHub → Hetzner

## 📋 Étapes de déploiement

### 1. Créer le repo GitHub

```bash
# Sur GitHub, créer un nouveau repo : Shahil-AppDev/artisan-post-generator
# Puis localement :
git remote add origin https://github.com/Shahil-AppDev/artisan-post-generator.git
git branch -M main
git push -u origin main
```

### 2. Configurer les GitHub Secrets

Aller sur : `https://github.com/Shahil-AppDev/artisan-post-generator/settings/secrets/actions`

**Secrets à ajouter :**

```
SSH_PRIVATE_KEY = <contenu de votre clé SSH privée>
SSH_PASSPHRASE = <passphrase de votre clé SSH si applicable>
DATABASE_URL = postgresql://artisan_user:STRONG_PASSWORD@localhost:5432/artisan_posts
JWT_SECRET = <générer une chaîne aléatoire de 32+ caractères>
ADMIN_PASSWORD = <mot de passe admin fort>
AI_API_KEY = sk-b03741d7ef704e44aa96ea54cc81238f
CLOUDINARY_CLOUD_NAME = <optionnel>
CLOUDINARY_API_KEY = <optionnel>
CLOUDINARY_API_SECRET = <optionnel>
N8N_WEBHOOK_URL = <optionnel>
```

### 3. Préparer le serveur Hetzner

```bash
ssh root@jh2o.business-services-idf.xyz

# Installer PM2 si pas déjà fait
npm install -g pm2

# Créer la base de données PostgreSQL
sudo -u postgres psql
CREATE DATABASE artisan_posts;
CREATE USER artisan_user WITH PASSWORD 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE artisan_posts TO artisan_user;
\q

# Créer le répertoire
mkdir -p /var/www/artisan-post-generator
```

### 4. Déclencher le déploiement

**Option A : Push sur main**
```bash
git push origin main
```

**Option B : Déploiement manuel**
- Aller sur GitHub → Actions
- Sélectionner "Deploy to Hetzner"
- Cliquer "Run workflow"

### 5. Vérifier le déploiement

Le workflow va :
1. ✅ Cloner le code sur le serveur
2. ✅ Installer les dépendances (backend + frontend)
3. ✅ Créer les fichiers .env
4. ✅ Exécuter les migrations de base de données
5. ✅ Démarrer les services avec PM2
6. ✅ Configurer Nginx
7. ✅ Installer le certificat SSL

### 6. Accéder à l'application

**URL :** https://jh2o.business-services-idf.xyz

**Login par défaut :**
- Email : `admin@artisan.com`
- Password : (celui configuré dans ADMIN_PASSWORD)

## 🔧 Configuration des ports

- **Frontend** : Port 3003 (interne)
- **Backend** : Port 5002 (interne)
- **Nginx** : Reverse proxy sur ports 80/443

## 📊 Commandes utiles sur le serveur

```bash
# Voir les logs
pm2 logs artisan-backend
pm2 logs artisan-frontend

# Redémarrer les services
pm2 restart artisan-backend
pm2 restart artisan-frontend

# Voir le statut
pm2 status

# Voir les logs Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## 🔄 Redéploiement

Pour redéployer après des modifications :

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Le workflow GitHub Actions se déclenchera automatiquement.

## 🐛 Troubleshooting

### Le déploiement échoue
- Vérifier les secrets GitHub
- Vérifier les logs dans Actions
- Vérifier la connexion SSH au serveur

### L'application ne démarre pas
```bash
ssh root@jh2o.business-services-idf.xyz
pm2 logs artisan-backend
pm2 logs artisan-frontend
```

### Erreur de base de données
```bash
cd /var/www/artisan-post-generator/backend
npm run migrate
```

### SSL ne fonctionne pas
```bash
certbot --nginx -d jh2o.business-services-idf.xyz
```

## ✅ Checklist finale

- [ ] Repo GitHub créé
- [ ] Secrets GitHub configurés
- [ ] Base de données PostgreSQL créée sur le serveur
- [ ] PM2 installé sur le serveur
- [ ] Code pushé sur GitHub
- [ ] Workflow exécuté avec succès
- [ ] Application accessible sur https://jh2o.business-services-idf.xyz
- [ ] SSL actif
- [ ] Login admin fonctionne
- [ ] Génération AI DeepSeek fonctionne
