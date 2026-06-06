# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  
Anshul Jain

**GitHub Username:**  
anshul23102

**Team Name:**  
BLOODWYRM

**College/University:**  
Indraprastha Institute of Information Technology, Delhi (IIIT Delhi)

---

## Project Details

**Project Title:**  
Sentinel - API Failure Detection Platform

**Project Description:**  
Modern APIs fail in silence. A database connection pool exhausts itself at 2 AM. A memory leak slowly degrades your search service for 40 minutes before anyone notices. By the time a user reports it, revenue is already gone.

Sentinel watches every endpoint every second. The moment something breaks, it tells you exactly what broke, why it broke, and how to fix it.

It runs Z-score anomaly detection on 60-second sliding windows per endpoint and uses Llama 3.3 70B via Groq to produce a full root cause chain with confidence scores (e.g. Auth failing -> Cart errors -> Checkout down). A canvas-based service dependency graph shows live traffic between microservices and visually propagates cascade failures in real time.

Key capabilities:
- Real-time WebSocket dashboard with health scoring across 8 monitored services
- Root cause analysis with confidence-scored failure chains
- Streaming chat: ask anything about your system in plain English
- Failure scenario simulator (DB slowdown, memory leak, rate limit cascade, network partition)
- Health heatmap with 40 historical snapshots per endpoint
- Predictive SLA breach alerts via linear regression

**Tech Stack Used:**  
Python 3.11, FastAPI, aiosqlite, WebSockets, SSE, React 18, Vite, Recharts, Canvas API, SQLite (WAL mode), Groq Cloud, Llama 3.3 70B

**GitHub Repository Link:**  
https://github.com/anshul23102/sentinel

**Live Demo Link:**  
Runs locally - setup takes under 5 minutes (see README)

**Presentation / Demo Video Link:**  
https://github.com/anshul23102/sentinel#screenshots

---

## Open Source Readiness

- [x] My project is public on GitHub
- [x] My repository has a proper README.md
- [x] I have added setup/installation instructions
- [x] I have added screenshots/demo where possible
- [x] I have added a license file
- [x] My project is original and built/updated during the hackathon period

---

## Memori Labs Sponsor Task

Please complete these before submitting:

- [x] I have starred the Memori Labs GitHub repository  
  https://github.com/MemoriLabs/Memori

- [x] I have followed Memori Labs on LinkedIn  
  https://www.linkedin.com/company/memorilabs/

- [x] I have followed Memori Labs on X  
  https://x.com/memorilab

- [x] I have checked Memori Labs social links  
  https://linktr.ee/memorilabs

---

## ID Card Verification

- [x] I have generated my ID card from https://oshack.xyz
- [x] If my ID was not verified, I completed the mandatory verification/giveaway form and tried again

---
