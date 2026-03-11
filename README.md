# Artisan Post Generator

A complete production-ready web application that allows artisans (plumbers, HVAC installers, electricians, etc.) to generate social media posts automatically from their phone after uploading job photos.

## Features

- 📱 Mobile-first PWA design
- 🔐 JWT authentication
- 📸 Multi-image upload (1-5 photos)
- 🤖 AI-powered post generation
- 🔄 n8n webhook integration for automation
- 📊 Post history tracking
- 👨‍💼 Admin panel
- 🐳 Docker deployment ready

## Tech Stack

### Frontend
- Next.js 14
- React
- TailwindCSS
- PWA enabled

### Backend
- Node.js
- Express
- PostgreSQL
- JWT authentication

### Services
- Cloudinary (image storage)
- DeepSeek ou OpenAI (AI generation)
- n8n (automation)

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 15+

### Local Development

1. Clone the repository
```bash
git clone <repo-url>
cd artisan-post-generator
```

2. Set up environment variables
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start with Docker Compose
```bash
docker-compose up -d
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Manual Setup

#### Backend
```bash
cd backend
npm install
npm run migrate
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed VPS deployment instructions.

## API Documentation

See [API.md](./docs/API.md) for complete API reference.

## Database Schema

See [DATABASE.md](./docs/DATABASE.md) for database structure.

## n8n Integration

See [N8N_INTEGRATION.md](./docs/N8N_INTEGRATION.md) for webhook setup.

## License

MIT
