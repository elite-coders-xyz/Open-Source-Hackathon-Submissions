# PRobot

## Participant Name

Hemant Dhaker

## Team Name

Heaven Hill

## Project Title

PRobot - AI Powered GitHub Maintainer Assistant

## Project Description

PRobot is an AI-powered GitHub maintainer assistant designed to automate repetitive open-source maintenance tasks. It helps maintainers by automatically triaging issues, assigning labels, detecting duplicate issues, reviewing pull requests, and answering repository-related questions using Retrieval-Augmented Generation (RAG).

The system integrates with GitHub Webhooks, FastAPI, PostgreSQL, Redis, Celery, ChromaDB, and Groq-powered LLMs to provide intelligent repository automation.

## Features

### 🔍 Smart Issue Triage

Automatically analyzes newly created issues and requests missing information such as operating system details, logs, stack traces, package versions, and reproduction steps.

### 🏷️ Automatic Issue Labeling

Uses AI-powered classification to automatically assign relevant labels such as:

* bug
* documentation
* enhancement
* feature-request
* question

### 🔄 Duplicate Issue Detection

Performs semantic similarity search using embeddings and vector databases to identify duplicate or closely related issues before maintainers spend time reviewing them.

### 🛡️ PR Quality Guardian

Reviews pull requests and validates:

* PR description quality
* Linked issue references
* Test coverage indicators
* Breaking change declarations
* Repository contribution standards

### 📖 Repository Knowledge Assistant (RAG)

Provides intelligent answers using repository documentation and historical issue knowledge through Retrieval-Augmented Generation.

### ⚡ Event-Driven GitHub Automation

Processes GitHub webhook events in real time, including:

* Issues
* Issue comments
* Pull Requests
* Pull Request Reviews

### 🚀 Asynchronous Background Processing

Uses Redis and Celery workers to execute AI tasks asynchronously without blocking API performance.

### 🗄️ Persistent Repository Intelligence

Stores repository metadata, issues, pull requests, comments, and embeddings in PostgreSQL and ChromaDB for long-term analysis.

### 🤖 AI-Powered Repository Management

Leverages Groq-hosted Large Language Models to automate maintainer workflows and reduce manual effort.

### 🔗 GitHub Webhook Integration

Securely receives and validates GitHub webhook payloads using HMAC-SHA256 signature verification.

### 📊 Maintainer Productivity Enhancement

Reduces repetitive maintainer work by automating triage, classification, documentation guidance, and review assistance.

### 🐳 Dockerized Deployment

Fully containerized architecture supporting local development and cloud deployment using Docker and Docker Compose.

### 🧩 Modular Microservice-Inspired Architecture

Separates API, database, worker, cache, and AI processing components for scalability and maintainability.

### 🔐 Secure Configuration Management

Environment-based secret management with startup validation for API keys, webhook secrets, and infrastructure credentials.

### 🌐 Open Source Ready

Designed for open-source repositories with contributor-friendly workflows, documentation, and extensible architecture.

## Tech Stack

* FastAPI
* PostgreSQL
* Redis
* Celery
* ChromaDB
* Groq API
* Docker
* React
* Tailwind CSS
* Vite

## GitHub Repository

https://github.com/HemantDhaker12/PRobot

## Demo Website

https://p-robot.vercel.app

## Demo Video

https://drive.google.com/file/d/1k3ewZk03e5WglU52mTDMejrSUeHVsS20/preview

## Future Scope

* Multi-repository support
* AI-generated release notes
* Slack/Discord integrations
* Contributor onboarding assistant
* Autonomous issue resolution

## Screenshots

Available in the project repository README:
https://github.com/HemantDhaker12/PRobot

Open Source Readiness
 My project is public on GitHub
 My repository has a proper README.md
 I have added setup/installation instructions
 I have added screenshots/demo where possible
 I have added a license file
 My project is original and built/updated during the hackathon period

 
Memori Labs Sponsor Task
 I have starred the Memori Labs GitHub repository
https://github.com/MemoriLabs/Memori

 I have followed Memori Labs on LinkedIn
https://www.linkedin.com/company/memorilabs/

 I have followed Memori Labs on X
https://x.com/memorilab

 I have checked Memori Labs social links
https://linktr.ee/memorilabs

ID Card Verification
 I have generated my ID card from https://oshack.xyz
 If my ID was not verified, I completed the mandatory verification/giveaway form and tried again
