# 🚀 Étapes Finales de Déploiement

## ✅ Ce qui est déjà fait

- ✅ Repository GitHub créé et code pushé
- ✅ Workflow GitHub Actions configuré
- ✅ Secrets GitHub configurés (incluant la nouvelle clé SSH)
- ✅ Base de données PostgreSQL créée sur le serveur
- ✅ Nouvelle clé SSH sans passphrase créée
- ✅ Script de déploiement complet créé

## ⚠️ Problème Actuel

Le serveur **jh2o.business-services-idf.xyz** (65.21.104.251) a un problème de connexion réseau temporaire. Le port 22 (SSH) est inaccessible depuis cette machine.

## 🔧 Solution

### Option 1 : Attendre que la connexion soit rétablie

Puis exécuter depuis votre machine locale :

```bash
ssh root@jh2o.business-services-idf.xyz
```

Une fois connecté, télécharger et exécuter le script :

```bash
curl -o deploy.sh https://raw.githubusercontent.com/Shahil-AppDev/artisan-post-generator/main/DEPLOY_COMPLETE.sh
bash deploy.sh
```

### Option 2 : Copier le script manuellement

1. Connectez-vous au serveur depuis un autre terminal/machine
2. Copiez le contenu de `DEPLOY_COMPLETE.sh`
3. Créez le fichier sur le serveur : `nano deploy.sh`
4. Collez le contenu
5. Exécutez : `bash deploy.sh`

### Option 3 : Exécuter les commandes une par une

Connectez-vous au serveur et exécutez :

```bash
# 1. Ajouter la clé SSH
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIJofrQfE1rYHVqXkajlnrzo040Ms/T/ZcQ4/EY1oIW8 github-actions-artisan-deploy' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 2. Cloner le code
mkdir -p /var/www/artisan-post-generator
cd /var/www/artisan-post-generator
git clone https://github.com/Shahil-AppDev/artisan-post-generator .

# 3. Backend
cd backend
npm install --production
cat > .env << 'EOF'
NODE_ENV=production
PORT=5002
DATABASE_URL=postgresql://artisan_user:Artisan2024Secure@localhost:5432/artisan_posts
JWT_SECRET=artisan_jwt_secret_2024_production_min_32_chars_long_secure
JWT_EXPIRES_IN=7d
AI_PROVIDER=deepseek
AI_API_KEY=sk-b03741d7ef704e44aa96ea54cc81238f
AI_MODEL=deepseek-chat
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/artisan-posts
CORS_ORIGIN=https://jh2o.business-services-idf.xyz
ADMIN_EMAIL=admin@artisan.com
ADMIN_PASSWORD=Admin2024!Secure
EOF
npm run migrate
pm2 start src/server.js --name artisan-backend
pm2 save

# 4. Frontend
cd ../frontend
npm install
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://jh2o.business-services-idf.xyz/api
EOF
npm run build
pm2 start npm --name artisan-frontend -- start -- -p 3003
pm2 save
```

## 🌐 Après le Déploiement

**URL** : https://jh2o.business-services-idf.xyz

**Login** :
- Email : `admin@artisan.com`
- Password : `Admin2024!Secure`

## 🔄 GitHub Actions

Une fois la clé SSH ajoutée sur le serveur, vous pourrez déclencher le déploiement automatique :

```bash
gh workflow run deploy.yml --repo Shahil-AppDev/artisan-post-generator
```

Ou sur : https://github.com/Shahil-AppDev/artisan-post-generator/actions

## 📝 Fichiers Créés

- **`DEPLOY_COMPLETE.sh`** - Script complet de déploiement
- **`ADD_SSH_KEY_COMMANDS.txt`** - Commandes pour la clé SSH
- **`INSTRUCTIONS_DEPLOIEMENT.txt`** - Guide détaillé
- **`QUICK_DEPLOY.sh`** - Script rapide
- **`DEPLOY_MANUAL.md`** - Documentation complète

## ✅ Checklist

- [x] Repo GitHub créé
- [x] Code pushé
- [x] Workflow configuré
- [x] Secrets GitHub configurés
- [x] Base de données créée
- [x] Clé SSH créée
- [x] Scripts de déploiement créés
- [ ] **Clé SSH ajoutée sur le serveur** ⬅️ À FAIRE
- [ ] **Application déployée** ⬅️ À FAIRE
- [ ] Tests fonctionnels

Tout est prêt ! Il suffit d'exécuter le script sur le serveur dès que la connexion sera rétablie. 🚀
