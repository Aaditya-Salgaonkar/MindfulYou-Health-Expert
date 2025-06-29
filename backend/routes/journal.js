// backend/routes/journal.js
const express = require('express');
const router = express.Router();
const AiResponse = require('../models/AiResponse');
const authMiddleware = require('../middleware/auth');

// GET /api/journal — returns all entries for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await AiResponse.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('emotion journalText aiResponse createdAt playlistId sessionUrl'); 

    res.json(entries);
  } catch (err) {
    console.error('Journal fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch your journal entries' });
  }
});

module.exports = router;
