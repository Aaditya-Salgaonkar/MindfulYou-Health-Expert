const express = require('express');
const axios = require('axios');
const router = express.Router();
const AiResponse = require('../models/AiResponse');
const authMiddleware = require('../middleware/auth');

const playlists = {
  admiration:     '37i9dQZF1DX3PIPIT6lEg5',
  amusement:      '37i9dQZF1DX4WYpdgoIcn6',
  anger:          '37i9dQZF1DWZLcGGC0HJbc',
  annoyance:      '37i9dQZF1DX2pSTOxoPbx9',
  approval:       '37i9dQZF1DWZdaGRNV5B0g',
  caring:         '37i9dQZF1DWWEcRhUVtL8n',
  confusion:      '37i9dQZF1DX3rxVfibe1L0',
  curiosity:      '37i9dQZF1DWXRqgorJj26U',
  desire:         '37i9dQZF1DX1s9knjP51Oa',
  disappointment: '37i9dQZF1DX4UtSsGT1Sbe',
  disapproval:    '37i9dQZF1DWXJfnUiYjUKT',
  disgust:        '37i9dQZF1DX7qK8ma5wgG1',
  embarrassment:  '37i9dQZF1DWVqfgj8NZEp1',
  excitement:     '37i9dQZF1DXdxcBWuJkbcy',
  fear:           '37i9dQZF1DX4sWSpwq3LiO',
  gratitude:      '37i9dQZF1DX6VdMW310YC7',
  grief:          '37i9dQZF1DWTkIwO2HDifB',
  joy:            '37i9dQZF1DX3rxVfibe1L0',
  love:           '37i9dQZF1DX50QitC6Oqtn',
  nervousness:    '37i9dQZF1DWU0ScTcjJBdj',
  optimism:       '37i9dQZF1DX1BzILRveYHb',
  pride:          '37i9dQZF1DX0hAXqBDw9KB',
  realization:    '37i9dQZF1DWVxoleDT3ILq',
  relief:         '37i9dQZF1DWYmmr74INQlb',
  remorse:        '37i9dQZF1DX4SBhb3fqCJd',
  sadness:        '37i9dQZF1DWVrtsSlLKzro',
  surprise:       '37i9dQZF1DX9XIFQuFvzM4',
  neutral:        '37i9dQZF1DWYBO1MoTDhZI',
};

router.post('/', authMiddleware, async (req, res) => {
  const { emotion, text } = req.body;
  if (!emotion || !text) {
    return res.status(400).json({ error: 'Emotion and text are required.' });
  }

  const systemPrompt = `You are a helpful student wellness assistant. Based on a student's emotion and journal entry, respond with:
1. One personalized wellness tip
2. One short motivational quote or affirmation`;

  const userPrompt = `Emotion: ${emotion}
Journal: ${text}`;

  let result = '';
  let usedModel = 'OpenRouter Mistral';

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    result = response.data.choices[0]?.message?.content;
  } catch (error) {
    console.error('⚠️ OpenRouter Mistral Error:', error.response?.data || error.message);

    // Use Hugging Face fallback
    try {
      const hfRes = await axios.post(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
        {
          inputs: `${systemPrompt}\n\n${userPrompt}`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      result = hfRes.data?.[0]?.generated_text || hfRes.data?.generated_text || "We care about your well-being. Stay strong.";
      usedModel = 'HuggingFace Zephyr';
    } catch (hfErr) {
      console.error('❌ Hugging Face Fallback Error:', hfErr.response?.data || hfErr.message);
      return res.status(500).json({ error: 'All AI services failed. Please try again later.' });
    }
  }

  const playlistId = playlists[emotion.toLowerCase()] || playlists.neutral;
    let sessionUrl = null;
const riskEmotions = ['sadness', 'grief', 'remorse', 'fear', 'nervousness', 'disappointment'];
if (riskEmotions.includes(emotion.toLowerCase())) {
  sessionUrl = 'https://calendly.com/aadityasalgaonkar/30min';
}
  // Save to MongoDB
  await AiResponse.create({
    userId: req.user.userId,
    emotion,
    journalText: text,
    aiResponse: result,
    playlistId,
    sessionUrl
    //modelUsed: usedModel,
  });

  res.json({ response: result, model: usedModel });
});

module.exports = router;
