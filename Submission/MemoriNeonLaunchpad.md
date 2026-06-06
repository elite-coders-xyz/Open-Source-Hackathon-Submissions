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
Neon Launchpad BYODB Provisioning Provider for Memori

**Project Description:**  
Added Neon Launchpad as a new database provisioning provider for the Memori Python SDK (an open-source agent-native memory infrastructure library with 10,000+ downloads). The contribution enables zero-configuration, disposable serverless PostgreSQL databases for development workflows with a single command.

The provider calls the Neon Launchpad API to create an ephemeral database by UUID, retrieves the PostgreSQL connection string, and returns a ProvisionResult that routes through Memori's existing PostgreSQL storage path, requiring no new storage driver. Includes URL-encoded referrer handling, claim URL, and a 3-day expiry consistent with Neon's database TTL.

This allows developers to spin up a fully working Postgres-backed Memori instance in seconds:

```bash
python -m memori provision neon-launchpad
```

or in Python:

```python
from memori import Memori
mem = Memori.provision(provider="neon-launchpad", build=True)
```

**Tech Stack Used:**  
Python, pytest, ruff, requests, uv

**GitHub Repository Link:**  
https://github.com/anshul23102/Memori

**Live Demo Link:**  
https://github.com/MemoriLabs/Memori/pull/576

**Presentation / Demo Video Link:**  
https://github.com/MemoriLabs/Memori/pull/576

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
