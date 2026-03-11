#!/bin/bash
# Script de déploiement ultra-rapide
# À exécuter directement sur le serveur après connexion SSH

set -e

echo "🚀 Déploiement Artisan Post Generator"
echo "======================================"

# Création et navigation
mkdir -p /var/www/artisan-post-generator
cd /var/www/artisan-post-generator

# Clone ou pull
if [ -d ".git" ]; then
  echo "📥 Pull..."
  git pull origin main
else
  echo "📥 Clone..."
  git clone https://github.com/Shahil-AppDev/artisan-post-generator .
fi

# Backend
echo "🔧 Backend..."
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

npm run migrate || echo "⚠️ Migrations déjà faites"
pm2 delete artisan-backend 2>/dev/null || true
pm2 start src/server.js --name artisan-backend
pm2 save

# Frontend
echo "🎨 Frontend..."
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
echo "📊 Statut:"
pm2 status
echo ""
echo "🌐 URL: https://jh2o.business-services-idf.xyz"
echo "👤 Login: admin@artisan.com / Admin2024!Secure"
