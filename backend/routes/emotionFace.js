const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { detectEmotionFromImage } = require('../utils/faceApi');

router.post('/emotion-face', auth, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const result = await detectEmotionFromImage(image);
    if (!result.emotion) {
      return res.status(400).json({ error: 'No face detected' });
    }

    res.json(result);
  } catch (err) {
    console.error('FaceAPI Error:', err);
    res.status(500).json({ error: 'Failed to detect emotion from image' });
  }
});

module.exports = router;
