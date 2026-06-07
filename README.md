# 🌿 EcoVision AI
### Accessibility-first waste segregation · Powered by Gemma 2 via Ollama

> *"39 million blind people worldwide deserve independence in managing their own waste."*

EcoVision AI is a real-time waste detection system built specifically for visually impaired users.
Point your webcam at any waste item — the app identifies it, categorises it, and **speaks guidance
aloud** powered by **Gemma 2 running locally via Ollama**. No cloud. No internet required.

---

## 🎯 Hackathon Tracks Entered
| Track | Why EcoVision fits |
|---|---|
| **Digital Equity & Inclusivity** | Built for 39M blind users; full WCAG 2.1 AA, screen reader, voice commands |
| **Ollama Track** | Gemma 2 runs via Ollama — core feature, not an add-on |
| **Global Resilience** | Offline-first; works in areas with no connectivity |
| **Main Track** | Real working AI, real accessibility, real impact |

---

## ✨ Key Features
- 🎥 **Real-time waste detection** — YOLOv8n detects wet / dry / recyclable / hazardous
- 🤖 **Gemma 2 guidance** — natural spoken disposal instructions via Ollama (fully offline)
- 🔊 **Speech output** — Azure TTS or offline pyttsx3, adjustable speed
- ♿ **Screen reader support** — ARIA live regions, NVDA/JAWS/VoiceOver tested
- ⌨️ **Keyboard navigation** — full app operable without a mouse
- 📡 **Offline PWA** — Service Worker caches UI; Gemma runs locally by design
- 🌗 **High-contrast mode** — one keypress (C) for visual accessibility

---

## 🚀 Run in 3 Commands

```bash
# 1. Clone
git clone https://github.com/yourname/ecovision-ai && cd ecovision-ai

# 2. Copy env
cp .env.example .env

# 3. Start everything (Ollama + Gemma 2 + Backend + Frontend)
docker-compose -f infra/docker-compose.yml up
```

Open http://localhost:3000 — press **Space** to scan.

> First run downloads Gemma 2 (~3GB). Subsequent starts are instant.

---

## 🏗️ Architecture

```
Webcam Frame
    │
    ▼
YOLOv8n (object detection)
    │ "plastic bottle, 94% confidence"
    ▼
Gemma 2 via Ollama (guidance generation)          ← local, offline
    │ "This is a recyclable plastic bottle..."
    ▼
TTS Engine (Azure or pyttsx3)
    │ Audio
    ▼
User hears: "Recyclable plastic. Rinse and place in blue bin."
    +
ARIA live region announces to screen readers
```

---

## ♿ Accessibility Design Principles
1. **Audio-first** — every feature works with eyes closed
2. **Zero mouse required** — full keyboard navigation
3. **Screen reader tested** — NVDA, JAWS, VoiceOver, TalkBack
4. **Adjustable** — speech rate 0.5×–2.0×, font size, high contrast
5. **Simple language** — Gemma prompted to avoid visual references

---

## 🤖 Gemma 2 Integration

Gemma 2 (`gemma2:2b`) runs via **Ollama** on `localhost:11434`.
The model receives a structured prompt with the detected object, category, and bin name,
then generates ~35-word spoken guidance optimised for text-to-speech delivery.

Custom Modelfile bakes in the accessibility-focused system prompt for consistent output.

To create the custom model:
```bash
ollama create ecovision -f ollama/Modelfile
```

---

## 📁 Project Structure
```
ecovision-ai/
├── backend/           # FastAPI + YOLOv8 + Gemma service
├── frontend/          # React + accessibility + PWA
├── ollama/            # Gemma 2 Modelfile
├── infra/             # docker-compose
└── .env.example
```

---

## 🌍 Impact
- **39 million** visually impaired people globally
- **2.5 billion tonnes** of waste mismanaged annually  
- Works offline → deployable in rural and low-connectivity regions
- Multilingual ready (English + Hindi)
