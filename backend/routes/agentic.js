const express = require('express');
const axios = require('axios');
const router = express.Router();
const AiResponse = require('../models/AiResponse');
const authMiddleware = require('../middleware/auth');

const playlists = require('../utils/playlists'); // move playlist map to utils

router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Journal text is required.' });

  try {
    // Step 1: Emotion Detection (HuggingFace)
    const emotionRes = await axios.post(
      'https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions',
      { inputs: text },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
      }
    );

    const predictions = emotionRes.data[0];
    const topEmotion = predictions.reduce((max, cur) => (cur.score > max.score ? cur : max));
    const emotion = topEmotion.label.toLowerCase();

    // Step 2: AI Advice (fallback to HuggingFace if OpenRouter fails)
    let aiResponse;
    try {
      const mistralRes = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            { role: 'system', content: 'You are a helpful student wellness assistant. Based on a student\'s emotion and journal entry, respond with:\n1. One personalized wellness tip\n2. One short motivational quote or affirmation' },
            { role: 'user', content: `Emotion: ${emotion}\nJournal: ${text}` }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      aiResponse = mistralRes.data.choices[0]?.message?.content;
    } catch {
      aiResponse = "Stay strong. You're doing better than you think. Take a short walk, breathe deeply, and treat yourself with kindness.";
    }

    // Step 3: Voice Over (ElevenLabs)
    let audioUrl = '';
    try {
      const ttsRes = await axios.post(
        'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
        { text: aiResponse },
        {
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      audioUrl = ttsRes.data.audio_url || '';
    } catch {
      console.warn('TTS failed. Proceeding without voice.');
    }

    // Step 4: Smart Check-In Link (optional)
    let sessionUrl = null;

const riskEmotions = ['sadness', 'grief', 'remorse', 'fear', 'nervousness', 'disappointment'];
if (riskEmotions.includes(emotion.toLowerCase())) {
  sessionUrl = 'https://calendly.com/aadityasalgaonkar/30min';
}


    // Step 5: Save to MongoDB
    await AiResponse.create({
      userId: req.user.userId,
      emotion,
      journalText: text,
      aiResponse,
      playlistId: playlists[emotion] || playlists.neutral,
      ttsUrl: audioUrl,
      sessionUrl
    });

    res.json({ emotion, aiResponse, audioUrl, sessionUrl, playlistId: playlists[emotion] || playlists.neutral });
  } catch (err) {
    console.error('Agentic AI Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Agentic AI pipeline failed.' });
  }
});

module.exports = router;
