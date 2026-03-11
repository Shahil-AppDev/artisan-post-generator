═══════════════════════════════════════════════════════════════
  ⚠️  IMPORTANT - PROBLÈME DE CONNEXION RÉSEAU
═══════════════════════════════════════════════════════════════

Le serveur jh2o.business-services-idf.xyz (65.21.104.251) est 
INACCESSIBLE depuis cette machine.

Test de connexion : ÉCHEC
Port 22 (SSH) : TIMEOUT

═══════════════════════════════════════════════════════════════
  SOLUTION : EXÉCUTION MANUELLE REQUISE
═══════════════════════════════════════════════════════════════

Vous devez vous connecter au serveur depuis :
- Un autre terminal
- Une autre machine
- Un VPN si nécessaire
- Directement depuis le panneau Hetzner

═══════════════════════════════════════════════════════════════
  ÉTAPES À SUIVRE
═══════════════════════════════════════════════════════════════

1. Ouvrez un terminal qui peut accéder au serveur

2. Connectez-vous :
   ssh root@jh2o.business-services-idf.xyz
   ou
   ssh root@65.21.104.251

3. Copiez-collez TOUT le contenu du fichier DEPLOY_COMPLETE.sh
   (de #!/bin/bash jusqu'à la dernière ligne)

4. Appuyez sur ENTRÉE et attendez la fin (5-10 minutes)

═══════════════════════════════════════════════════════════════
  OU UTILISEZ CETTE COMMANDE COURTE
═══════════════════════════════════════════════════════════════

Une fois connecté au serveur, exécutez :

curl -sSL https://raw.githubusercontent.com/Shahil-AppDev/artisan-post-generator/main/DEPLOY_COMPLETE.sh | bash

═══════════════════════════════════════════════════════════════
  RÉSULTAT ATTENDU
═══════════════════════════════════════════════════════════════

✅ Clé SSH GitHub Actions ajoutée
✅ Code cloné depuis GitHub
✅ Backend installé et démarré (port 5002)
✅ Frontend installé et démarré (port 3003)
✅ Nginx configuré
✅ SSL installé

🌐 URL : https://jh2o.business-services-idf.xyz
👤 Login : admin@artisan.com / Admin2024!Secure

═══════════════════════════════════════════════════════════════
  APRÈS LE DÉPLOIEMENT
═══════════════════════════════════════════════════════════════

GitHub Actions fonctionnera automatiquement pour les prochains
déploiements. Vous pourrez faire :

git push origin main

Et l'application se déploiera automatiquement ! 🚀

═══════════════════════════════════════════════════════════════
  FICHIERS IMPORTANTS
═══════════════════════════════════════════════════════════════

📄 DEPLOY_COMPLETE.sh         - Script complet à exécuter
📄 FINAL_STEPS.md             - Guide détaillé
📄 ADD_SSH_KEY_COMMANDS.txt   - Commandes SSH
📄 INSTRUCTIONS_DEPLOIEMENT.txt - Documentation complète

═══════════════════════════════════════════════════════════════
