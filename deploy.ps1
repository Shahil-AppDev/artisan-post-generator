# Script de déploiement PowerShell pour Artisan Post Generator
# Usage: .\deploy.ps1

$ServerHost = "jh2o.business-services-idf.xyz"
$ServerUser = "root"

Write-Host "🚀 Déploiement de Artisan Post Generator sur $ServerHost" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

$deployScript = @'
set -e

echo "📁 Création du répertoire de déploiement..."
mkdir -p /var/www/artisan-post-generator
cd /var/www/artisan-post-generator

echo "📥 Clone/Pull du code..."
if [ -d ".git" ]; then
  echo "   Repository existe, pull des dernières modifications..."
  git pull origin main
else
  echo "   Clone du repository..."
  git clone https://github.com/Shahil-AppDev/artisan-post-generator .
fi

echo ""
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
npm run migrate || echo "   ⚠️  Migrations échouées (peut-être déjà exécutées)"

echo "   Redémarrage du backend avec PM2..."
pm2 delete artisan-backend 2>/dev/null || true
pm2 start src/server.js --name artisan-backend
pm2 save

echo ""
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

echo "   Redémarrage du frontend avec PM2..."
pm2 delete artisan-frontend 2>/dev/null || true
pm2 start npm --name artisan-frontend -- start -- -p 3003
pm2 save

echo ""
echo "✅ Déploiement terminé avec succès!"
echo ""
echo "📊 Statut des services:"
pm2 status

echo ""
echo "🌐 Application accessible sur: https://jh2o.business-services-idf.xyz"
echo "👤 Login: admin@artisan.com / Admin2024!Secure"
'@

ssh "$ServerUser@$ServerHost" $deployScript

Write-Host ""
Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "🌐 URL: https://jh2o.business-services-idf.xyz" -ForegroundColor Cyan
