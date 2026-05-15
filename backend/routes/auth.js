import express from 'express';
import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
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
        plan: company.plan
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
        plan: company.plan
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
        plan: company.plan
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