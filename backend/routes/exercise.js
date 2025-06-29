const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { emotion } = req.body;

  if (!emotion) {
    return res.status(400).json({ error: 'Emotion is required' });
  }

  const prompt = `
You are an AI-powered wellness coach for university students.
Create a short, actionable, and personalized 2–3 minute exercise for someone feeling ${emotion}.
It must include:
- A breathing pattern (e.g., inhale-hold-exhale),
- Gentle physical action (e.g., stretch, short walk),
- Mental engagement (e.g., reflection, gratitude),
- A final affirmation.

Keep it warm, empowering, and friendly.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const agenticResponse = response.data.choices[0]?.message?.content?.trim();
    res.json({ response: agenticResponse });
  } catch (error) {
    console.error("Agentic API error:", error.message);
    res.status(500).json({ error: 'Failed to generate agentic exercise' });
  }
});

// ✅ FIXED: Export the router!
module.exports = router;
