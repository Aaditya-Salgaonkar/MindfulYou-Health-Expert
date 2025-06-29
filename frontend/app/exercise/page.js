"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

export default function ExercisePage() {
  const router = useRouter();
  const [emotion, setEmotion] = useState(null);
  const [exercise, setExercise] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
  }, [router]);

  useEffect(() => {
    setEmotion("anxious");
  }, []);

  useEffect(() => {
    if (!emotion) return;

    const fetchExercise = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post(
          "http://localhost:5000/api/exercise",
          { emotion },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExercise(data.response);
        const stepsArray = data.response
          .split(/\n{2,}|(?<=[.?!])\s+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        setSteps(stepsArray);
        setCurrentStep(0);
      } catch (err) {
        console.error("❌ Failed to fetch exercise:", err.message);
        setExercise("Sorry, we couldn't generate your exercise. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [emotion]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setShowComplete(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-white/20 via-white/10 to-white/0 backdrop-blur-sm">
      <Sidebar />

      <div className="md:pl-[20em] flex-1 p-8 mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            {greeting()}, here’s your Agentic AI Wellness Challenge
          </h1>
          <p className="text-gray-600 mt-1">
            Personalized for your current emotional state.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {showComplete ? "You're done!" : `Step ${currentStep + 1} of ${steps.length}`}
          </h2>

          {loading ? (
            <p className="text-gray-600 animate-pulse">Generating your premium exercise…</p>
          ) : showComplete ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-green-700 text-2xl font-bold"
              >
                🌟 You’ve completed today’s wellness exercise!
              </motion.div>
              <button
                onClick={handleRestart}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition"
              >
                Restart
              </button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-24 h-24 rounded-full mx-auto mb-4 bg-purple-300 shadow-inner"
                  ></motion.div>

                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {steps[currentStep]}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition"
                >
                  {currentStep === steps.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </>
          )}
        </motion.section>

        <audio autoPlay loop>
          <source src="/ambient.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
}
