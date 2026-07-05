import express from 'express';
import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Document from '../models/Document.js';
import Ticket from '../models/Ticket.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const DEMO_EMAIL = 'demo@intellisupport.app';
const DEMO_PASSWORD = 'DemoPass123!';

const createDemoWorkspace = async () => {
  const existingDemo = await Company.findOne({ email: DEMO_EMAIL });
  if (existingDemo) {
    const companyId = existingDemo._id;
    await Promise.all([
      Message.deleteMany({ company: companyId }),
      Conversation.deleteMany({ company: companyId }),
      Document.deleteMany({ company: companyId }),
      Ticket.deleteMany({ company: companyId })
    ]);
    await Company.deleteOne({ _id: companyId });
  }

  const company = await Company.create({
    name: 'Northstar Labs',
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    botName: 'Nova Support',
    botColor: '#7c3aed',
    welcomeMessage: 'Hi! I can help with onboarding, billing, and product questions.',
    plan: 'growth',
    isDemo: true
  });

  const createdConversations = await Conversation.insertMany([
    {
      company: company._id,
      sessionId: 'demo-session-001',
      visitorId: 'visitor-001',
      status: 'resolved',
      messageCount: 5
    },
    {
      company: company._id,
      sessionId: 'demo-session-002',
      visitorId: 'visitor-002',
      status: 'active',
      messageCount: 4
    },
    {
      company: company._id,
      sessionId: 'demo-session-003',
      visitorId: 'visitor-003',
      status: 'escalated',
      messageCount: 6
    }
  ]);

  await Message.insertMany([
    {
      conversation: createdConversations[0]._id,
      company: company._id,
      role: 'user',
      content: 'How do I reset my password?',
      usedRAG: false
    },
    {
      conversation: createdConversations[0]._id,
      company: company._id,
      role: 'assistant',
      content: 'You can reset it from the login screen by selecting “Forgot password”.',
      usedRAG: true
    },
    {
      conversation: createdConversations[0]._id,
      company: company._id,
      role: 'user',
      content: 'What are your support hours?',
      usedRAG: true
    },
    {
      conversation: createdConversations[0]._id,
      company: company._id,
      role: 'assistant',
      content: 'We are available from 8am to 8pm every weekday.',
      usedRAG: true
    },
    {
      conversation: createdConversations[0]._id,
      company: company._id,
      role: 'user',
      content: 'Can I upgrade my plan?',
      usedRAG: false
    },
    {
      conversation: createdConversations[1]._id,
      company: company._id,
      role: 'user',
      content: 'Where can I find my invoices?',
      usedRAG: true
    },
    {
      conversation: createdConversations[1]._id,
      company: company._id,
      role: 'assistant',
      content: 'Invoices are available in the billing section of your workspace.',
      usedRAG: true
    },
    {
      conversation: createdConversations[1]._id,
      company: company._id,
      role: 'user',
      content: 'Do you support SSO?',
      usedRAG: false
    },
    {
      conversation: createdConversations[1]._id,
      company: company._id,
      role: 'assistant',
      content: 'Yes, SSO is available on our growth and enterprise plans.',
      usedRAG: true
    },
    {
      conversation: createdConversations[2]._id,
      company: company._id,
      role: 'user',
      content: 'I need a human agent for this billing issue.',
      usedRAG: false
    },
    {
      conversation: createdConversations[2]._id,
      company: company._id,
      role: 'assistant',
      content: 'I have escalated this to our support team and added a ticket.',
      usedRAG: true
    }
  ]);

  await Document.insertMany([
    {
      company: company._id,
      filename: 'demo-policy.txt',
      originalName: 'Product Policy.txt',
      fileType: 'txt',
      fileSize: 1840,
      chunkCount: 4,
      status: 'ready'
    },
    {
      company: company._id,
      filename: 'demo-faq.pdf',
      originalName: 'FAQ.pdf',
      fileType: 'pdf',
      fileSize: 3100,
      chunkCount: 6,
      status: 'ready'
    }
  ]);

  await Ticket.insertMany([
    {
      company: company._id,
      conversation: createdConversations[2]._id,
      visitorMessage: 'I need help with a duplicate charge on my invoice.',
      chatHistory: [
        { role: 'user', content: 'I need help with a duplicate charge on my invoice.' },
        { role: 'assistant', content: 'I can help with that. I have escalated your request.' }
      ],
      status: 'open',
      priority: 'high'
    },
    {
      company: company._id,
      conversation: createdConversations[0]._id,
      visitorMessage: 'Can you confirm the billing upgrade path?',
      chatHistory: [
        { role: 'user', content: 'Can you confirm the billing upgrade path?' },
        { role: 'assistant', content: 'Absolutely, I can walk you through it.' }
      ],
      status: 'in-progress',
      priority: 'medium'
    }
  ]);

  return company;
};

// @route   POST /api/auth/register
// @desc    Register a new company
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Create company
    const company = await Company.create({ name, email, password });

    const token = generateToken(company._id);

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        botName: company.botName,
        botColor: company.botColor,
        welcomeMessage: company.welcomeMessage,
        plan: company.plan,
        isDemo: company.isDemo
      }
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   POST /api/auth/demo
// @desc    Create a resettable demo workspace with sample data
// @access  Public
router.post('/demo', async (req, res) => {
  try {
    const company = await createDemoWorkspace();
    const token = generateToken(company._id);

    res.json({
      success: true,
      message: 'Demo account ready',
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        botName: company.botName,
        botColor: company.botColor,
        welcomeMessage: company.welcomeMessage,
        plan: company.plan,
        isDemo: company.isDemo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login company
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const company = await createDemoWorkspace();
      const token = generateToken(company._id);

      return res.json({
        success: true,
        message: 'Demo login successful',
        token,
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          botName: company.botName,
          botColor: company.botColor,
          welcomeMessage: company.welcomeMessage,
          plan: company.plan,
          isDemo: company.isDemo
        }
      });
    }

    // Find company and include password
    const company = await Company.findOne({ email }).select('+password');
    if (!company) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await company.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(company._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        botName: company.botName,
        botColor: company.botColor,
        welcomeMessage: company.welcomeMessage,
        plan: company.plan,
        isDemo: company.isDemo
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in company
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.company._id);
    res.json({
      success: true,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        botName: company.botName,
        botColor: company.botColor,
        welcomeMessage: company.welcomeMessage,
        plan: company.plan,
        isDemo: company.isDemo
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