<img src="https://img.icons8.com/fluency/48/chatbot.png" width="35"/> IntelliSupport
AI-Powered Customer Support Automation Platform
https://img.shields.io/badge/%F0%9F%9A%80_Live_Demo-IntelliSupport-00C853?style=for-the-badge&logo=vercel&logoColor=white
https://img.shields.io/badge/Backend-Railway-9B59B6?style=for-the-badge&logo=railway&logoColor=white
https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
https://img.shields.io/badge/License-MIT-F39C12?style=for-the-badge&logo=opensourceinitiative&logoColor=white

📖 Table of Contents
Overview

Key Features

Architecture

Technology Stack

RAG Pipeline

API Endpoints

Database Schema

Quick Start

Deployment

Project Structure

Challenges & Solutions

Roadmap

License

🎯 Overview
IntelliSupport is a production-ready B2B SaaS platform that enables businesses to deploy custom-branded AI chatbots on their websites. Using Retrieval-Augmented Generation (RAG) , the chatbot answers customer queries exclusively from the company's own documentation—ensuring accurate, context-aware, and secure responses.

Aspect	Details
Type	Multi-tenant B2B SaaS Platform
Core Function	AI-powered customer support automation
Differentiator	RAG-based answers from proprietary documents
Target Users	Businesses needing automated support without AI expertise
🔗 Live Demo: https://intellisupport.vercel.app/

✨ Key Features
For Companies
Feature	Description
🔐 Secure Authentication	JWT-based registration and login with bcrypt password hashing
📄 Document Management	Upload PDF/TXT files; automatic text extraction and indexing
🤖 AI Chatbot	Powered by Groq's Llama 3.3-70B model for fast, intelligent responses
🎨 Full Customization	Custom bot name, brand color, and welcome message
📊 Analytics Dashboard	Track total chats, daily messages, top questions, and RAG usage metrics
🎫 Ticket System	Human handoff capability with full chat history preservation
💻 One-Click Embed	Simple <script> tag embed code for any website
For Website Visitors
Feature	Description
💬 Floating Widget	Non-intrusive chat bubble with brand colors
⚡ Instant Responses	Real-time answers from company documentation
👤 Human Escalation	Option to request live agent assistance
📝 Conversation History	Persistent chat sessions across pages
🏗️ Architecture
text
┌─────────────────────────────────────────────────────────────────┐
│                         VISITOR WEBSITE                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Embeddable Chat Widget (React)              │    │
│  └─────────────────────────┬───────────────────────────────┘    │
└────────────────────────────┼────────────────────────────────────┘
                             │ HTTPS / REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Auth API   │  │  Chat API    │  │   Document API       │  │
│  └──────────────┘  └──────┬───────┘  └──────────┬───────────┘  │
│                           │                      │              │
│                           ▼                      ▼              │
│                    ┌──────────────┐      ┌──────────────┐       │
│                    │  Groq LLM    │      │  RAG Service │       │
│                    │  (Llama 3.3) │      │  + vectra    │       │
│                    └──────────────┘      └──────────────┘       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MONGODB ATLAS (Cloud)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │ Company  │ │Conversa- │ │ Message  │ │ Document │ │ Ticket ││
│  │          │ │  tion    │ │          │ │          │ │        ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘│
└─────────────────────────────────────────────────────────────────┘
🛠️ Technology Stack
Frontend
Technology	Purpose
React.js 18	UI framework
Vite	Build tool & dev server
React Router DOM	Client-side routing
Axios	HTTP client with JWT interceptor
React Hot Toast	Toast notifications
Lucide React	Icon library
CSS Variables	Theming & styling
Backend
Technology	Purpose
Node.js	JavaScript runtime
Express.js v5	Web framework
MongoDB Atlas	Cloud database
Mongoose v9	ODM for MongoDB
JWT + bcryptjs	Authentication
Groq SDK	LLM inference (Llama 3.3-70B)
Multer	File upload handling
RAG Pipeline
Technology	Purpose
pdf-parse	PDF text extraction
vectra	Local vector database
Custom Embeddings	384-dimension word-frequency vectors
🔬 RAG Pipeline
Phase 1: Indexing (Document Upload)





Phase 2: Retrieval (Chat Message)










Vector Store Isolation
text
vectorstore/
├── {companyId_1}/
│   ├── vectors.json
│   └── metadata.json
├── {companyId_2}/
│   ├── vectors.json
│   └── metadata.json
└── ...
📡 API Endpoints
Authentication
Method	Endpoint	Description	Auth
POST	/api/auth/register	Register new company	Public
POST	/api/auth/login	Login with credentials	Public
GET	/api/auth/me	Get current user info	Bearer
Chat
Method	Endpoint	Description	Auth
POST	/api/chat/message	Send message & get AI reply	Public
GET	/api/chat/history/:id	Get conversation history	Public
Documents
Method	Endpoint	Description	Auth
POST	/api/documents/upload	Upload & index document	Bearer
GET	/api/documents	List all documents	Bearer
DELETE	/api/documents/:id	Delete document	Bearer
Settings
Method	Endpoint	Description	Auth
PUT	/api/settings/bot	Update bot customization	Bearer
PUT	/api/settings/password	Update password	Bearer
Analytics
Method	Endpoint	Description	Auth
GET	/api/analytics/overview	Get statistics	Bearer
GET	/api/analytics/conversations	Recent conversations	Bearer
Tickets
Method	Endpoint	Description	Auth
POST	/api/tickets	Create handoff ticket	Public
GET	/api/tickets	List all tickets	Bearer
PUT	/api/tickets/:id	Update ticket status	Bearer
Widget
Method	Endpoint	Description	Auth
GET	/api/widget/:companyId	Get widget configuration	Public
🗄️ Database Schema
Company Model
javascript
{
  name: String,              // Company name
  email: String,             // Unique login email
  password: String,          // bcrypt-hashed
  botName: String,           // Custom bot display name
  botColor: String,          // Brand hex color
  welcomeMessage: String,    // Initial chat message
  plan: ['free', 'growth', 'enterprise'],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
Conversation Model
javascript
{
  company: ObjectId,         // Reference to Company
  sessionId: String,         // Unique session identifier
  visitorId: String,         // Anonymous visitor ID
  status: ['active', 'resolved', 'escalated'],
  messageCount: Number,
  createdAt: Date,
  updatedAt: Date
}
Message Model
javascript
{
  conversation: ObjectId,    // Reference to Conversation
  company: ObjectId,         // Reference to Company
  role: ['user', 'assistant'],
  content: String,
  usedRAG: Boolean,          // Whether RAG was used
  createdAt: Date
}
Document Model
javascript
{
  company: ObjectId,         // Reference to Company
  filename: String,          // Stored filename
  originalName: String,      // Original uploaded name
  fileType: ['pdf', 'txt'],
  fileSize: Number,          // Bytes
  chunkCount: Number,
  status: ['processing', 'ready', 'failed'],
  createdAt: Date
}
Ticket Model
javascript
{
  company: ObjectId,         // Reference to Company
  conversation: ObjectId,    // Reference to Conversation
  visitorMessage: String,    // Initial escalation message
  chatHistory: Array,        // Full conversation log
  status: ['open', 'in-progress', 'closed'],
  priority: ['low', 'medium', 'high'],
  createdAt: Date,
  updatedAt: Date
}
🚀 Quick Start
Prerequisites
Requirement	Version
Node.js	v18+
npm	v9+
MongoDB Atlas	Free tier
Groq API Key	Free at console.groq.com
Installation
1. Clone the Repository
bash
git clone https://github.com/yourusername/intellisupport.git
cd intellisupport
2. Backend Setup
bash
cd backend
npm install
Create .env file:

env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/intellisupport
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here
FRONTEND_URL=http://localhost:5173
Start the backend:

bash
npm run dev
# Server running on http://localhost:5000
3. Frontend Setup
bash
cd ../frontend
npm install
Create .env file:

env
VITE_API_URL=http://localhost:5000/api
Start the frontend:

bash
npm run dev
# Application running on http://localhost:5173
🌐 Deployment
Backend (Railway)
bash
cd backend
railway login
railway init
railway up
Add environment variables in Railway dashboard.

Frontend (Vercel)
bash
cd frontend
vercel login
vercel --prod
Set VITE_API_URL to your Railway backend URL in Vercel dashboard.

📁 Project Structure
text
intellisupport/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Company.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   ├── Document.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── documents.js
│   │   ├── widget.js
│   │   ├── settings.js
│   │   ├── analytics.js
│   │   └── tickets.js
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── services/
│   │   ├── groq.js               # Groq LLM service
│   │   └── rag.js                # RAG pipeline
│   ├── uploads/                  # Temporary uploads
│   ├── vectorstore/              # Vector indexes
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js          # Axios with JWT interceptor
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── DashboardLayout.jsx
        │   ├── ProtectedRoute.jsx
        │   └── ChatWidget.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Documents.jsx
            ├── Settings.jsx
            ├── Analytics.jsx
            ├── Tickets.jsx
            └── EmbedCode.jsx
⚠️ Challenges & Solutions
Challenge	Solution
LangChain.js version conflicts	Migrated to vectra with custom embedding implementation
pdf-parse ESM/CJS incompatibility	Used createRequire from node:module for CommonJS import
Groq lacks embeddings API	Built custom 384-dimension word-frequency embedding function
Express v5 middleware signature change	Added explicit return before next() calls
Mongoose v9 pre-save hooks	Removed next parameter (async hooks no longer require it)
dotenv loading order	Imported dotenv/config before all service imports
MongoDB Atlas IP restrictions	Configured IP whitelist to allow all for development environment
🗺️ Roadmap
Status	Feature
✅	Core RAG pipeline with custom embeddings
✅	Multi-tenant document isolation
✅	Embeddable chat widget
✅	Human handoff & ticket system
✅	Analytics dashboard
🔄	WhatsApp Business API integration
🔄	Slack channel support
📅	Real-time streaming (WebSocket/SSE)
📅	Sentiment analysis on conversations
📅	Email notifications for tickets
📅	Stripe billing & subscription tiers
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Groq for free LLM inference

MongoDB Atlas for cloud database

Vectra for local vector database

<div align="center">
Built with ❤️ for businesses that value customer support

Report Bug · Request Feature · Live Demo

