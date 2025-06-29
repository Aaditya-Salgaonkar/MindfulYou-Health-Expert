// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GET /api/users/me  → returns the current user’s profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user.userId comes from auth middleware
    const user = await User.findById(req.user.userId, { password: 0, __v: 0 });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
