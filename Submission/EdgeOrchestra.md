# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  DIYA MAJEE

**GitHub Username:**  diyamajee-spec

**Team Name:**  Team CodeX

**College/University:**  P. K. ROY MEMORIAL COLLEGE

---

## Project Details

**Project Title:**  EdgeOrchestra

**Project Description:**  
EdgeOrchestra AI (or EdgeOrchestra) is a privacy-first, local-first multi-agent orchestration platform that lets you run a full swarm of specialized AI agents entirely on your own hardware.
It features agents like Vision, Planner, Research, Action, Creative, and Memory, all powered by local LLMs via Ollama (e.g., phi4-mini for reasoning and qwen2.5-vl for multimodal vision). There are no servers, no subscriptions, and no data leaving your device.
Key highlights:

Built with Tauri 2 (Rust backend for lightweight, secure desktop apps) + React 19 + TypeScript.
Uses Loro CRDT for conflict-free, offline memory/state management.
Interactive ReactFlow agent graph for visualization and drag-and-drop file/image handling.
Supports parallel "Orchestra Burst Mode," WASM plugin sandbox, webcam vision, voice I/O (STT/TTS), cinematic UI/animations, and more.
Designed as an "autonomous operating system for local AI workloads" for developers, researchers, and privacy-conscious power users. It's open-source under the MIT license.

**The Problem It Solves:**
Modern AI tools (especially multi-agent systems) typically rely on cloud services (e.g., OpenAI, Anthropic, or hosted agent platforms). This creates several issues:

Privacy & data sovereignty risks — sensitive prompts, files, images, or conversations are sent to third-party servers.
Ongoing costs — subscriptions, API usage fees, or rate limits.
Dependency on internet — no offline capability; performance tied to cloud latency.
Lack of control — black-box systems, limited customization, and vendor lock-in.
Resource underutilization — users with capable local hardware (GPUs/CPUs) still depend on remote inference.

EdgeOrchestra brings a complete multi-agent AI orchestra to your local machine:

Fully local inference via Ollama → zero cloud dependency.
Autonomous agent coordination — An intent router dynamically builds a dependency graph and delegates tasks across specialist agents.
Persistent memory with Loro CRDT for coherent, long-term context across sessions.
Rich interactivity — Visual agent graph, file/image dropping, real-time visualizations (memory graph with physics), plugins via WASM, and polished cinematic UI.
Extensibility & security — Sandboxed WASM plugins; Tauri for secure OS access.
Easy setup — Clone, install dependencies, pull Ollama models, and run with npm run tauri dev (one-click scripts available).


**Tech Stack Used:**  
| Layer | Technology | Role |
|---|---|---|
| **Desktop Runtime** | Tauri 2 (Rust) | Lightweight OS bridge, secure sandboxing, and zero-copy IPC |
| **Frontend Framework** | React 19 + TypeScript | Type-safe, component-driven UI architecture |
| **Styling & Animation** | Tailwind CSS v4 + Framer Motion | Glassmorphism design system with spring-physics animations |
| **Local AI Inference** | Ollama (`phi4-mini`, `qwen2.5-vl`) | 100% on-device LLM and multimodal vision inference |
| **State & Memory** | Zustand + Loro CRDT | Conflict-free, offline-capable replicated memory store |
| **Agent Visualization** | ReactFlow / XYFlow | Interactive, draggable node-based agent graph |
| **Memory Visualization** | HTML5 2D Canvas Physics | Force-directed memory relationship network with spring layouts |
| **Plugin Runtime** | WebAssembly (`wasm32-unknown-unknown`) | Sandboxed, capability-restricted agent extension system |
| **UI Primitives** | Radix UI + Lucide Icons | Accessible, headless component foundation |
| **Speech I/O** | Web Speech API (STT + TTS) | Fully offline voice interaction layer |

**GitHub Repository Link:**  https://github.com/diyamajee-spec/EdgeOrchestra

**Live Demo Link:**  https://edgeorchestra-1.vercel.app/

**Presentation / Demo Video Link:**  https://gamma.app/docs/EdgeOrchestra-Harmonizing-the-Edge-p6yufjknuh2r3up

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
