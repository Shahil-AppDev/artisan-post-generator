#!/bin/bash
# Script de déploiement complet - Artisan Post Generator
# À exécuter sur le serveur : bash DEPLOY_COMPLETE.sh

set -e

echo "════════════════════════════════════════════════════════"
echo "  DÉPLOIEMENT ARTISAN POST GENERATOR"
echo "════════════════════════════════════════════════════════"
echo ""

# 1. Ajouter la clé SSH GitHub Actions
echo "🔑 Ajout de la clé SSH GitHub Actions..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIJofrQfE1rYHVqXkajlnrzo040Ms/T/ZcQ4/EY1oIW8 github-actions-artisan-deploy' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo "✅ Clé SSH ajoutée"
echo ""

# 2. Créer le répertoire et cloner le code
echo "📁 Création du répertoire de déploiement..."
mkdir -p /var/www/artisan-post-generator
cd /var/www/artisan-post-generator

if [ -d ".git" ]; then
  echo "📥 Pull des dernières modifications..."
  git pull origin main
else
  echo "📥 Clone du repository..."
  git clone https://github.com/Shahil-AppDev/artisan-post-generator .
fi
echo "✅ Code récupéré"
echo ""

# 3. Configuration Backend
echo "🔧 Configuration Backend..."
cd backend
echo "   Installation des dépendances..."
npm install --production

echo "   Création du fichier .env..."
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

echo "   Exécution des migrations..."
npm run migrate || echo "   ⚠️  Migrations déjà exécutées"

echo "   Démarrage du backend avec PM2..."
pm2 delete artisan-backend 2>/dev/null || true
pm2 start src/server.js --name artisan-backend
pm2 save
echo "✅ Backend configuré"
echo ""

# 4. Configuration Frontend
echo "🎨 Configuration Frontend..."
cd ../frontend
echo "   Installation des dépendances..."
npm install

echo "   Création du fichier .env.production..."
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://jh2o.business-services-idf.xyz/api
EOF

echo "   Build du frontend..."
npm run build

echo "   Démarrage du frontend avec PM2..."
pm2 delete artisan-frontend 2>/dev/null || true
pm2 start npm --name artisan-frontend -- start -- -p 3003
pm2 save
echo "✅ Frontend configuré"
echo ""

# 5. Configuration Nginx (si nécessaire)
echo "🌐 Vérification de la configuration Nginx..."
if [ ! -f "/etc/nginx/sites-available/artisan-post-generator" ]; then
  echo "   Création de la configuration Nginx..."
  cat > /etc/nginx/sites-available/artisan-post-generator << 'NGINX_EOF'
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
NGINX_EOF

  ln -sf /etc/nginx/sites-available/artisan-post-generator /etc/nginx/sites-enabled/
  nginx -t && systemctl reload nginx
  echo "✅ Nginx configuré"
  
  echo "   Installation du certificat SSL..."
  certbot --nginx -d jh2o.business-services-idf.xyz --non-interactive --agree-tos --email admin@business-services-idf.xyz || echo "   ⚠️  SSL à configurer manuellement"
else
  echo "   Nginx déjà configuré, reload..."
  nginx -t && systemctl reload nginx
  echo "✅ Nginx rechargé"
fi
echo ""

# 6. Résumé
echo "════════════════════════════════════════════════════════"
echo "  ✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📊 Statut des services:"
pm2 status
echo ""
echo "🌐 URL: https://jh2o.business-services-idf.xyz"
echo "👤 Login: admin@artisan.com / Admin2024!Secure"
echo ""
echo "📝 Commandes utiles:"
echo "   pm2 logs artisan-backend    # Voir les logs backend"
echo "   pm2 logs artisan-frontend   # Voir les logs frontend"
echo "   pm2 restart artisan-backend # Redémarrer backend"
echo "   pm2 restart artisan-frontend # Redémarrer frontend"
echo ""
echo "════════════════════════════════════════════════════════"
