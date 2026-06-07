# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  
Pabitra Maity

**GitHub Username:**  
Codewithpabitra

**Team Name:**  
ofTheForked

**College/University:**  
Heritage Institute of Technology, Kolkata

---

## Project Details

**Project Title:**  
FuseMeld

**Project Description:**  
FuseMeld is a full-stack developer tool that helps open-source maintainers manage large GitHub repositories more effectively. It solves two real problems that every active maintainer faces daily.First, duplicate issues drown maintainers - popular repos get the same bug report filed dozens of times with slightly different wording, and keyword search misses most of them. FuseMeld uses the `all-MiniLM-L6-v2` embedding model to convert every open issue into a 384-dimensional vector, then applies cosine similarity with Union-Find clustering to detect issues that mean the same thing - even when phrased completely differently. Llama 3.3 70B (with Groq's API) then generates a human-readable merge suggestion for each duplicate cluster, telling maintainers exactly which issue to keep and how to close the others.

Second, new contributors can't understand a project's history from raw commit logs. FuseMeld's Commit Storyteller fetches recent commits and narrates them as a human story grouped into meaningful development phases.

Additional features include a Repo Health Score (0-100), Analysis Diff (what changed since last analysis), Analysis History, Saved Repos, Recently Analyzed public feed, and smart 1-hour MongoDB caching.


**Tech Stack Used:**  
React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, Node.js, Express 5, MongoDB Atlas, Mongoose, Groq API (Llama 3.3 70B), @xenova/transformers (all-MiniLM-L6-v2), Clerk (GitHub OAuth + JWT), Octokit (GitHub REST API), Render (deployment)

**GitHub Repository Link:**  
https://github.com/Codewithpabitra/FuseMeld

**Live Demo Link:**  
https://fusemeld-git.onrender.com

**Presentation / Demo Video Link:**  
<!-- Optional but recommended -->

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
