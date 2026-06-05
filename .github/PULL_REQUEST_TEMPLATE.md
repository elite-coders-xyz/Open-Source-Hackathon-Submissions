# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  
Lavanuru Rohith

**GitHub Username:**  
LavanuruRohithRoy

**Team Name:**  
Lavanuru Rohith

**College/University:**  
DRK Institute of science and technology, JNTUH

---

## Project Details

**Project Title:**  
LitePing -- A self-hosted uptime and cron monitor

**Project Description:**  
LitePing is an open-source, lightweight, self-hosted developer-first infrastructure monitoring system. It provides real-time HTTP availability checking, network latency tracking, and passive cron backstop logging via a highly concurrent, single-process asynchronous engine.

**Tech Stack Used:**  

- Web Runtime Core: Python 3.11 / FastAPI (Native Asynchronous ASGI)
- Data Persistence: PostgreSQL 15 & SQLAlchemy 2.0 (Async Driver Mappings)
- Database Migrations: Alembic (Dynamic Environment Parameter Ingestion)
- Data Sanitization: Pydantic V2 & Email-Validator
- Caching Layer: Serverless Redis via Upstash
- Cryptographic Security: Passlib (Bcrypt) & PyJWT (HMAC-SHA256)

**GitHub Repository Link:**  
https://github.com/LavanuruRohithRoy/LitePing

**Live Demo Link:**  
https://liteping-api-engine.onrender.com/docs

**Presentation / Demo Video Link:**  
https://www.loom.com/share/ca8b8fcb28914461adc6d0e0ce6acb4b

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

## Additional Notes

### 🚀 Project Overview: LitePing

LitePing is an open-source, developer-first uptime and cron monitoring system. It replaces heavy, paid third-party tools with a lightweight, self-hosted alternative that runs on **under 120MB of RAM**—perfect for free-tier cloud environments.

### 🏗️ Why It Matters (Architecture & Impact)
* **Single-Process Concurrency:** Eliminates heavy workers (like Celery). The entire execution loop runs natively on the primary ASGI thread using **FastAPI lifespans** and `asyncio.gather()`.
* **High-Throughput I/O:** Batches up to 100 concurrent URL checks every 30 seconds using non-blocking `httpx` routines without affecting user-facing API routes.
* **Hybrid Telemetry Layer:** Writes instant status flags to serverless **Upstash Redis** and streams detailed millisecond latency logs to **PostgreSQL** using asynchronous SQLAlchemy mappings.

### 📦 Submission Readiness
* **Verified Codebase:** Includes a native, lightweight `unittest` suite covering authentication, CRUD operations, background workers, and health states.
* **Infrastructure-as-Code:** Pre-configured with a `render.yaml` blueprint for one-click free-tier production deployments.
* **Deeply Documented:** Supported by 5 modular architectural whitepapers inside the `docs/` folder mapping out data models and lifecycle pipelines.
