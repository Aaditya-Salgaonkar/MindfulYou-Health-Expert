'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Smile, Heart, Flower } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 text-gray-800 p-6">
      {/* Glass Hero */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/40 border border-white/30 shadow-2xl rounded-2xl p-10 max-w-2xl text-center"
      >
        <div className="mb-6 flex flex-col items-center space-y-3">
          <Flower className="w-14 h-14 text-purple-700" />
          <h1 className="text-4xl font-bold text-gray-900">Welcome to MindfulYou</h1>
          <p className="text-lg text-gray-600">
            Your AI-powered wellness companion for journaling, mood tracking, and emotional healing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition duration-300"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl border border-purple-600 text-purple-700 hover:bg-purple-100 font-semibold transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
      >
        <FeatureCard icon={<Smile className="text-indigo-600 w-8 h-8" />} title="AI Mood Detection" desc="Understand how you feel through emotion-aware journaling." />
        <FeatureCard icon={<Heart className="text-pink-600 w-8 h-8" />} title="Voice Therapy" desc="Hear your emotional support in a comforting, human voice." />
        <FeatureCard icon={<Flower className="text-green-600 w-8 h-8" />} title="Personal Wellness Logs" desc="Track your growth and mindfulness over time, privately." />
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
      <div className="mb-3">{icon}</div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
