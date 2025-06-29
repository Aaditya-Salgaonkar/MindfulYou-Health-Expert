const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
router.post('/',authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/PoPHDFYHijTq7YiSCwE3', // Replace with valid voice ID
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length,
    });

    res.send(response.data);
  } catch (error) {
    console.error('🛑 ElevenLabs Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Voice synthesis failed' });
  }
});

module.exports = router; // ✅ This must be present
