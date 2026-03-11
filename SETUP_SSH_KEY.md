# Configuration Clé SSH pour GitHub Actions

## 🔑 Clé SSH Générée

Une nouvelle clé SSH **sans passphrase** a été créée spécifiquement pour GitHub Actions.

**Emplacement** :
- Clé privée : `C:\Users\DarkNode\.ssh\github_actions_artisan`
- Clé publique : `C:\Users\DarkNode\.ssh\github_actions_artisan.pub`

## 📋 Étapes de Configuration

### 1. Ajouter la Clé Publique sur le Serveur

Connectez-vous au serveur :

```bash
ssh root@jh2o.business-services-idf.xyz
```

Puis ajoutez la clé publique (voir ci-dessous) :

```bash
echo 'VOTRE_CLE_PUBLIQUE_ICI' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 2. Mettre à Jour le Secret GitHub

Depuis votre machine locale, exécutez :

```powershell
Get-Content "$env:USERPROFILE\.ssh\github_actions_artisan" | gh secret set SSH_PRIVATE_KEY --repo Shahil-AppDev/artisan-post-generator
```

### 3. Vérifier la Connexion

Testez la connexion avec la nouvelle clé :

```powershell
ssh -i "$env:USERPROFILE\.ssh\github_actions_artisan" root@jh2o.business-services-idf.xyz "echo 'Connexion réussie!'"
```

### 4. Relancer le Workflow

```bash
gh workflow run deploy.yml --repo Shahil-AppDev/artisan-post-generator
```

## ✅ Vérification

Pour vérifier que la clé est bien ajoutée sur le serveur :

```bash
ssh root@jh2o.business-services-idf.xyz "cat ~/.ssh/authorized_keys | grep github-actions-artisan"
```

## 🔒 Sécurité

- ✅ Clé sans passphrase (nécessaire pour l'automatisation)
- ✅ Clé dédiée uniquement au déploiement
- ✅ Peut être révoquée facilement si nécessaire
- ✅ Commentaire identifiable : `github-actions-artisan-deploy`

## 📝 Note

Cette clé est différente de votre clé SSH personnelle. Elle est utilisée uniquement par GitHub Actions pour déployer automatiquement l'application.
