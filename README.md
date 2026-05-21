# IntelliSupport

<div align="center">

# 🤖 IntelliSupport

### AI-Powered Customer Support SaaS Platform

Upload company documents, deploy an AI chatbot, and provide instant customer support powered by RAG + LLMs.

</div>

---

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 🤖 AI Customer Support Chatbot
- 📄 PDF & TXT Document Upload
- 🧠 Custom RAG Pipeline
- 🌐 Embeddable Chat Widget
- 🎨 Bot Customization (Name, Color, Welcome Message)
- 🧾 Conversation History
- 🎫 Human Handoff & Ticket System
- 📊 Analytics Dashboard
- 🏢 Multi-Tenant Architecture
- ⚡ Fast AI Responses using Groq API

---

# 🛠 Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Lucide React
- React Hot Toast
- CSS

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

## AI / RAG
- Groq API
- vectra
- pdf-parse
- Custom Embedding System
- Local Vector Indexing

---

# 🚀 How It Works

### 1️⃣ Company Registration
Companies create their account and login to the dashboard.

### 2️⃣ Upload Documents
Upload PDF or TXT files containing company knowledge.

### 3️⃣ Vector Indexing
Documents are chunked, embedded, and stored in vector storage.

### 4️⃣ Deploy Widget
Copy the chatbot embed script and add it to any website.

### 5️⃣ AI Customer Support
Visitors ask questions and the AI responds using uploaded company content.

### 6️⃣ Human Escalation
Users can request human support and create tickets instantly.

---

# 🔥 Core Functionalities

- AI chatbot trained on company documents
- Retrieval-Augmented Generation (RAG)
- Website embeddable support widget
- Ticket management system
- Analytics dashboard
- Company-specific isolated data
- Conversation tracking
- Secure authentication system

---

# 📈 Future Improvements

- WhatsApp Integration
- Slack Integration
- Real-time Streaming Responses
- Email Notifications
- Billing & Subscription System
- Sentiment Analysis
- Advanced Analytics

---

# ⚙️ Installation

## Backend & Frontend Setup

```bash
cd backend
npm install
npm run dev

##Frontend Setup
cd frontend
npm install
npm run dev

##🔑 Environment Variables

Create a .env file inside backend folder:

MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
FRONTEND_URL=
## 🌍 Deployment
Frontend → Vercel
Backend → Railway
## 👨‍💻 Author
Built with ❤️ by Maxi
