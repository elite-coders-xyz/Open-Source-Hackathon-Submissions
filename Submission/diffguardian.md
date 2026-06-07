# Open Source Hackathon 2026 Project Submission

## Participant Details

**Full Name:**  
Aryan Gupta

**GitHub Username:**  
Aryan0628

**Team Name:**  
NULLPOINTER

**College/University:**  
MNNIT Allahabad

---

## Project Details

**Project Title:**  
diff-guard

**Project Description:**  
diff-guard is an impact-aware git diff engine that uses WASM-compiled Tree-Sitter grammars to detect breaking API changes before they ship. Standard `git diff` only shows added or removed text lines — it cannot tell if a required parameter was removed, a return type changed, or a function was made async. diff-guard parses both sides of a git diff into abstract syntax tree (AST) signatures, classifies every structural change against 26 strict production rules, and traces every affected call site across the codebase to show exactly what breaks and who is impacted. It ships with built-in Husky git hooks that block `git push` and `git merge` when breaking changes are detected, and auto-posts audit reports as GitHub PR comments in CI. Zero configuration required — install it and it works.

**Tech Stack Used:**  
TypeScript, Node.js, WASM Tree-Sitter (tree-sitter-typescript, tree-sitter-javascript, tree-sitter-python, tree-sitter-go, tree-sitter-java, tree-sitter-rust), Vitest, Husky, GitHub Actions, Next.js 16, React 19, Tailwind CSS v4

**GitHub Repository Link:**  
https://github.com/Aryan0628/diffguardian

**Live Demo Link:**  
https://diffguardian.vercel.app/

**Presentation / Demo Video Link:**  
https://drive.google.com/file/d/141_-ZgoLyJterOePAaGIEAGnEQsJqb1P/view?usp=sharing

**npm Package:**  
https://www.npmjs.com/package/@aryan28/diff-guard

---

## Open Source Readiness

- [✓] My project is public on GitHub
- [✓] My repository has a proper README.md
- [✓] I have added setup/installation instructions
- [✓] I have added screenshots/demo where possible
- [✓] I have added a license file
- [✓] My project is original and built/updated during the hackathon period

---

## Memori Labs Sponsor Task

Please complete these before submitting:

- [✓] I have starred the Memori Labs GitHub repository  
  https://github.com/MemoriLabs/Memori

- [✓] I have followed Memori Labs on LinkedIn  
  https://www.linkedin.com/company/memorilabs/

- [✓] I have followed Memori Labs on X  
  https://x.com/memorilab

- [✓] I have checked Memori Labs social links  
  https://linktr.ee/memorilabs

---

## ID Card Verification

- [✓] I have generated my ID card from https://oshack.xyz
- [✓] If my ID was not verified, I completed the mandatory verification/giveaway form and tried again

## Additional Information

For any clarification, feel free to reach out at aryan072806@gmail.com
I can also provide a walkthrough video of the tool in action if required.
