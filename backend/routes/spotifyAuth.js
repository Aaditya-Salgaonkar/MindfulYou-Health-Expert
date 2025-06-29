const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
require('dotenv').config();
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const redirect_uri = process.env.REDIRECT_URI;

router.get('/login',authMiddleware, (req, res) => {
  const scope = 'user-read-private user-read-email streaming';
  const auth_query = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${auth_query}`);
});

router.get('/callback',authMiddleware, async (req, res) => {
  const code = req.query.code || null;
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token } = response.data;
    res.redirect(`/spotify-success?access_token=${access_token}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send('Spotify callback error.');
  }
});

module.exports = router;
