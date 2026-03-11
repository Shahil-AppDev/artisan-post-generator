# Deployment Guide

Complete guide to deploy Artisan Post Generator on a Linux VPS (Hetzner, OVH, etc.).

## Prerequisites

- Linux VPS (Ubuntu 22.04 recommended)
- Domain name (optional but recommended)
- SSH access to server
- Minimum 2GB RAM, 20GB storage

---

## 1. Server Setup

### Connect to your VPS
```bash
ssh root@your-server-ip
```

### Update system
```bash
apt update && apt upgrade -y
```

### Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

### Install Git
```bash
apt install git -y
```

---

## 2. Clone Repository

```bash
cd /opt
git clone <your-repo-url> artisan-post-generator
cd artisan-post-generator
```

---

## 3. Configure Environment Variables

### Backend Configuration
```bash
cd backend
cp .env.example .env
nano .env
```

Update the following variables:
```env
NODE_ENV=production
PORT=5000

# Database (use strong password!)
DATABASE_URL=postgresql://artisan_user:YOUR_STRONG_PASSWORD@postgres:5432/artisan_posts

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_very_long_random_secret_key_min_32_chars

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-key-here

# Cloudinary (optional, for cloud image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# n8n Webhook
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/artisan-posts

# CORS (your frontend URL)
CORS_ORIGIN=https://yourdomain.com

# Admin credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=change_this_strong_password
```

### Frontend Configuration
```bash
cd ../frontend
cp .env.example .env
nano .env
```

Update:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## 4. Update Docker Compose

Edit `docker-compose.yml`:
```bash
cd /opt/artisan-post-generator
nano docker-compose.yml
```

Update passwords and URLs to match your configuration.

---

## 5. Deploy with Docker

```bash
# Build and start containers
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Verify containers are running
docker-compose ps
```

---

## 6. Run Database Migrations

```bash
docker-compose exec backend npm run migrate
```

---

## 7. Configure Nginx Reverse Proxy

### Install Nginx
```bash
apt install nginx -y
```

### Create Nginx configuration
```bash
nano /etc/nginx/sites-available/artisan-posts
```

Add configuration:
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        client_max_body_size 50M;
    }
}
```

### Enable site
```bash
ln -s /etc/nginx/sites-available/artisan-posts /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 8. Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificates
certbot --nginx -d yourdomain.com -d www.yourdomain.com
certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

---

## 9. Configure Firewall

```bash
# Install UFW
apt install ufw -y

# Allow SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443

# Enable firewall
ufw enable
ufw status
```

---

## 10. Set Up Automatic Backups

### Database Backup Script
```bash
nano /opt/backup-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose -f /opt/artisan-post-generator/docker-compose.yml exec -T postgres pg_dump -U artisan_user artisan_posts > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

Make executable:
```bash
chmod +x /opt/backup-db.sh
```

### Add to Crontab
```bash
crontab -e
```

Add daily backup at 2 AM:
```
0 2 * * * /opt/backup-db.sh
```

---

## 11. Monitoring & Logs

### View application logs
```bash
cd /opt/artisan-post-generator

# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Database only
docker-compose logs -f postgres
```

### Check container status
```bash
docker-compose ps
```

### Restart services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

---

## 12. Updates & Maintenance

### Update application
```bash
cd /opt/artisan-post-generator
git pull
docker-compose down
docker-compose up -d --build
```

### Database migrations after update
```bash
docker-compose exec backend npm run migrate
```

---

## 13. Performance Optimization

### Enable Gzip in Nginx
Add to nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Increase upload limits
In nginx config:
```nginx
client_max_body_size 50M;
```

---

## 14. Security Checklist

- [ ] Change default admin password
- [ ] Use strong database password
- [ ] Generate unique JWT secret
- [ ] Enable firewall (UFW)
- [ ] Install SSL certificates
- [ ] Keep system updated
- [ ] Regular backups configured
- [ ] Restrict SSH access (key-based auth)
- [ ] Configure fail2ban (optional)

---

## 15. Troubleshooting

### Container won't start
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Database connection issues
```bash
docker-compose exec postgres psql -U artisan_user -d artisan_posts
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d --build
docker-compose exec backend npm run migrate
```

---

## Support

For issues, check:
1. Container logs: `docker-compose logs`
2. Nginx logs: `/var/log/nginx/error.log`
3. System logs: `journalctl -xe`

---

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Backups automated
- [ ] Admin password changed
- [ ] Domain DNS configured
- [ ] n8n webhook tested
- [ ] OpenAI API key valid
- [ ] Test user registration
- [ ] Test post creation
- [ ] Test automation workflow
