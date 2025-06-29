const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const playlists = {
  admiration:     '37i9dQZF1DX3PIPIT6lEg5', // Confidence Boost
  amusement:      '37i9dQZF1DX4WYpdgoIcn6', // Have a Great Day!
  anger:          '37i9dQZF1DWZLcGGC0HJbc', // Rock Hard
  annoyance:      '37i9dQZF1DX2pSTOxoPbx9', // Unwind
  approval:       '37i9dQZF1DWZdaGRNV5B0g', // Young & Free
  caring:         '37i9dQZF1DWWEcRhUVtL8n', // Chill Vibes
  confusion:      '37i9dQZF1DX3rxVfibe1L0', // Feel-Good Indie
  curiosity:      '37i9dQZF1DWXRqgorJj26U', // Discovery Weekly
  desire:         '37i9dQZF1DX1s9knjP51Oa', // Sexy as Folk
  disappointment: '37i9dQZF1DX4UtSsGT1Sbe', // Alone Again
  disapproval:    '37i9dQZF1DWXJfnUiYjUKT', // Sad Indie
  disgust:        '37i9dQZF1DX7qK8ma5wgG1', // Grime Shutdown
  embarrassment:  '37i9dQZF1DWVqfgj8NZEp1', // Teen Angst
  excitement:     '37i9dQZF1DXdxcBWuJkbcy', // Hype
  fear:           '37i9dQZF1DX4sWSpwq3LiO', // Creepy Songs
  gratitude:      '37i9dQZF1DX6VdMW310YC7', // Songs to Sing in the Shower
  grief:          '37i9dQZF1DWTkIwO2HDifB', // Sad Songs
  joy:            '37i9dQZF1DX3rxVfibe1L0', // Feel-Good Indie Rock
  love:           '37i9dQZF1DX50QitC6Oqtn', // Love Pop
  nervousness:    '37i9dQZF1DWU0ScTcjJBdj', // Deep Focus
  optimism:       '37i9dQZF1DX1BzILRveYHb', // Mood Booster
  pride:          '37i9dQZF1DX0hAXqBDw9KB', // Pride Classics
  realization:    '37i9dQZF1DWVxoleDT3ILq', // Introspective Vibes
  relief:         '37i9dQZF1DWYmmr74INQlb', // Ambient Relaxation
  remorse:        '37i9dQZF1DX4SBhb3fqCJd', // Deep Feelings
  sadness:        '37i9dQZF1DWVrtsSlLKzro', // Life Sucks
  surprise:       '37i9dQZF1DX9XIFQuFvzM4', // All New Indie
  neutral:        '37i9dQZF1DWYBO1MoTDhZI', // Coffeehouse Blend
};


router.get('/:emotion',authMiddleware, (req, res) => {
  const emotion = req.params.emotion.toLowerCase();
  const playlistId = playlists[emotion];

  if (!playlistId) {
    return res.status(404).json({ error: 'No playlist found for this emotion' });
  }

  res.json({ embedUrl: `https://open.spotify.com/embed/playlist/${playlistId}` });
});

module.exports = router;
