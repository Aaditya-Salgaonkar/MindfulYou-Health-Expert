'use client';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import {
  FaRegSmile,
  FaChartBar,
  FaChartPie,
  FaClock,
} from 'react-icons/fa';

export default function Analytics() {
  const [moods, setMoods] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const BASE = 'http://localhost:5000';

      try {
        const [mRes, tRes] = await Promise.all([
          axios.get(`${BASE}/api/analytics/moods`, { headers }),
          axios.get(`${BASE}/api/analytics/timeline`, { headers }),
        ]);
        setMoods(Array.isArray(mRes.data) ? mRes.data : []);
        setTimeline(Array.isArray(tRes.data) ? tRes.data : []);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading analytics…</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  const totalEntries = moods.reduce((sum, m) => sum + m.count, 0);
  const uniqueEmotions = moods.length;
  const mostCommonMood = moods[0]?._id.toUpperCase() || '—';
  const timeRange = timeline.length
    ? `Since ${new Date(timeline[0].createdAt).toLocaleDateString()}`
    : '—';

  const barData = {
    labels: moods.map((m) => m._id),
    datasets: [{
      label: 'Frequency',
      data: moods.map((m) => m.count),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
    }],
  };

  const doughnutData = {
    labels: moods.map((m) => m._id),
    datasets: [{
      data: moods.map((m) => m.count),
      backgroundColor: [
        '#A78BFA', '#F472B6', '#FBBF24',
        '#34D399', '#60A5FA', '#F87171',
      ],
    }],
  };

  const emotionOrder = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'love'];
  const lineData = {
    labels: timeline.map((e) => new Date(e.createdAt).toLocaleDateString()),
    datasets: [{
      label: 'Mood Over Time',
      data: timeline.map((e) =>
        emotionOrder.indexOf(e.emotion.toLowerCase())
      ),
      fill: false,
      tension: 0.3,
      borderColor: '#6366F1',
      borderWidth: 3,
    }],
  };

  const lineOptions = {
    scales: {
      y: {
        ticks: {
          callback: (v) =>
            emotionOrder[v]?.replace(/^\w/, (c) => c.toUpperCase()) || '',
        },
      },
    },
  };

  const MetricCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-6 bg-white shadow-lg rounded-2xl border border-gray-100 transition hover:shadow-xl">
      <div className="text-4xl text-indigo-600">{icon}</div>
      <div>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  const SectionCard = ({ title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/60 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-xl"
    >
      <h3 className="text-xl font-semibold text-indigo-700 mb-4">{title}</h3>
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-100 flex flex-col md:flex-row">
      <div className="fixed md:static w-full md:w-[18em] z-10">
        <Sidebar />
      </div>

      <div className="flex-1 px-4 sm:px-8 py-12 max-w-7xl mx-auto space-y-12 mt-24 md:mt-0">
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-indigo-700 mb-10"
        >
          ✨ Analytics
        </motion.h1>

          {/* Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard icon={<FaRegSmile />} label="Total Entries" value={totalEntries} />
            <MetricCard icon={<FaChartBar />} label="Unique Emotions" value={uniqueEmotions} />
            <MetricCard icon={<FaChartPie />} label="Most Common Mood" value={mostCommonMood} />
            <MetricCard icon={<FaClock />} label="Time Range" value={timeRange} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SectionCard title="Mood Frequency (Bar)">
              <Bar data={barData} />
            </SectionCard>

            <SectionCard title="Mood Distribution (Doughnut)">
              <div className="h-64"> {/* You can use h-48, h-56, etc. */}
    <Doughnut
      data={doughnutData}
      options={{ maintainAspectRatio: false }}
    />
  </div>
            </SectionCard>
          </div>

          <SectionCard title="Mood Timeline (Line)">
            <Line data={lineData} options={lineOptions} />
          </SectionCard>
        </motion.section>
      </div>
    </div>
  );
}
