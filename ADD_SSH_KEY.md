# Ajouter la Clé SSH de Déploiement

## 🔑 Clé Publique à Ajouter

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEhrUbd6rvFjqtY6vrfBGfabEwQDV6iXCqCbl3s2oUjG github-actions-deploy
```

## 📋 Instructions

### Méthode 1 : Via SSH (Recommandé)

```bash
ssh root@jh2o.business-services-idf.xyz
```

Puis une fois connecté :

```bash
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEhrUbd6rvFjqtY6vrfBGfabEwQDV6iXCqCbl3s2oUjG github-actions-deploy' >> ~/.ssh/authorized_keys
exit
```

### Méthode 2 : En une seule commande

```bash
ssh root@jh2o.business-services-idf.xyz "echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEhrUbd6rvFjqtY6vrfBGfabEwQDV6iXCqCbl3s2oUjG github-actions-deploy' >> ~/.ssh/authorized_keys"
```

## ✅ Vérification

Après avoir ajouté la clé, vérifiez qu'elle est bien présente :

```bash
ssh root@jh2o.business-services-idf.xyz "cat ~/.ssh/authorized_keys | grep github-actions-deploy"
```

Vous devriez voir la ligne avec `github-actions-deploy` à la fin.

## 🚀 Relancer le Déploiement

Une fois la clé ajoutée, relancez le déploiement :

```bash
gh workflow run deploy.yml --repo Shahil-AppDev/artisan-post-generator
```

Ou allez sur GitHub Actions et cliquez sur "Run workflow" :
https://github.com/Shahil-AppDev/artisan-post-generator/actions/workflows/deploy.yml

## 📊 Suivre le Déploiement

```bash
gh run list --workflow=deploy.yml --repo Shahil-AppDev/artisan-post-generator
gh run watch --repo Shahil-AppDev/artisan-post-generator
```

## ℹ️ Informations

- **Clé privée** : Déjà configurée dans les secrets GitHub (`SSH_PRIVATE_KEY`)
- **Clé publique** : À ajouter sur le serveur (ci-dessus)
- **Passphrase** : Aucune (clé sans passphrase pour l'automatisation)
- **Usage** : Déploiement automatique via GitHub Actions uniquement
