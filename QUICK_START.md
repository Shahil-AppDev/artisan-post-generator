# Quick Start Guide

Get Artisan Post Generator running in 5 minutes.

## Prerequisites

- Docker & Docker Compose installed
- DeepSeek API key (recommandé, moins cher) ou OpenAI API key

## Steps

### 1. Clone or Extract Project

```bash
cd /path/to/artisan-post-generator
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:
- `AI_PROVIDER` - `deepseek` (recommandé) ou `openai`
- `AI_API_KEY` - Your DeepSeek or OpenAI API key
- `AI_MODEL` - `deepseek-chat` ou `gpt-4`
- `JWT_SECRET` - Random 32+ character string
- `ADMIN_PASSWORD` - Strong admin password

### 3. Configure Frontend

```bash
cd ../frontend
cp .env.example .env
```

Keep default values for local development.

### 4. Start Application

```bash
cd ..
docker-compose up -d
```

### 5. Run Database Migrations

```bash
docker-compose exec backend npm run migrate
```

### 6. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

### 7. Login

Default admin credentials:
- Email: `admin@artisan.com`
- Password: (the one you set in `ADMIN_PASSWORD`)

## What's Next?

1. **Create a user account** (or use admin)
2. **Create your first post**:
   - Upload 1-5 photos
   - Select job type
   - Click "Generate"
3. **Review and edit** the generated post
4. **Send to automation** (requires n8n setup)

## Optional: n8n Integration

1. Set up n8n instance
2. Create webhook workflow (see `docs/N8N_INTEGRATION.md`)
3. Update `N8N_WEBHOOK_URL` in backend `.env`
4. Restart backend: `docker-compose restart backend`

## Optional: DeepSeek vs OpenAI

**DeepSeek (Recommandé):**
- 💰 100x moins cher qu'OpenAI
- 🚀 Excellente qualité
- Créer un compte: https://platform.deepseek.com/

**OpenAI:**
- Plus connu mais plus cher
- Créer un compte: https://platform.openai.com/

Voir `docs/AI_PROVIDERS.md` pour comparaison détaillée.

## Optional: Cloudinary Setup

For cloud image storage:

1. Create Cloudinary account
2. Get credentials from dashboard
3. Update in backend `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Restart backend

## Troubleshooting

### Containers won't start
```bash
docker-compose logs
```

### Database connection error
```bash
docker-compose down -v
docker-compose up -d
docker-compose exec backend npm run migrate
```

### Port already in use
Edit `docker-compose.yml` and change ports:
```yaml
ports:
  - "3001:3000"  # Frontend
  - "5001:5000"  # Backend
```

## Production Deployment

See `docs/DEPLOYMENT.md` for complete VPS deployment guide.

## Need Help?

- API Documentation: `docs/API.md`
- Database Schema: `docs/DATABASE.md`
- n8n Integration: `docs/N8N_INTEGRATION.md`
- Full Deployment: `docs/DEPLOYMENT.md`
