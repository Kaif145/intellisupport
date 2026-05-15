import express from 'express';
import Ticket from '../models/Ticket.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/tickets
// @desc    Create a ticket — human handoff request
// @access  Public (widget uses this)
router.post('/', async (req, res) => {
  try {
    const { companyId, sessionId, visitorMessage } = req.body;

    if (!companyId || !sessionId || !visitorMessage) {
      return res.status(400).json({
        success: false,
        message: 'companyId, sessionId and visitorMessage are required'
      });
    }

    // Find the conversation
    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Get full chat history
    const messages = await Message.find({ 
      conversation: conversation._id 
    }).sort({ createdAt: 1 });

    const chatHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Create ticket
    const ticket = await Ticket.create({
      company: companyId,
      conversation: conversation._id,
      visitorMessage,
      chatHistory,
      status: 'open',
      priority: 'medium'
    });

    // Update conversation status to escalated
    await Conversation.findByIdAndUpdate(conversation._id, {
      status: 'escalated'
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created. A human agent will contact you soon.',
      ticketId: ticket._id
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/tickets
// @desc    Get all tickets for a company
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ 
      company: req.company._id 
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({
      success: true,
      count: tickets.length,
      tickets: tickets.map(ticket => ({
        id: ticket._id,
        visitorMessage: ticket.visitorMessage,
        status: ticket.status,
        priority: ticket.priority,
        messageCount: ticket.chatHistory.length,
        createdAt: ticket.createdAt
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/tickets/:id
// @desc    Update ticket status
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, priority } = req.body;

    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, company: req.company._id },
      { 
        ...(status && { status }),
        ...(priority && { priority })
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      message: 'Ticket updated',
      ticket: {
        id: ticket._id,
        status: ticket.status,
        priority: ticket.priority
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;