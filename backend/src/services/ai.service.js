const OpenAI = require('openai');

const AI_PROVIDER = process.env.AI_PROVIDER || 'deepseek';

const aiClient = process.env.AI_API_KEY
  ? new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: AI_PROVIDER === 'deepseek' 
        ? 'https://api.deepseek.com'
        : 'https://api.openai.com/v1'
    })
  : null;

const JOB_TYPE_TRANSLATIONS = {
  'climatisation': 'climatisation',
  'plomberie': 'plomberie',
  'depannage_plomberie': 'dépannage plomberie',
  'chauffe_eau': 'chauffe-eau',
  'froid_commercial': 'froid commercial',
  'autre': 'installation'
};

async function generatePost({ job_type, user_comment, company_name, phone, website }) {
  const jobTypeName = JOB_TYPE_TRANSLATIONS[job_type] || job_type;

  if (!aiClient) {
    return generateFallbackPost({ job_type: jobTypeName, user_comment, company_name, phone, website });
  }

  try {
    const prompt = `Tu es un expert en communication pour artisans du bâtiment.

Génère un post Facebook professionnel et engageant pour un artisan.

Informations:
- Type de travail: ${jobTypeName}
- Entreprise: ${company_name}
${user_comment ? `- Commentaire: ${user_comment}` : ''}
${phone ? `- Téléphone: ${phone}` : ''}
${website ? `- Site web: ${website}` : ''}

Le post doit:
- Commencer par un emoji pertinent (🔧, 🔨, ⚡, 💧, ❄️, etc.)
- Être professionnel mais accessible
- Mentionner le type de travail réalisé
- Inclure 3-4 points clés avec des checkmarks ✔
- Terminer par un appel à l'action
- Inclure les coordonnées si disponibles
- Ajouter 3-5 hashtags pertinents

Longueur: 100-150 mots maximum.
Ton: Professionnel, confiant, accessible.`;

    const modelName = AI_PROVIDER === 'deepseek' 
      ? (process.env.AI_MODEL || 'deepseek-chat')
      : (process.env.AI_MODEL || 'gpt-4');

    const completion = await aiClient.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en communication pour artisans. Tu crées des posts Facebook professionnels et engageants.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI generation error:', error);
    return generateFallbackPost({ job_type: jobTypeName, user_comment, company_name, phone, website });
  }
}

function generateFallbackPost({ job_type, user_comment, company_name, phone, website }) {
  const emojis = {
    'climatisation': '❄️',
    'plomberie': '💧',
    'dépannage plomberie': '🔧',
    'chauffe-eau': '🔥',
    'froid commercial': '🧊',
    'installation': '🔨'
  };

  const emoji = emojis[job_type.toLowerCase()] || '🔧';

  let post = `${emoji} ${job_type.charAt(0).toUpperCase() + job_type.slice(1)} réalisée aujourd'hui\n\n`;
  
  post += `Nouvelle installation effectuée par ${company_name}\n\n`;
  
  if (user_comment) {
    post += `${user_comment}\n\n`;
  }
  
  post += `✔ Pose complète\n`;
  post += `✔ Mise en service\n`;
  post += `✔ Conseils d'utilisation\n`;
  post += `✔ Garantie assurée\n\n`;
  
  post += `Besoin d'un projet similaire ?\n\n`;
  
  if (phone) {
    post += `📞 ${phone}\n`;
  }
  
  if (website) {
    post += `🌐 ${website}\n`;
  }
  
  post += `\n#artisan #${job_type.replace(/\s+/g, '')} #installation #qualité #professionnel`;

  return post;
}

module.exports = { generatePost };
