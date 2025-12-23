# 🤖 Website AI Chatbot – Kenmark ITan Solutions

A full-stack AI-powered chatbot built for the official website of **Kenmark ITan Solutions**, designed to answer user queries related to company information, services, FAQs, and general website content using a **retrieval-augmented generation (RAG)** approach.

This project was developed as part of the **NMIMS Intern Technical Assignment** for **Kenmark ITan Solutions**.

---

## 🚀 Project Overview

The Website AI Chatbot acts as a **virtual assistant** for Kenmark ITan Solutions.
It retrieves answers from a **structured Excel knowledge base** and generates **contextual, non-hallucinatory AI responses** using a **local LLM (Ollama)**.

The system follows a **production-style architecture** with clear separation between:

* Frontend UI
* Backend APIs
* Knowledge retrieval
* AI response generation

---

## ✨ Key Features

### 🔹 Chatbot Interface

* Floating chatbot widget
* Text-based user input
* AI-generated responses
* Session-based chat history
* Typing indicator for better UX

### 🔹 Knowledge Management

* Knowledge stored in **Excel (.xlsx)** format
* Categories include:

  * About the company
  * Services
  * Contact information
  * Careers & FAQs
* **Admin upload feature** to update knowledge without code changes

### 🔹 AI & Safety

* Retrieval-Augmented Generation (RAG)
* Responses strictly grounded in the knowledge base
* Polite fallback for unknown queries
* No hallucinated answers

---

## 🧠 System Architecture (High Level)

```
User Query
   ↓
Chat UI (Next.js)
   ↓
Chat API (/api/chat)
   ↓
Knowledge Retrieval (Excel)
   ↓
Prompt Injection
   ↓
Local LLM (Ollama – Phi)
   ↓
AI Response
```

---

## 📊 Knowledge Source Format

The chatbot supports Excel files with the following structure:

| Category | Question                        | Answer                                                                                               |
| -------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| About    | What is Kenmark ITan Solutions? | Kenmark ITan Solutions is a technology company focused on IT consulting, AI solutions, and training. |
| Services | What services are offered?      | Consulting, AI & ML solutions, software development, and professional training.                      |
| Contact  | How can I contact the company?  | Visit the contact page on kenmarkitan.com                                                            |

> Missing or unknown information is handled gracefully with a polite fallback response.

A sample `knowledge.xlsx` file is included in the repository.

---

## 🧰 Tech Stack

### Frontend

* Next.js 16 (App Router)
* TypeScript (TSX)
* Tailwind CSS 4.x

### Backend

* Next.js API Routes
* Excel parsing using **exceljs**

### AI Engine

* **Local LLM using Ollama**
* Model used: **Phi**
* Retrieval-Augmented Generation (RAG)

---

## 🖥️ Local LLM Note (Important)

This project uses a **local LLM (Ollama)** as recommended in the assignment guidelines.

* Ollama runs locally on the developer machine
* AI responses are generated locally
* The deployed application demonstrates the UI and backend architecture
* Local setup instructions are provided below

This approach ensures:

* No dependency on paid APIs
* Full control over AI behavior
* Compliance with preferred tech stack

---

## ▶️ How to Run Locally

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Install Ollama

Download from: [https://ollama.com](https://ollama.com)

Pull the model:

```bash
ollama pull phi
```

Verify:

```bash
ollama run phi
```

---

### 3️⃣ Start the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔐 Admin Knowledge Upload

* Admins can upload a new `.xlsx` knowledge file directly from the UI
* The chatbot immediately starts using the updated knowledge
* No server restart required

This enables **easy maintenance and scalability**.

---

## 🌐 Deployment

The application UI and backend APIs are deployed on **Vercel**.

🔗 **Live Demo URL:**
*(Paste your Vercel URL here)*

> Note: AI responses require the local Ollama runtime when running locally.

---

## 🌱 Future Improvements

* Database persistence for chat logs (MongoDB + Prisma)
* Website content scraping (optional)
* Chat analytics (most asked questions)
* Authentication for admin upload
* Dark mode UI

---

## 👤 Author

**Alhamd Syed**
B.Tech Computer Engineering
NMIMS University

