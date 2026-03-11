# GitHub Secrets à configurer

Pour que le déploiement automatique fonctionne, configurez ces secrets dans GitHub :

**Settings → Secrets and variables → Actions → New repository secret**

## Secrets requis

### SSH Access
- `SSH_PRIVATE_KEY` : Votre clé privée SSH (contenu de ~/.ssh/id_ed25519)
- `SSH_PASSPHRASE` : Passphrase de votre clé SSH (si applicable)

### Database
- `DATABASE_URL` : `postgresql://artisan_user:PASSWORD@localhost:5432/artisan_posts`

### Authentication
- `JWT_SECRET` : Chaîne aléatoire de 32+ caractères
- `ADMIN_PASSWORD` : Mot de passe admin fort

### AI (DeepSeek)
- `AI_API_KEY` : `sk-b03741d7ef704e44aa96ea54cc81238f`

### Cloudinary (optionnel)
- `CLOUDINARY_CLOUD_NAME` : Votre cloud name
- `CLOUDINARY_API_KEY` : Votre API key
- `CLOUDINARY_API_SECRET` : Votre API secret

### n8n (optionnel)
- `N8N_WEBHOOK_URL` : URL de votre webhook n8n

## Comment ajouter les secrets

1. Aller sur https://github.com/jh2o/artisan-post-generator/settings/secrets/actions
2. Cliquer sur "New repository secret"
3. Nom : (ex: SSH_PRIVATE_KEY)
4. Value : (coller la valeur)
5. Cliquer "Add secret"
6. Répéter pour chaque secret

## Vérifier le déploiement

Après avoir configuré les secrets :
1. Push du code sur main
2. Aller dans "Actions" sur GitHub
3. Voir le workflow "Deploy to Hetzner" s'exécuter
4. L'application sera accessible sur https://jh2o.business-services-idf.xyz
