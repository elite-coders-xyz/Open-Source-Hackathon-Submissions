# Career Compass AI — Hackathon Submission

## 📋 Project Metadata

* **Project Title:** Career Compass AI
* **Tagline:** Build a world-class, ATS-compliant resume simply by talking in your native language.
* **Participant Name:** Jayesh
* **Team Name:** Jayesh25-trade
* **GitHub Repository:** [https://github.com/Jayesh252511/career-compass-ai](https://github.com/Jayesh252511/career-compass-ai)
* **Live Demo Link:** [https://career-compass-ai-three-lime.vercel.app/](https://career-compass-ai-three-lime.vercel.app/)
* **Demo Video Link:** *[Optional Placeholder: Add video link here if available]*

---

## 💡 Project Description

### The Problem
Writing a resume is notoriously tedious. Job seekers spend hours alignment-fighting in Word document margins, struggling to phrase their bullet points professionally, and handling layout conventions. Furthermore, for non-native English speakers, translating their professional achievements into flawless English adds an extra layer of friction.

### The Solution
**Career Compass AI** (named *resume-zen Ai*) is a voice-first, multilingual AI resume assistant. Instead of filling in complex form grids, users simply have a friendly voice conversation with **Linnea**, the AI interviewer. 

Users can speak naturally in English or any of the 10+ supported native languages (including Hindi, Marathi, Tamil, Telugu, Gujarati, and Spanish). The platform listens in real-time, asks clarification questions about projects and experience, translates the answers, and formats a polished, ATS-optimized English resume dynamically.

---

## ✨ Core Features

* 🎙️ **Voice-First Workspace:** Powered by ElevenLabs React SDK and real-time STT. Speak naturally and let the AI listen and organize.
* 🗣️ **Multilingual & Localized UI:** Fully translated interfaces in 10+ languages using `i18next`, matching the user's selected speech language.
* 🎨 **ATS-Compliant Template Injection:** Auto-formatting layout engine supports switching between 10 standard templates with zero data loss.
* 👁️ **Live Real-time PDF Preview:** Instant rendering of the document as the user chats. On mobile viewports, the preview modal is highly optimized and keeps the voice orb accessible.
* 🌐 **Bilingual & Multilingual Exports:** Instantly export your resume as clean English, native-language, or side-by-side Bilingual PDFs.
* 📱 **Mobile-First Responsive Layouts:** Dynamic viewport calculations position the guided onboarding tooltip at the top or bottom of the screen depending on target coordinates, preventing button overlap.
* 🛡️ **Session Persistence:** All message histories and resume progress are synced in real-time to Supabase PostgreSQL, ensuring zero data loss on page refreshes.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 19, TypeScript, Vite
* **Routing & Meta-Framework:** TanStack Start (file-based routing, server rendering utilities)
* **Styling & Animation:** Tailwind CSS, Framer Motion
* **Database & Auth:** Supabase (Auth, Postgres database, Edge Functions)
* **AI & STT:** ElevenLabs (Dynamic Audio STT & TTS token integration), Grok AI (text processing)
* **Internationalization:** i18next & react-i18next
* **Payment Gateway:** Razorpay / Stripe (integration ready)

---

## ⚙️ Installation & Setup

Follow these steps to run Career Compass AI locally on your system:

### Prerequisites
* Node.js (v18+) or Bun installed
* A Supabase project initialized

### 1. Clone the Repository
```bash
git clone https://github.com/Jayesh252511/career-compass-ai.git
cd career-compass-ai
```

### 2. Install Dependencies
```bash
npm install
# or if using bun
bun install
```

### 3. Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase configuration:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 4. Run the Development Server
```bash
npm run dev
# or if using bun
bun dev
```
Open your browser and navigate to `http://localhost:3000` to start building!
