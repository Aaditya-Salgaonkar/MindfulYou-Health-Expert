const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { emotion } = req.body;
  if (!emotion) {
    return res.status(400).json({ error: 'Emotion is required.' });
  }

  // 1. Prompt for the meditation script
  const prompt = `You are a soothing meditation guide. Create a 1–2 minute guided meditation script for someone feeling ${emotion}.
Include gentle inhale‑hold‑exhale breathing cues, calm imagery, and finish with an uplifting affirmation.`;

  let script = '';

  // 2. Try OpenRouter Mistral
  try {
    const mr = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: '' },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    script = mr.data.choices[0]?.message?.content?.trim();
  } catch (e) {
    console.warn('🔁 OpenRouter failed, falling back:', e.message);

    // 3. Fallback to HuggingFace Zephyr
    try {
      const hf = await axios.post(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
          },
        }
      );

      script = (hf.data[0]?.generated_text || hf.data.generated_text || '').trim();
    } catch (hfErr) {
      console.error('❌ HuggingFace fallback failed:', hfErr.message);
      return res.status(500).json({ error: 'Could not generate meditation script.' });
    }
  }

  // 4. ElevenLabs TTS (match the working implementation)
  let audioUrl = '';
  try {
    const ttsResponse = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/PoPHDFYHijTq7YiSCwE3', // ✅ Your valid voice ID
      {
        text: script,
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

    // Convert to base64 and embed as data URI
    const base64Audio = Buffer.from(ttsResponse.data).toString('base64');
    audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
  } catch (ttsErr) {
    console.error('🛑 ElevenLabs TTS failed:', ttsErr.response?.data || ttsErr.message);
    audioUrl = ''; // Fallback: return only script
  }

  // 5. Final response
  return res.json({ script, audioUrl });
});

module.exports = router;
