import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

// @route   GET /api/widget/:companyId
// @desc    Get widget config for a company
// @access  Public (no auth — widget needs this without login)
router.get('/:companyId', async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      config: {
        companyId: company._id,
        companyName: company.name,
        botName: company.botName,
        botColor: company.botColor,
        welcomeMessage: company.welcomeMessage
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