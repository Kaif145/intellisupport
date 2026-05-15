import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Document from '../models/Document.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get overview stats for dashboard
// @access  Private
router.get('/overview', protect, async (req, res) => {
  try {
    const companyId = req.company._id;

    // Total conversations
    const totalConversations = await Conversation.countDocuments({ 
      company: companyId 
    });

    // Total messages
    const totalMessages = await Message.countDocuments({ 
      company: companyId 
    });

    // Resolved conversations
    const resolvedConversations = await Conversation.countDocuments({ 
      company: companyId, 
      status: 'resolved' 
    });

    // Escalated conversations
    const escalatedConversations = await Conversation.countDocuments({ 
      company: companyId, 
      status: 'escalated' 
    });

    // Total documents
    const totalDocuments = await Document.countDocuments({ 
      company: companyId,
      status: 'ready'
    });

    // Messages per day — last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const messagesPerDay = await Message.aggregate([
      { 
        $match: { 
          company: companyId,
          createdAt: { $gte: sevenDaysAgo },
          role: 'user'
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: '%Y-%m-%d', 
              date: '$createdAt' 
            } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top questions — most common user messages
    const topQuestions = await Message.aggregate([
      {
        $match: {
          company: companyId,
          role: 'user'
        }
      },
      {
        $group: {
          _id: '$content',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // RAG usage — how many replies used documents
    const ragUsageCount = await Message.countDocuments({
      company: companyId,
      role: 'assistant',
      usedRAG: true
    });

    res.json({
      success: true,
      stats: {
        totalConversations,
        totalMessages,
        resolvedConversations,
        escalatedConversations,
        totalDocuments,
        ragUsageCount,
        resolutionRate: totalConversations > 0 
          ? Math.round((resolvedConversations / totalConversations) * 100) 
          : 0
      },
      messagesPerDay,
      topQuestions: topQuestions.map(q => ({
        question: q._id,
        count: q.count
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/analytics/conversations
// @desc    Get recent conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      company: req.company._id 
    })
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({
      success: true,
      count: conversations.length,
      conversations: conversations.map(conv => ({
        id: conv._id,
        sessionId: conv.sessionId,
        status: conv.status,
        messageCount: conv.messageCount,
        createdAt: conv.createdAt
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