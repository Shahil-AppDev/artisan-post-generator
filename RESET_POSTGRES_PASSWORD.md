# Réinitialiser le mot de passe PostgreSQL

## Méthode 1: Modifier pg_hba.conf (Temporaire)

1. Ouvrir le fichier de configuration PostgreSQL :
   - Aller dans : `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`
   - Ouvrir avec un éditeur de texte (en tant qu'administrateur)

2. Trouver la ligne :
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

3. Remplacer `scram-sha-256` par `trust` :
   ```
   host    all             all             127.0.0.1/32            trust
   ```

4. Redémarrer le service PostgreSQL :
   ```powershell
   Restart-Service postgresql-x64-18
   ```

5. Se connecter sans mot de passe et changer le mot de passe :
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
   ALTER USER postgres WITH PASSWORD 'nouveaumotdepasse';
   \q
   ```

6. Remettre `trust` en `scram-sha-256` dans pg_hba.conf

7. Redémarrer PostgreSQL à nouveau

## Méthode 2: Utiliser PostgreSQL 16 (déjà installé)

Vous avez aussi PostgreSQL 16 qui tourne. Essayez avec celui-là :

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d artisan_posts
```

## Méthode 3: Solution rapide - Base de données cloud

Si vous ne voulez pas gérer les mots de passe locaux :

1. Aller sur https://neon.tech/
2. Créer un compte gratuit
3. Créer une base de données PostgreSQL
4. Copier la connection string
5. Mettre à jour `backend/.env` ligne 4

## Pour l'application Artisan Post Generator

Une fois le mot de passe trouvé/réinitialisé, mettez-le dans :

**Fichier:** `backend/.env`
**Ligne 4:**
```env
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/artisan_posts
```

Puis exécutez :
```bash
cd backend
npm run migrate
```
