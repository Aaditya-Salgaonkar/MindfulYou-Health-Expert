'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      localStorage.setItem('userName', data.user.name);

      if (res.ok) {
        router.push('/login');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-center mb-6">
          <UserPlus className="w-12 h-12 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Create Your Account
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <UserPlus className="absolute left-4 top-3 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <Mail className="absolute left-4 top-3 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <Lock className="absolute left-4 top-3 text-gray-400" />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignup}
          disabled={loading || !name || !email || password.length < 6}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Creating...' : 'Sign Up'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <motion.a
            href="/login"
            whileHover={{ scale: 1.05 }}
            className="text-purple-600 font-semibold"
          >
            Log In
          </motion.a>
        </p>
      </motion.div>
    </div>
  );
}
