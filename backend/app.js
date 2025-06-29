const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));


const auth = require('./routes/auth');
app.use('/api/auth', auth);
const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);


const emotionRoute = require('./routes/emotion');
app.use('/api/emotion', emotionRoute);
const spotifyAuth = require('./routes/spotifyAuth');
app.use('/api', spotifyAuth);
const spotifyPlaylists = require('./routes/spotifyPlaylists');
app.use('/api/playlists', spotifyPlaylists);
const openrouterMistral = require('./routes/openrouterMistral');
app.use('/api/mistral', openrouterMistral); // replaces old mistral route
const textToSpeech = require('./routes/textToSpeech');
app.use('/api/tts', textToSpeech);
const analytics = require('./routes/analytics');
app.use('/api/analytics', analytics);
const agenticRoute = require('./routes/agentic');
app.use('/api/agentic', agenticRoute);
const emotionFaceRoute = require('./routes/emotionFace');
app.use('/api', emotionFaceRoute);


const journalRoute = require('./routes/journal');
app.use('/api/journal', journalRoute);
const meditationRouter = require('./routes/meditation');

app.use('/api/meditation', meditationRouter);

const exerciseRouter = require('./routes/exercise');

app.use('/api/exercise', exerciseRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));



app.get('/', (req, res) => {
  res.send('MindfulYou Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
