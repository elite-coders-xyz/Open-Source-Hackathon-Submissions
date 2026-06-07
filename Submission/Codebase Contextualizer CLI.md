# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  
Roopak Yadav

**GitHub Username:**  
roopaky145-creator

**Team Name:**  
BLACK RAGE

**College/University:**  
IIT Kharagpur

---

## Project Details

**Project Title:**  
Codebase Contextualizer CLI

**Project Description:**  
A high-performance local semantic search engine for codebases. The CLI walks a directory, extracts semantic code chunks using Tree-sitter AST parsing, embeds those chunks locally with @xenova/transformers (no external APIs), persists vectors in SQLite with WAL mode, and answers natural-language queries from the command line. It uses a worker pool architecture with zero-copy ArrayBuffer transfer to keep the main V8 event loop free from CPU-heavy AST parsing and ONNX inference. The tool supports incremental indexing through SHA-256 file hashing and a cache system, so unchanged files are never re-processed. Achieves sub-0.0763ms p95 vector retrieval latency over 1,000 local queries.

**Tech Stack Used:**  
Node.js, Tree-sitter, better-sqlite3 (SQLite), @xenova/transformers (local ONNX embeddings), Commander.js, worker_threads

**GitHub Repository Link:**  
https://github.com/roopaky145-creator/hackathon-context-forge-cli

**Live Demo Link:**  
N/A (CLI tool — run locally with `node index.js`)

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

- [x] I have generated my ID card from https://oshack.xyz
- [x] If my ID was not verified, I completed the mandatory verification/giveaway form and tried again

---
