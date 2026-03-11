# Configuration des Providers AI

L'application supporte plusieurs providers AI pour la génération de posts.

## Providers Supportés

### 1. DeepSeek (Recommandé) ⭐

**Avantages:**
- 💰 **Beaucoup moins cher** qu'OpenAI (environ 100x moins cher)
- 🚀 Performances excellentes
- 🌍 API compatible OpenAI
- 🇫🇷 Très bon en français

**Prix:**
- Input: $0.14 / 1M tokens
- Output: $0.28 / 1M tokens
- Cache: $0.014 / 1M tokens

**Configuration:**
```env
AI_PROVIDER=deepseek
AI_API_KEY=sk-your-deepseek-api-key
AI_MODEL=deepseek-chat
```

**Obtenir une clé API:**
1. Aller sur https://platform.deepseek.com/
2. Créer un compte
3. Générer une clé API
4. Ajouter du crédit (minimum $5)

---

### 2. OpenAI

**Avantages:**
- 🎯 Très haute qualité
- 📚 Modèles variés (GPT-4, GPT-3.5)
- 🔧 Fonctionnalités avancées

**Prix:**
- GPT-4: $30 / 1M tokens (input), $60 / 1M tokens (output)
- GPT-3.5: $0.50 / 1M tokens (input), $1.50 / 1M tokens (output)

**Configuration:**
```env
AI_PROVIDER=openai
AI_API_KEY=sk-your-openai-api-key
AI_MODEL=gpt-4
```

**Obtenir une clé API:**
1. Aller sur https://platform.openai.com/
2. Créer un compte
3. Générer une clé API
4. Ajouter du crédit

---

## Comparaison des Coûts

Pour **1000 posts générés** (environ 150 mots par post):

| Provider | Coût estimé | Économie |
|----------|-------------|----------|
| **DeepSeek** | ~$0.05 | - |
| OpenAI GPT-4 | ~$5.00 | **100x plus cher** |
| OpenAI GPT-3.5 | ~$0.25 | 5x plus cher |

💡 **Recommandation:** Utilisez DeepSeek pour un excellent rapport qualité/prix.

---

## Configuration

### Méthode 1: Variables d'environnement

Éditez `backend/.env`:

```env
# Pour DeepSeek (recommandé)
AI_PROVIDER=deepseek
AI_API_KEY=sk-xxxxxxxxxxxxxxxx
AI_MODEL=deepseek-chat

# OU pour OpenAI
AI_PROVIDER=openai
AI_API_KEY=sk-xxxxxxxxxxxxxxxx
AI_MODEL=gpt-4
```

### Méthode 2: Docker Compose

Éditez `docker-compose.yml`:

```yaml
backend:
  environment:
    AI_PROVIDER: deepseek
    AI_API_KEY: ${DEEPSEEK_API_KEY}
    AI_MODEL: deepseek-chat
```

---

## Modèles Disponibles

### DeepSeek
- `deepseek-chat` - Modèle principal (recommandé)
- `deepseek-coder` - Optimisé pour le code

### OpenAI
- `gpt-4` - Meilleure qualité
- `gpt-4-turbo` - Plus rapide
- `gpt-3.5-turbo` - Moins cher

---

## Tester la Configuration

### 1. Vérifier les variables
```bash
docker-compose exec backend printenv | grep AI_
```

### 2. Créer un post test
1. Connectez-vous à l'application
2. Créez un nouveau post
3. Vérifiez la qualité du texte généré

### 3. Vérifier les logs
```bash
docker-compose logs backend | grep "AI"
```

---

## Fallback

Si aucune clé API n'est configurée, l'application utilise un **générateur de fallback** qui crée des posts basiques mais fonctionnels sans IA.

---

## Performances

### Temps de génération moyen

| Provider | Temps moyen | Qualité |
|----------|-------------|---------|
| DeepSeek | 2-3 secondes | ⭐⭐⭐⭐⭐ |
| OpenAI GPT-4 | 3-5 secondes | ⭐⭐⭐⭐⭐ |
| OpenAI GPT-3.5 | 1-2 secondes | ⭐⭐⭐⭐ |
| Fallback | Instantané | ⭐⭐⭐ |

---

## Troubleshooting

### Erreur: "AI generation error"

**Causes possibles:**
- Clé API invalide
- Crédit insuffisant
- Problème réseau

**Solutions:**
1. Vérifier la clé API
2. Vérifier le crédit sur la plateforme
3. Vérifier les logs: `docker-compose logs backend`

### Posts de mauvaise qualité

**Solutions:**
1. Essayer un autre modèle
2. Augmenter `max_tokens` dans `ai.service.js`
3. Ajuster la `temperature` (0.7 par défaut)

### Coûts trop élevés

**Solutions:**
1. Passer à DeepSeek
2. Utiliser GPT-3.5 au lieu de GPT-4
3. Réduire `max_tokens`
4. Utiliser le fallback pour les tests

---

## Sécurité

⚠️ **Important:**
- Ne jamais commiter les clés API dans Git
- Utiliser `.env` (déjà dans `.gitignore`)
- Régénérer les clés si exposées
- Limiter les permissions des clés API

---

## Support

Pour plus d'informations:
- DeepSeek: https://platform.deepseek.com/docs
- OpenAI: https://platform.openai.com/docs
