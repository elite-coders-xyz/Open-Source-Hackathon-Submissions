# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**
Sumit Panigrahi

**GitHub Username:**
SumitPanigrahiGit 

**Team Name:**
Team Zenith

**College/University:**
Odisha University of Technology and Research

---

## Project Details

**Project Title:**
Gitropy - Repo Health & Knowledge-Risk Analyzer

**Project Description:**
Gitropy mines a project's own git history to answer a question most tools ignore:
if a new contributor joined tomorrow, what would trip them up, and who would they
need to ask? It combines three signals - code entropy (churn + structural
complexity + single-owner risk), bus factor / single-point-of-failure detection,
and a self-supervised ML model that predicts which files are heading toward a
rewrite. The decay model is trained entirely on labels derived from the repo's
own commit timeline (splitting each file's history into an early/late window and
learning from real churn spikes), rather than a fabricated external dataset, and
transparently falls back to a heuristic when a repo is too young to train on.
Ships as a CLI, a FastAPI service, and a lightweight static dashboard, plus a
dependency-staleness checker that queries live PyPI data.

**Tech Stack Used:**
Python, FastAPI, scikit-learn, GitPython, Typer, Pandas/NumPy, vanilla HTML/CSS/JS (dashboard), pytest

**GitHub Repository Link:**
https://github.com/SumitPanigrahiGit/GitroPy<!-- add your public repo URL after pushing, e.g. https://github.com/YOUR_USERNAME/gitropy -->

**Live Demo Link:**
Not deployed yet - runs locally via `uvicorn` or the CLI (see README)<!-- add if you deploy the FastAPI service somewhere, e.g. Render/Railway -->

**Presentation / Demo Video Link:**
N/A<!-- optional -->

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
