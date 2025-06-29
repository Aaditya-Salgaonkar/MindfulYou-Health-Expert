'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Music2,
  Smile,
  HeartHandshake,
  Play,
  Pause,
  StopCircle,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Webcam from 'react-webcam';

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState(null);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: 'user',
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const detectTextEmotion = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/emotion',
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmotion(res.data);
    } catch {
      alert('Text-based emotion detection failed');
    }
    setLoading(false);
  };

  const detectCameraEmotion = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert('No image captured');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/emotion-face',
        { image: imageSrc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmotion(res.data);
    } catch {
      alert('Camera-based emotion detection failed');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!emotion?.emotion) return;
    const token = localStorage.getItem('token');

    axios
      .get(`http://localhost:5000/api/playlists/${emotion.emotion}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPlaylistUrl(res.data.embedUrl))
      .catch(() => setPlaylistUrl(null));

    const defaultJournal = "Based on facial expression of the user.";
    axios
      .post(
        'http://localhost:5000/api/mistral',
        {
          emotion: emotion.emotion,
          text: text.trim() || defaultJournal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setAiResponse(res.data.response))
      .catch(() => alert('AI Assistant failed'));
  }, [emotion, text]);

  const playVoice = async () => {
    if (!aiResponse) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/tts',
        { text: aiResponse },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const url = URL.createObjectURL(res.data);
      setAudioUrl(url);
      new Audio(url).play();
    } catch {
      alert('Voice playback failed');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white/10 via-white/5 to-white/0 backdrop-blur-sm">
      <Sidebar />
      <div className="md:pl-[20em] px-6 py-12  mx-auto space-y-10">

    <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold text-indigo-700 mb-10"
            >
              {getGreeting()}
              <p className="text-lg text-gray-600 mt-2 font-semibold">Let’s understand your mood and improve your day.</p>
            </motion.h1>
            
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-transparent  border border-white/30 rounded-3xl p-6 shadow-2xl mr-5"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How are you feeling today?
          </h2>

          <div className="flex flex-wrap gap-3 mb-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                !useCamera
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white border border-purple-400 text-purple-600'
              }`}
              onClick={() => setUseCamera(false)}
            >
              Type Journal
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                useCamera
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white border border-purple-400 text-purple-600'
              }`}
              onClick={() => setUseCamera(true)}
            >
              Use Camera
            </motion.button>
          </div>

          {useCamera ? (
            <div className="flex flex-col items-center gap-4">
              <Webcam
                ref={webcamRef}
                audio={false}
                height={400}
                screenshotFormat="image/jpeg"
                width={400}
                videoConstraints={videoConstraints}
                className="rounded-2xl border border-gray-300"
              />
              <motion.button
                onClick={detectCameraEmotion}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-xl font-semibold shadow-md disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Capture Emotion'}
              </motion.button>
            </div>
          ) : (
            <>
              <textarea
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your thoughts..."
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
              />
              <motion.button
                onClick={detectTextEmotion}
                disabled={loading || !text.trim()}
                whileHover={{ scale: 1.03 }}
                className="mt-6 w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl font-semibold shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Smile className="w-5 h-5" />
                )}
                {loading ? 'Analyzing...' : 'Analyze Mood'}
              </motion.button>
            </>
          )}
        </motion.section>

        <AnimatePresence>
          {emotion && (
            <motion.section
              key="emotion"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-white/50 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg flex items-center gap-4">
                <HeartHandshake className="w-8 h-8 text-pink-500" />
                <div>
                  <p className="text-xl text-gray-700">Detected Emotion:</p>
                  <p className="text-2xl font-bold capitalize text-gray-900">
                    {emotion.emotion}
                  </p>
                  {emotion.confidence && (
                    <p className="mt-1 text-gray-600">
                      Confidence:{' '}
                      <span className="font-medium">
                        {(emotion.confidence * 100).toFixed(1)}%
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {playlistUrl && (
                <div className="bg-white/50 backdrop-blur-md border border-white/30 rounded-3xl overflow-hidden shadow-lg">
                  <h3 className="px-4 pt-5 text-lg font-semibold text-gray-800">
                    🎧 Your Playlist
                  </h3>
                  <iframe
                    src={playlistUrl}
                    className="w-full h-[120px] md:h-[180px] p-5"
                    allow="encrypted-media"
                    title="Spotify Player"
                  />
                </div>
              )}

              {aiResponse && (
                <div className="bg-white/50 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Music2 className="w-6 h-6 text-indigo-500" /> AI Wellness Tip
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">{aiResponse}</p>
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={playVoice}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 text-purple-600 font-semibold"
                    >
                      <Play className="w-6 h-6" /> Play
                    </motion.button>
                    <motion.button
                      onClick={() => audioUrl && new Audio(audioUrl).pause()}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 text-purple-600 font-semibold"
                    >
                      <Pause className="w-6 h-6" /> Pause
                    </motion.button>
                    <motion.button
                      onClick={() => audioUrl && (new Audio(audioUrl).currentTime = 0)}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 text-purple-600 font-semibold"
                    >
                      <StopCircle className="w-6 h-6" /> Stop
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
