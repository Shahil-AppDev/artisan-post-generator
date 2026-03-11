# 🚀 Statut du Déploiement - Artisan Post Generator

## ✅ Étapes Complétées

### 1. Repository GitHub
- ✅ Repo créé : `https://github.com/Shahil-AppDev/artisan-post-generator`
- ✅ Code pushé sur la branche `main`
- ✅ 67 fichiers commités

### 2. Workflow GitHub Actions
- ✅ Fichier `.github/workflows/deploy.yml` créé
- ✅ Workflow déclenché avec succès
- 🔄 Déploiement en cours...

### 3. Secrets GitHub Configurés
- ✅ `SSH_PRIVATE_KEY` - Clé SSH pour connexion au serveur
- ✅ `DATABASE_URL` - `postgresql://artisan_user:Artisan2024Secure@localhost:5432/artisan_posts`
- ✅ `JWT_SECRET` - Secret pour authentification JWT
- ✅ `ADMIN_PASSWORD` - `Admin2024!Secure`
- ✅ `AI_API_KEY` - Clé DeepSeek configurée
- ✅ `CLOUDINARY_*` - Placeholders (à configurer si besoin)
- ✅ `N8N_WEBHOOK_URL` - Placeholder (à configurer si besoin)

### 4. Base de Données PostgreSQL
- ✅ Base de données `artisan_posts` créée sur le serveur
- ✅ Utilisateur `artisan_user` créé
- ⚠️ Permissions à finaliser (le workflow le fera)

### 5. Serveur Hetzner
- ✅ PM2 installé et prêt
- ✅ Ports disponibles : 5002 (backend), 3003 (frontend)
- ⏳ Nginx et SSL seront configurés par le workflow

## 🔄 Déploiement Automatique en Cours

Le workflow GitHub Actions va :
1. Se connecter au serveur via SSH
2. Cloner le code dans `/var/www/artisan-post-generator`
3. Installer les dépendances (backend + frontend)
4. Créer les fichiers `.env` avec les secrets
5. Exécuter les migrations de base de données
6. Démarrer les services avec PM2
7. Configurer Nginx pour le reverse proxy
8. Installer le certificat SSL avec Let's Encrypt

## 📊 Vérifier le Déploiement

### Voir les logs du workflow
```bash
gh run list --workflow=deploy.yml --repo Shahil-AppDev/artisan-post-generator
gh run view --repo Shahil-AppDev/artisan-post-generator
```

### Ou sur GitHub
https://github.com/Shahil-AppDev/artisan-post-generator/actions

## 🌐 URL de l'Application

Une fois le déploiement terminé (environ 5-10 minutes) :

**URL Production :** https://jh2o.business-services-idf.xyz

**Login Admin :**
- Email : `admin@artisan.com`
- Password : `Admin2024!Secure`

## 🔧 Configuration Post-Déploiement

### Si Cloudinary est nécessaire
Mettre à jour les secrets GitHub :
```bash
echo "VOTRE_CLOUD_NAME" | gh secret set CLOUDINARY_CLOUD_NAME --repo Shahil-AppDev/artisan-post-generator
echo "VOTRE_API_KEY" | gh secret set CLOUDINARY_API_KEY --repo Shahil-AppDev/artisan-post-generator
echo "VOTRE_API_SECRET" | gh secret set CLOUDINARY_API_SECRET --repo Shahil-AppDev/artisan-post-generator
```

### Si n8n est nécessaire
```bash
echo "https://votre-n8n.com/webhook/artisan" | gh secret set N8N_WEBHOOK_URL --repo Shahil-AppDev/artisan-post-generator
```

Puis redéclencher le déploiement :
```bash
gh workflow run deploy.yml --repo Shahil-AppDev/artisan-post-generator
```

## 🐛 Troubleshooting

### Voir les logs sur le serveur
```bash
ssh root@jh2o.business-services-idf.xyz
pm2 logs artisan-backend
pm2 logs artisan-frontend
```

### Redémarrer les services
```bash
ssh root@jh2o.business-services-idf.xyz
pm2 restart artisan-backend
pm2 restart artisan-frontend
```

### Vérifier Nginx
```bash
ssh root@jh2o.business-services-idf.xyz
nginx -t
systemctl status nginx
```

## 📝 Prochains Déploiements

Pour redéployer après des modifications :
```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Le workflow se déclenchera automatiquement !

## ✅ Checklist Finale

- [x] Repo GitHub créé
- [x] Code pushé
- [x] Secrets configurés
- [x] Base de données créée
- [x] Workflow déclenché
- [ ] Déploiement terminé (en cours...)
- [ ] Application accessible
- [ ] SSL actif
- [ ] Tests fonctionnels OK
