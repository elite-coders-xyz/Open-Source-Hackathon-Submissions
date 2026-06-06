# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  
Palak Goda

**GitHub Username:**  
palakgoda

**Team Name:**  
CYBERHEX

**College/University:**  
KSD's Model College

---

## Project Details

**Project Title:**  
PromptShield

**Project Description:**  
PromptShield is an ultra-lightweight, high-performance **Asynchronous AI Reverse Proxy Firewall Gateway** designed to protect applications from PII data leaks, credential exposures, and unexpected API budget shocks. 

Operating as a zero-config, local network middleman, it mimics standard OpenAI/Gemini API endpoints, allowing developers to route their AI application traffic through it by altering just a single line of client configuration code. PromptShield intercepts and inspects outgoing prompt payloads sequentially through a customizable, modular safety pipeline, instantly dropping malicious or leaky requests with a `403 Forbidden` code while cleanly forwarding safe, masked traffic to upstream LLM providers.

### Key Architectural Technicalities Solved:
1. **Dynamic Plugin Loading:** Implements a dynamic module scanning utility utilizing `pkgutil` and `importlib` that automatically registers any custom guardrail file dropped into the `/plugins/` directory at boot. 
2. **Persistent Audit Database Logging:** Outfitted with a thread-safe local SQLite manager (`data/promptshield.db`) that records all requests, status codes, triggered rules, and mitigation logs, preserving statistics across restarts.
3. **Multi-Provider Dynamic Routing:** Evaluates model target requests dynamically to handle headers and dynamic routing for Google Gemini, OpenAI, and Anthropic seamlessly.
4. **Live Administrative Monitoring Console:** A real-time, browser-accessible HTML5 dashboard served natively by FastAPI that polls live server endpoints (`/api/metrics` and `/api/logs`) to display real-time metric aggregates and running request logs.

**Tech Stack Used:**  
Python 3.14+, FastAPI, HTTPX, Pydantic v2, Pydantic-Settings, SQLite, Pytest, Docker, HTML5/CSS3 (Vanilla JS)

**GitHub Repository Link:**  
https://github.com/palakgoda/promptshield.git

**Live Demo Link:**  
https://promptshield-tq0s.onrender.com

**Presentation / Demo Video Link:**  
<!-- Optional but recommended -->

---

## Open Source Readiness

- [X] My project is public on GitHub
- [X] My repository has a proper README.md
- [X] I have added setup/installation instructions
- [X] I have added screenshots/demo where possible
- [X] I have added a license file
- [X] My project is original and built/updated during the hackathon period

---

## Memori Labs Sponsor Task

Please complete these before submitting:

- [X] I have starred the Memori Labs GitHub repository  
  https://github.com/MemoriLabs/Memori

- [X] I have followed Memori Labs on LinkedIn  
  https://www.linkedin.com/company/memorilabs/

- [ ] I have followed Memori Labs on X  
  https://x.com/memorilab

- [X] I have checked Memori Labs social links  
  https://linktr.ee/memorilabs

---

## ID Card Verification

- [X] I have generated my ID card from https://oshack.xyz
- [ ] If my ID was not verified, I completed the mandatory verification/giveaway form and tried again

---
