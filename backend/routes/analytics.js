const express = require('express');
const router = express.Router();
const AiResponse = require('../models/AiResponse');
const authMiddleware = require('../middleware/auth');
// GET /api/analytics/moods
router.get('/moods',authMiddleware, async (req, res) => {
  try {
    const moodCounts = await AiResponse.aggregate([
      {
        $group: {
          _id: '$emotion',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }
    ]);

    res.json(moodCounts);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/timeline
router.get('/timeline',authMiddleware, async (req, res) => {
  try {
    const timeline = await AiResponse.find({})
      .sort({ createdAt: 1 })
      .select('emotion createdAt');

    res.json(timeline);
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

module.exports = router;
