import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Company from '../models/Company.js';
import getChatReply from '../services/claude.js';
import { searchDocuments } from '../services/rag.js';

const router = express.Router();

// @route   POST /api/chat/message
// @desc    Send a message and get AI reply
// @access  Public (widget uses companyId, not JWT)
router.post('/message', async (req, res) => {
  try {
    const { companyId, sessionId, message } = req.body;

    // Validate inputs
    if (!companyId || !message) {
      return res.status(400).json({
        success: false,
        message: 'companyId and message are required'
      });
    }

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Find or create conversation
    let conversation;
    const currentSessionId = sessionId || uuidv4();

    if (sessionId) {
      conversation = await Conversation.findOne({ sessionId });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        company: companyId,
        sessionId: currentSessionId
      });
    }

    // Get last 10 messages for chat history context
    const previousMessages = await Message.find({
      conversation: conversation._id
    })
    .sort({ createdAt: 1 })
    .limit(10);

    const chatHistory = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Save user message to MongoDB
    await Message.create({
      conversation: conversation._id,
      company: companyId,
      role: 'user',
      content: message
    });

    // Search RAG for relevant context
// import { searchDocuments } from '../services/rag.js';

// Search RAG for relevant context
const ragContext = await searchDocuments(companyId, message);
console.log('🔍 RAG Context found:', ragContext.length, 'chunks');
console.log('🔍 RAG Content:', ragContext);
// Get AI reply from Groq
const aiReply = await getChatReply({
  userMessage: message,
  chatHistory,
  companyName: company.name,
  botName: company.botName,
  welcomeMessage: company.welcomeMessage,
  ragContext
});

// Mark if RAG was used
const usedRAG = ragContext.length > 0;

    // Save AI reply to MongoDB
    await Message.create({
      conversation: conversation._id,
      company: companyId,
      role: 'assistant',
      content: aiReply,
      usedRAG
    });

    // Update message count
    await Conversation.findByIdAndUpdate(conversation._id, {
      $inc: { messageCount: 2 }
    });

    res.json({
      success: true,
      sessionId: currentSessionId,
      reply: aiReply,
      conversationId: conversation._id
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/chat/history/:sessionId
// @desc    Get chat history for a session
// @access  Public
router.get('/history/:sessionId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ 
      sessionId: req.params.sessionId 
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({
      conversation: conversation._id
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;