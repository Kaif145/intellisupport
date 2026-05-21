IntelliSupport
AI-Powered Customer Support Chatbot Platform
Live Demo: https://intellisupport.vercel.app/

Overview
IntelliSupport is a B2B SaaS platform that enables any company to deploy their own branded AI chatbot on their website. The chatbot answers customer questions using the company's own documents (PDFs, text files) through Retrieval-Augmented Generation (RAG) technology.

Companies simply sign up, upload their documentation, copy a single line of embed code, and instantly have an intelligent support agent that understands their business.

Key Features
For Companies
Secure Registration & Login — JWT-based authentication

Document Management — Upload PDF/TXT files; system automatically indexes them

AI Chatbot — Powered by Groq's Llama 3.3 70B model

RAG Pipeline — Bot answers only from uploaded company documents

Widget Customization — Customize bot name, color, and welcome message

Analytics Dashboard — Track total chats, messages per day, top questions, and RAG usage

Human Handoff — Visitors can escalate to a human; tickets appear in dashboard

Ticket Management — Manage support tickets (open, in-progress, closed)

For Website Visitors
Floating chat bubble with company branding

Instant answers from company's documentation

Option to request human assistance

Tech Stack
Category	Technologies
Frontend	React.js, Vite, React Router DOM, Axios, React Hot Toast, Lucide React, CSS Variables
Backend	Node.js, Express.js v5, ES Modules
Database	MongoDB Atlas, Mongoose
Authentication	JWT, bcryptjs
AI/LLM	Groq API (llama-3.3-70b-versatile)
RAG Pipeline	pdf-parse, vectra (local vector DB), custom embeddings (384-dim, normalized)
File Handling	multer (PDF/TXT, up to 10MB)
Deployment	Backend: Railway | Frontend: Vercel
How RAG Works
Phase 1 — Indexing (Document Upload)
Extract text from uploaded PDF/TXT

Split into 500-character chunks with 50-character overlap

Convert each chunk to 384-dimension vector (custom word-frequency embedding)

Store vectors in per-company isolated index folder: vectorstore/{companyId}/

Phase 2 — Retrieval (Each Chat Message)
Convert user's message to vector using same embedding function

Search company's vector index for top 3 most similar chunks

Filter results with similarity score > 0.1

Inject relevant chunks into Groq LLM's system prompt

LLM answers using only retrieved content

Save interaction with usedRAG flag

API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register company
POST	/api/auth/login	Login
GET	/api/auth/me	Get current company
POST	/api/chat/message	Send message, get AI reply (public)
GET	/api/chat/history/:id	Get conversation history
POST	/api/documents/upload	Upload & index document
GET	/api/documents	List all documents
DELETE	/api/documents/:id	Delete document
GET	/api/widget/:companyId	Get widget config (public)
PUT	/api/settings/bot	Update bot customization
PUT	/api/settings/password	Update password
GET	/api/analytics/overview	Get stats overview
GET	/api/analytics/conversations	Recent conversations
POST	/api/tickets	Create handoff ticket (public)
GET	/api/tickets	List all tickets
PUT	/api/tickets/:id	Update ticket status
Project Structure
text
intellisupport/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Company, Conversation, Message, Document, Ticket
│   ├── routes/                # auth, chat, documents, widget, settings, analytics, tickets
│   ├── middleware/auth.js     # JWT verification
│   ├── services/
│   │   ├── claude.js          # Groq AI chat service
│   │   └── rag.js             # RAG pipeline (embedding, indexing, retrieval)
│   ├── uploads/               # Temporary file storage
│   ├── vectorstore/           # Per-company vector indexes
│   └── server.js
└── frontend/src/
    ├── api/axios.js           # Axios with JWT interceptor
    ├── context/AuthContext.jsx
    ├── components/            # Sidebar, DashboardLayout, ProtectedRoute, ChatWidget
    └── pages/                 # Home, Login, Register, Dashboard, Documents, Settings, Analytics, Tickets, EmbedCode
Running Locally
Prerequisites
Node.js v18+

MongoDB Atlas account (free tier)

Groq API key (console.groq.com — free)

Backend Setup
bash
cd intellisupport/backend
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
PORT=5000
EOF

npm run dev   # Runs on port 5000
Frontend Setup
bash
cd intellisupport/frontend
npm install
npm run dev   # Runs on port 5173
Visit: http://localhost:5173

Challenges Overcome
Challenge	Solution
LangChain.js version conflicts	Switched to vectra + custom embeddings
pdf-parse ESM/CJS conflict	Used createRequire
Groq doesn't support embeddings API	Built custom local embedding function (word-frequency, 384-dim, normalized)
Express v5 middleware changes	next() must be called with return
Mongoose v9 pre-save hooks	Async hooks no longer need next parameter
dotenv loading order	Import dotenv before any service using env vars
MongoDB Atlas IP whitelist	Allowed all IPs for development
Planned Features
WhatsApp & Slack channel integration

Real-time streaming responses (WebSockets/SSE)

Sentiment analysis on customer messages

Email notifications for new tickets

Billing & subscription management

License
MIT

Contact
For questions or support, please open an issue on the repository.
