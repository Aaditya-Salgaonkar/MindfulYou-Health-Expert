'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import axios from 'axios';

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



export default function Home() {
  const [entries, setEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    axios
      .get('http://localhost:5000/api/journal', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setEntries(res.data))
      .catch(() => {
        alert('Failed to load entries');
        router.push('/login');
      });
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-100 via-purple-50 to-pink-100">
      <Sidebar />
      <div className="flex-grow py-16 px-10  ml-[17vw] overflow-y-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-indigo-700 mb-10"
        >
          ✨ My Mindful Journals
        </motion.h1>

        {entries.length === 0 ? (
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You have not created any journal entries yet.
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {entries.map((e, index) => (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                  <span>{new Date(e.createdAt).toLocaleString()}</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 capitalize">
                    {e.emotion}
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    📝 Journal
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{e.journalText}</p>
                </div>

               <div className="mb-3">
  <h3 className="font-semibold text-lg text-gray-800 mb-1">
    🤖 AI’s Mindful Suggestion
  </h3>
  <p className="text-gray-700 leading-relaxed mb-2">{e.aiResponse}</p>

  {e.ttsUrl && (
    <audio controls className="w-full mt-2">
      <source src={e.ttsUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  )}
</div>

{e.sessionUrl && (
  <div className="mt-4 bg-indigo-50 border border-indigo-300 rounded-xl p-4">
    <p className="text-sm text-indigo-800 font-medium mb-2">
      🧠 We recommend a well-being check-in.
    </p>
    <a
      href={e.sessionUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200"
    >
      Book a Session
    </a>
  </div>
)}


                {playlists[e.emotion.toLowerCase()] && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      🎵 Curated Music Therapy
                    </h3>
                    <div className="rounded-lg overflow-hidden border border-gray-300">
                      <iframe
                        src={`https://open.spotify.com/embed/playlist/${playlists[e.emotion.toLowerCase()]}`}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={`playlist-${e._id}`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
