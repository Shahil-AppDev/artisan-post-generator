#!/bin/bash
# Script de configuration Nginx pour Artisan Post Generator
# À exécuter sur le serveur après connexion SSH

set -e

echo "════════════════════════════════════════════════════════"
echo "  CONFIGURATION NGINX - ARTISAN POST GENERATOR"
echo "════════════════════════════════════════════════════════"
echo ""

# Créer la configuration Nginx
echo "📝 Création de la configuration Nginx..."
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
    
    # Frontend Artisan (port 3005)
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API Artisan (port 5002)
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
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    client_max_body_size 50M;
}
EOF

echo "✅ Configuration créée"
echo ""

# Activer la configuration
echo "🔗 Activation de la configuration..."
ln -sf /etc/nginx/sites-available/artisan-post-generator /etc/nginx/sites-enabled/
echo "✅ Configuration activée"
echo ""

# Tester la configuration Nginx
echo "🧪 Test de la configuration Nginx..."
nginx -t
echo "✅ Configuration valide"
echo ""

# Recharger Nginx
echo "🔄 Rechargement de Nginx..."
systemctl reload nginx
echo "✅ Nginx rechargé"
echo ""

# Vérifier les services PM2
echo "📊 État des services PM2..."
pm2 status
echo ""

# Tester l'application
echo "🧪 Test de l'application..."
echo "Frontend:"
curl -I http://localhost:3005/ 2>/dev/null | head -n 1
echo "Backend:"
curl -I http://localhost:5002/ 2>/dev/null | head -n 1
echo ""

echo "════════════════════════════════════════════════════════"
echo "  ✅ CONFIGURATION TERMINÉE !"
echo "════════════════════════════════════════════════════════"
echo ""
echo "🌐 URL : https://jh2o.business-services-idf.xyz"
echo "👤 Login : admin@artisan.com"
echo "🔑 Password : Admin2024!Secure"
echo ""
echo "📝 Services déployés :"
echo "   - Frontend : port 3005"
echo "   - Backend : port 5002"
echo ""
echo "════════════════════════════════════════════════════════"
