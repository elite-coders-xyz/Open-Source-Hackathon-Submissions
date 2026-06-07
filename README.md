# 🎙️ **AI Voice Agent with Chat History**  
🚀 *Day 10 of my AI Voice Agent Challenge*  

> 🗣️ Talk to AI, have a real conversation, and get human-like voice replies — **with memory**!  

---

## ✨ **Features**
✅ **Voice Input** — Speak directly to the AI agent  
✅ **Conversation Memory** — Remembers past messages in the same session  
✅ **Smart Responses** — Powered by Google Gemini LLM  
✅ **Natural Voice Output** — Murf AI TTS for lifelike speech  
✅ **Lightweight UI** — Plain HTML, CSS, JS (no heavy frameworks)  

---

## 🏗 **Architecture**

🎤 Your Voice
⬇
📝 AssemblyAI (Speech-to-Text)
⬇
⚙️ Python FastAPI Server (Stores Chat History)
⬇
🧠 Google Gemini (LLM)
⬇
🎙️ Murf AI (Text-to-Speech)
⬇
🔊 Audio Response


---

## 🛠 **Tech Stack**
| Layer          | Technology |
|----------------|------------|
| **Backend**    | Python, FastAPI, Uvicorn |
| **Frontend**   | HTML5, CSS3, JavaScript |
| **STT**        | AssemblyAI API |
| **LLM**        | Google Gemini API |
| **TTS**        | Murf AI API |

---

## ⚡ **Quick Start**

### 1️⃣ Prerequisites
- Python **3.9+**
- API Keys:
  - `ASSEMBLYAI_API_KEY`
  - `GOOGLE_GEMINI_API_KEY`
  - `MURF_API_KEY`

### 2️⃣ Environment Variables
Create a `.env` file in the project root:

```env
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
MURF_API_KEY=your_murf_api_key

### 3️⃣ Install Dependencies
pip install -r requirements.txt

# Backend Framework
fastapi
uvicorn

# API Calls & Utilities
requests
python-dotenv

# Audio Handling
pydub
soundfile
numpy

# STT (Speech-to-Text)
assemblyai

# LLM (Google Gemini)
google-generativeai

# TTS (Text-to-Speech - Murf AI via API calls)
# No official Python SDK, handled via requests

# Optional Dev Tools
black


### 4️⃣ Run the API Server
uvicorn main:app --reload

### 5️⃣ Open the Frontend

Open frontend.html in your browser with a session_id:
http://127.0.0.1:5500/frontend.html?session_id=abc123

🏆 Author

👨‍💻 Saloni Sharma — AI Developer & Voice Tech Enthusiast
📌 13th Part of my 30 Days of AI Voice Agents series
