#!/bin/bash
# Configuration Nginx sans SSL (temporaire)
set -e

echo "📝 Création de la configuration Nginx (HTTP seulement)..."
cat > /etc/nginx/sites-available/artisan-post-generator << 'EOF'
server {
    listen 80;
    server_name jh2o.business-services-idf.xyz;
    
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
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    client_max_body_size 50M;
}
EOF

echo "✅ Configuration créée"

# Activer la configuration
echo "🔗 Activation..."
ln -sf /etc/nginx/sites-available/artisan-post-generator /etc/nginx/sites-enabled/

# Tester
echo "🧪 Test de la configuration..."
nginx -t

# Recharger
echo "🔄 Rechargement de Nginx..."
systemctl reload nginx

echo "✅ Nginx configuré (HTTP)"
echo "🌐 URL: http://jh2o.business-services-idf.xyz"
echo ""
echo "Pour ajouter SSL, exécutez :"
echo "sudo certbot --nginx -d jh2o.business-services-idf.xyz"
