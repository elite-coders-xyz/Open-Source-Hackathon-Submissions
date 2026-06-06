# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  
Ghanshyam Jha

**GitHub Username:**  
GhanshyamJha05

**Team Name:**  
Solo Coder

**College/University:**  
Kanpur Institute of College

---

## Project Details

**Project Title:**  
Devtool-cli

**Project Description:**  
Devtool-cli is a small, production-ready Go command-line tool for everyday developer tasks. It supports fetching HTTP/HTTPS responses, validating and pretty-printing JSON, cleaning and organizing mixed file folders by file type, and displaying the installed version.

**Tech Stack Used:**  
- Go
- Cobra CLI framework (Go)

**GitHub Repository Link:**  
https://github.com/GhanshyamJha05/devtool-cli

**Live Demo Link:**  
https://ghanshyamjha05.github.io/devtool-cli/

**Presentation / Demo Video Link:**  
<!-- Optional but recommended -->

---

## Project Features

- `get` — Fetches data from an HTTP/HTTPS URL and optionally saves it to a file.
- `format` — Validates and pretty-prints JSON files.
- `clean` — Organizes files into categorized folders such as Images, Documents, Code, Videos, etc.
- `version` — Prints the installed tool version.
- Clear terminal output and explicit error handling.

## Usage Examples

- Show available commands:
  ```bash
  devtool-cli --help
  ```
- Fetch an API response:
  ```bash
  devtool-cli get https://jsonplaceholder.typicode.com/posts/1
  ```
- Save a response to a file:
  ```bash
  devtool-cli get https://jsonplaceholder.typicode.com/posts/1 --save post.json
  ```
- Format a JSON file:
  ```bash
  devtool-cli format ugly.json
  ```
- Save formatted JSON:
  ```bash
  devtool-cli format ugly.json --save pretty.json
  ```
- Clean a folder:
  ```bash
  devtool-cli clean "C:\Users\you\Downloads"
  ```
- Show verbose clean output:
  ```bash
  devtool-cli clean "C:\Users\you\Downloads" --verbose
  ```

---

## Installation

- Install Go first.
- Run:
  ```bash
  go install github.com/GhanshyamJha05/devtool-cli@latest
  ```
- On Windows, Go installs the binary to:
  ```text
  C:\Users\<your-name>\go\bin
  ```
- If the command is not found, add that folder to your PATH and restart the terminal.

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