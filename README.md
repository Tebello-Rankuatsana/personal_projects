## StudyOS – Personal AI Study Platform

A full-stack AI learning platform that converts documents into study material and interactive learning experiences.
This project was built to replace paid study tools with a personal, unlimited, self-hosted alternative.

## Why this exists

Many AI study platforms limit usage behind subscriptions.
StudyOS is designed as a personal system that provides:

* Unlimited document uploads
* Unlimited quiz generation
* Unlimited flashcards
* Unlimited summaries
* Gamified learning from PDFs and notes

This project is both a learning experience and a long-term personal tool.

Core Features
Document Intelligence

Upload study material and automatically extract knowledge from:

* PDF files
* Word documents
* Text notes
* Markdown files

Planned processing pipeline:

* Text extraction
* Chunking
* Embeddings
* Vector search
* AI Study Tools
* Summaries

Generate structured summaries:

* Key concepts
* Definitions
* Bullet-point notes
* Exam-ready condensed material
* Quiz Generator

Automatically create quizzes from documents:

* Multiple choice
* True/False
* Short answer
* Difficulty levels
* Flashcards

Convert notes into spaced-repetition flashcards:

* Front/back format
* Tagging by topic
* Future SRS scheduling support
* Gamified Learning (StudyFetch-inspired)

One of the main goals of this project.

Documents can be turned into:

* Quiz battles
* Speed rounds
* Matching games
* Timed challenges
* Memory mini-games

Purpose: improve focus and reduce study fatigue.

Tech Stack
Frontend
React
Vite
React Router
TailwindCSS
Axios
Backend (planned)
Node.js
Express
SQLite (initially)
Vector database (later: Chroma / Pinecone)
LLM API integration
## Project Structure
```
personal_projects/
│
├── frontend/        → React application
├── backend/         → API server
└── docs/            → Architecture & planning
```
---
## Development Setup

#### 1. Clone the repository
```
git clone <repo-url>
cd studyos
```
#### 2. Start the frontend
```
cd frontend
npm install
npm run dev
```
App runs on:

http://localhost:5173

---
#### 3. Start the backend (when created)
```
cd backend
npm install
npm run dev
```
### Roadmap
#### Phase 1 — Foundation
* Project scaffolding 
* File upload system
* Document parsing
* Basic UI pages <br/>
#### Phase 2 — AI Integration
* Summaries
* Quiz generation
* Flashcards <br/>
#### Phase 3 — Vector Search
* Embeddings
* Semantic search
* Context retrieval <br/>
#### Phase 4 — Gamification
* Mini-games engine
* Timed challenges
* Progress tracking <br/>
#### Phase 5 — Personal Cloud
* User accounts
* Document library
* Study history
* Long-Term Vision

A fully self-hosted personal AI learning environment that evolves into a complete “study operating system”.
