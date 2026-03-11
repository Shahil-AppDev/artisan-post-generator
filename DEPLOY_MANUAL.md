# Déploiement Manuel - Artisan Post Generator

## 🚀 Déploiement Rapide

### Étape 1 : Se connecter au serveur

```bash
ssh root@jh2o.business-services-idf.xyz
# ou
ssh root@65.21.104.251
```

### Étape 2 : Exécuter le script de déploiement

Copiez-collez ce script complet dans votre terminal SSH :

```bash
#!/bin/bash
set -e

echo "🚀 Déploiement Artisan Post Generator"
echo "======================================"

# Création du répertoire
mkdir -p /var/www/artisan-post-generator
cd /var/www/artisan-post-generator

# Clone ou pull du code
if [ -d ".git" ]; then
  echo "📥 Pull des dernières modifications..."
  git pull origin main
else
  echo "📥 Clone du repository..."
  git clone https://github.com/Shahil-AppDev/artisan-post-generator .
fi

# Backend
echo ""
echo "🔧 Configuration Backend..."
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

npm run migrate || echo "⚠️ Migrations déjà exécutées"

pm2 delete artisan-backend 2>/dev/null || true
pm2 start src/server.js --name artisan-backend
pm2 save

# Frontend
echo ""
echo "🎨 Configuration Frontend..."
cd ../frontend
npm install

cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://jh2o.business-services-idf.xyz/api
EOF

npm run build

pm2 delete artisan-frontend 2>/dev/null || true
pm2 start npm --name artisan-frontend -- start -- -p 3003
pm2 save

echo ""
echo "✅ Déploiement terminé!"
pm2 status
```

### Étape 3 : Configurer Nginx (première fois seulement)

Si ce n'est pas déjà fait, configurez Nginx :

```bash
cat > /etc/nginx/sites-available/artisan-post-generator << 'EOF'
server {
    listen 80;
    server_name jh2o.business-services-idf.xyz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name jh2o.business-services-idf.xyz;
    
    ssl_certificate /etc/letsencrypt/live/jh2o.business-services-idf.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jh2o.business-services-idf.xyz/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    client_max_body_size 50M;
}
EOF

ln -sf /etc/nginx/sites-available/artisan-post-generator /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Installer SSL
certbot --nginx -d jh2o.business-services-idf.xyz --non-interactive --agree-tos --email admin@business-services-idf.xyz
```

## ✅ Vérification

Après le déploiement :

```bash
# Vérifier les services
pm2 status

# Voir les logs
pm2 logs artisan-backend --lines 50
pm2 logs artisan-frontend --lines 50

# Tester l'API
curl http://localhost:5002/
```

## 🌐 Accès à l'Application

**URL** : https://jh2o.business-services-idf.xyz

**Login Admin** :
- Email : `admin@artisan.com`
- Password : `Admin2024!Secure`

## 🔄 Redéploiement

Pour mettre à jour l'application après des modifications :

```bash
ssh root@jh2o.business-services-idf.xyz
cd /var/www/artisan-post-generator
git pull origin main
cd backend && npm install --production && pm2 restart artisan-backend
cd ../frontend && npm install && npm run build && pm2 restart artisan-frontend
```

## 📊 Commandes Utiles

```bash
# Statut des services
pm2 status

# Logs en temps réel
pm2 logs

# Redémarrer un service
pm2 restart artisan-backend
pm2 restart artisan-frontend

# Arrêter un service
pm2 stop artisan-backend
pm2 stop artisan-frontend

# Supprimer un service
pm2 delete artisan-backend
pm2 delete artisan-frontend
```

## 🐛 Dépannage

### Backend ne démarre pas
```bash
cd /var/www/artisan-post-generator/backend
npm run migrate
pm2 restart artisan-backend
pm2 logs artisan-backend
```

### Frontend ne démarre pas
```bash
cd /var/www/artisan-post-generator/frontend
rm -rf .next
npm run build
pm2 restart artisan-frontend
pm2 logs artisan-frontend
```

### Erreur de base de données
```bash
sudo -u postgres psql
\c artisan_posts
\dt
\q
```

## 📝 Informations

- **Repository** : https://github.com/Shahil-AppDev/artisan-post-generator
- **Backend Port** : 5002
- **Frontend Port** : 3003
- **Database** : PostgreSQL (artisan_posts)
- **AI Provider** : DeepSeek
