'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { Play, Pause, StopCircle } from "lucide-react";

export default function MicroMeditation() {
  const router = useRouter();
  const [emotion, setEmotion] = useState(null);
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  // 1. Redirect if not authed
  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
  }, [router]);

  // 2. Fake emotion trigger (hook into your real state here)
  useEffect(() => {
    setEmotion("sadness");
  }, []);

  // 3. Fetch guided meditation + TTS
  useEffect(() => {
    if (!emotion) return;

    setLoading(true);
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post(
          "http://localhost:5000/api/meditation",
          { emotion },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setScript(data.script);
        setAudioUrl(data.audioUrl);
        // auto‑play when ready
        setTimeout(() => audioRef.current?.play(), 500);
      } catch {
        alert("Failed to load your meditation. Try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [emotion]);

  // Audio controls
  const play  = () => audioRef.current?.play();
  const pause = () => audioRef.current?.pause();
  const stop  = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-white/20 via-white/10 to-white/0 backdrop-blur-sm">
      <Sidebar />

      <div className="md:pl-[20em] flex-1 p-8  mx-auto space-y-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            {greeting()}, ready to relax?
          </h1>
          <p className="text-gray-600 mt-1">Here’s your personalized micro‑meditation.</p>
        </motion.div>

        {/* Meditation Script & Audio Controls */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-800">Guided Meditation</h2>
          {loading ? (
            <p className="text-gray-600">Loading your meditation…</p>
          ) : (
            <>
              <p className="text-gray-700 whitespace-pre-wrap">{script}</p>

              {audioUrl && (
                <div className="flex items-center gap-4 mt-4">
  <audio
    ref={audioRef}
    src={audioUrl}
    controls
    className="w-full rounded-lg shadow-inner mt-4"
    onError={() => console.error('Bad audio URL:', audioUrl)}
  />



                 
                </div>
              )}
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}
