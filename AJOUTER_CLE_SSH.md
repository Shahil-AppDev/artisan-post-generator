# 🔑 Ajouter la Clé SSH sur le Serveur Hetzner

## ✅ Clé SSH Créée

**Nom** : `hetzner_jh2o`  
**Emplacement** : `C:\Users\DarkNode\.ssh\hetzner_jh2o`  
**Type** : ed25519 (sans passphrase)

## 📋 Clé Publique à Ajouter

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILol5g+cz+Ap2Z2zzMiuMrPXc8iXxJLsmyFL4yJ3/Zcw hetzner-jh2o-artisan
```

## 🚀 Méthodes pour Ajouter la Clé

### Méthode 1 : Via le Panneau Hetzner Cloud (Recommandé)

1. Allez sur https://console.hetzner.cloud
2. Sélectionnez votre projet
3. Menu **"Security"** → **"SSH Keys"**
4. Cliquez sur **"Add SSH Key"**
5. Collez la clé publique ci-dessus
6. Nom : `hetzner-jh2o-artisan`
7. Cliquez **"Add SSH Key"**

### Méthode 2 : Directement sur le Serveur

Si vous avez déjà accès SSH au serveur :

```bash
ssh root@jh2o.business-services-idf.xyz
```

Puis exécutez :

```bash
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILol5g+cz+Ap2Z2zzMiuMrPXc8iXxJLsmyFL4yJ3/Zcw hetzner-jh2o-artisan' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Méthode 3 : Via Console Hetzner (Accès Direct)

1. Allez sur https://console.hetzner.cloud
2. Sélectionnez votre serveur
3. Cliquez sur **"Console"** (accès direct au serveur)
4. Connectez-vous en tant que root
5. Exécutez les commandes de la Méthode 2

## ✅ Tester la Connexion

Une fois la clé ajoutée, testez depuis votre machine locale :

```powershell
ssh -i "$env:USERPROFILE\.ssh\hetzner_jh2o" root@jh2o.business-services-idf.xyz
```

Si la connexion fonctionne, vous verrez le prompt du serveur ! 🎉

## 🚀 Déployer l'Application

Une fois la connexion SSH fonctionnelle :

```powershell
ssh -i "$env:USERPROFILE\.ssh\hetzner_jh2o" root@jh2o.business-services-idf.xyz "bash -s" < DEPLOY_COMPLETE.sh
```

Ou connectez-vous et exécutez le script manuellement :

```bash
ssh -i "$env:USERPROFILE\.ssh\hetzner_jh2o" root@jh2o.business-services-idf.xyz
# Une fois connecté :
bash DEPLOY_COMPLETE.sh
```

## 🔄 Mettre à Jour GitHub Actions

Pour que GitHub Actions utilise cette clé :

```powershell
Get-Content "$env:USERPROFILE\.ssh\hetzner_jh2o" | gh secret set SSH_PRIVATE_KEY --repo Shahil-AppDev/artisan-post-generator
```

## 📝 Résumé

- ✅ Clé SSH créée : `hetzner_jh2o`
- ✅ Clé publique : `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILol5g+cz+Ap2Z2zzMiuMrPXc8iXxJLsmyFL4yJ3/Zcw`
- ⏳ **À ajouter sur le serveur** (méthodes ci-dessus)
- ⏳ Tester la connexion
- ⏳ Déployer l'application

Une fois la clé ajoutée, tout fonctionnera automatiquement ! 🚀
