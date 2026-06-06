# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  
Anshul Jain

**GitHub Username:**  
anshul23102

**Team Name:**  
Individual

**College/University:**  
Indraprastha Institute of Information Technology, Delhi (IIIT Delhi)

---

## Project Details

**Project Title:**  
Sentinel - AI-Powered API Failure Detection Platform

**Project Description:**  
Sentinel detects silent API failures, latency spikes, and cascading outages before users do, then explains exactly what broke, why, and how to fix it.

It runs Z-score anomaly detection on 60-second sliding windows per endpoint, catches latency spikes and error surges in real time, and uses Llama 3.3 70B via Groq to produce a root cause chain with confidence scores the moment an anomaly is detected (e.g., Auth failing -> Cart errors -> Checkout down). A canvas-based service dependency graph shows live traffic between microservices and visually propagates cascade failures.

Key features:
- Real-time WebSocket dashboard with health scoring across 8 monitored services
- AI root cause analysis with streaming chat powered by Groq
- Failure scenario simulator (DB slowdown, memory leak, rate limit cascade, network partition)
- Health heatmap with 40 historical snapshots per endpoint
- Predictive SLA breach alerts using linear regression

**Tech Stack Used:**  
Python 3.11, FastAPI, aiosqlite, WebSockets, React 18, Vite, Recharts, Canvas API, SQLite, Groq Cloud, Llama 3.3 70B

**GitHub Repository Link:**  
https://github.com/anshul23102/sentinel

**Live Demo Link:**  
N/A (runs locally - setup takes under 5 minutes)

**Presentation / Demo Video Link:**  
N/A

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

- [ ] I have generated my ID card from https://oshack.xyz
- [ ] If my ID was not verified, I completed the mandatory verification/giveaway form and tried again

---
