# 🧘‍♂️ Mindful You – Agentic AI-Powered Wellness Companion

**Submission for:** StartWell: The Student Wellness Hackathon
**Built by:** Aaditya Salgaonkar
**Team:** Solo Build (Full Stack)
**Duration:** 36 Hours (Focused Sprints)

---

## 🌿 Problem We're Solving

College students often silently suffer from emotional overwhelm—stress, anxiety, sadness, burnout—without quick access to personalized wellness care.

* Generic meditation apps aren’t student-aware
* Static content lacks emotional intelligence
* No instant tools for personalized mental resets
* Lack of integrated emotion-to-action wellness journeys

**There’s a gap between how students feel and how fast they get relief.**

---

## 🌈 Our Solution: "Mindful You"

Mindful You is a **beautifully designed web app** that delivers **instant Agentic AI-powered wellness experiences** based on your emotional state.

Just say how you feel. We’ll guide you through:

* 🧘‍♀️ Micro-meditations with breathing animations + TTS
* 🧠 Personalized wellness exercises (Agentic AI driven)
* 📲 Emotion-responsive simulations and affirmations

---

## 🔥 Core Features

### 🧠 Emotion → Action Pipeline

* Detect emotional state (e.g., sadness, anxiety)
* Generate guided content in real-time with AI
* Respond with personalized meditation & exercises

### 🎧 Guided Micro-Meditations

* Prompt crafted by **OpenRouter + HuggingFace fallback**
* Uses ElevenLabs API for natural TTS delivery
* Background-friendly UI: Soft gradients + blur visuals

### 🧬 Agentic AI Wellness Exercises

* Custom exercise based on how you feel
* Each step is simulation-driven: inhale ➝ hold ➝ exhale ➝ reflect ➝ affirm
* Next button–based journey with motion animations

### 💎 Premium UI/UX

* Glassmorphism design (blurred UI cards)
* Adaptive greeting: "Good Morning", "Good Evening"
* Tactile controls (Play/Pause/Reset)
* Mobile-friendly with smooth Framer Motion transitions

### 🔐 Authentication Layer

* JWT-auth via secure token system
* Emotion + exercises are linked to user context

---

## ⚙️ Tech Stack

| Layer      | Stack                                       |
| ---------- | ------------------------------------------- |
| Frontend   | Next.js (App Router, TailwindCSS)           |
| Animations | Framer Motion                               |
| Voice API  | ElevenLabs TTS                              |
| AI Gen     | OpenRouter (Mistral) + HuggingFace fallback |
| Backend    | Express.js + Node.js                        |
| Auth       | JWT token (localStorage based)              |

---

## 🧠 LLM Models Used in *Mindful You*

Your project integrates state-of-the-art large language models (LLMs) and speech synthesis technologies to offer highly personalized and premium wellness experiences. Below are the core models and their roles in the system:

| 🧩 **Purpose**                    | 🤖 **Model Name**                    | 🌐 **Provider/API**                    |
| --------------------------------- | ------------------------------------ | -------------------------------------- |
| Guided Meditation Generation      | `mistralai/mistral-7b-instruct:free` | [OpenRouter](https://openrouter.ai)    |
| Agentic AI Wellness Exercises     | `mistralai/mistral-7b-instruct:free` | [OpenRouter](https://openrouter.ai)    |
| Fallback Meditation Generation    | `HuggingFaceH4/zephyr-7b-beta`       | [Hugging Face](https://huggingface.co) |
| Text-to-Speech (TTS) Audio Output | ElevenLabs proprietary TTS model     | [ElevenLabs](https://elevenlabs.io)    |

### 🔍 Model Insights

* **Mistral 7B Instruct**: Lightweight but powerful instruction-following model for generating calm, empathetic and structured wellness scripts.
* **Zephyr 7B Beta**: Used as a fallback LLM to ensure reliability and continuity of experience.
* **ElevenLabs TTS**: Converts the meditation script into soothing voice output with stability and similarity control for emotional depth.

---

These models allow *Mindful You* to deliver:

* **Context-aware meditation and exercise sessions**
* **Agentic simulations** (like breathing guidance, reflections)
* **Natural-sounding audio** to enhance user immersion


---

## 💡 Highlights

✅ AI-generated meditations using OpenRouter (fallback-safe)
✅ ElevenLabs voice rendering via natural voice tone
✅ Modular emotion-to-script pipeline with API security
✅ Agentic AI-driven wellness exercise with UX flow steps
✅ Minimalist but premium front-end design
✅ Scalable backend + modular API structure

---

## 📽️ Demo Video

🖥️ https://www.youtube.com/watch?v=tPSi65lBXdo
🎥 Includes intro, flow, emotions, meditation + exercise walkthrough

---

## 🔗 Live Links

🧠 [GitHub Repo](https://github.com/Aaditya-Salgaonkar/mindful-you)

---

## 🛠️ Setup Instructions

### Prerequisites

* Node.js 18+
* `.env` file with:

```env
OPENROUTER_API_KEY=your_openrouter_key
HF_API_KEY=your_huggingface_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

### 🚀 Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🏆 Hackathon Impact

### 🚀 Innovation & Originality

* Multi-agent fallback design (Mistral ➝ Zephyr)
* Emotional AI + TTS + simulation-based guided UI

### 💡 Technical Execution

* Fallback-safe AI generation
* TTS buffer rendering + base64 streaming
* Emotion-controlled simulation sequences

### ❤️ Wellness Relevance

* Supports quick micro-relief for overwhelmed students
* Promotes emotional literacy and reflection

### 🧠 UX & Accessibility

* Friendly tone, affirmations, soft visuals
* Clean contrast, no cognitive overload

### 🌍 Scalability

* Easily connectable with mood trackers, wearables on configuration through api endpoints which are ready.
* Modular API for mobile extension

---

## 🥇 Achievements We're Proud Of

* 💻 Built in <48 hours solo
* 🤝 Unified TTS + AI Gen + Next.js UI
* 🧠 Fully personalized UX for mental health

---

## 🙌 What’s Next

* Add support for **voice-based emotional inputs**
* Offline-first progressive web app (PWA)
* Integrate chat-based Copilot (e.g., for CBT/therapy)
* Mood journaling and weekly analytics

---

## 👨‍💻 Author

**Aaditya Salgaonkar**
Full Stack Developer | Third year Undergraduate | Goa, India 🇮🇳
📧 [aadityasalgaonkar@gmail.com](mailto:aadityasalgaonkar@gmail.com)
🔗 [LinkedIn](https://linkedin.com/in/aadityasalgaonkar)
🔗 [GitHub](https://github.com/Aaditya-Salgaonkar)

---

## 🙏 Acknowledgements

Special thanks to the StartWell Hackathon team, OpenRouter, ElevenLabs, and Framer Motion for powering our AI wellness journey!
