const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const predictions = response.data[0];
    const topPrediction = predictions.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );

    res.json({
      emotion: topPrediction.label.toLowerCase(),
      confidence: topPrediction.score,
    });
  } catch (err) {
    console.error('Hugging Face Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Emotion detection failed' });
  }
});

module.exports = router;
