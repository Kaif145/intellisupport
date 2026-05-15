import express from 'express';
import Company from '../models/Company.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   PUT /api/settings/bot
// @desc    Update bot customization
// @access  Private
router.put('/bot', protect, async (req, res) => {
  try {
    const { botName, botColor, welcomeMessage, name } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      req.company._id,
      { 
        ...(name && { name }),
        ...(botName && { botName }),
        ...(botColor && { botColor }),
        ...(welcomeMessage && { welcomeMessage })
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Settings updated successfully',
      company: {
        id: updatedCompany._id,
        name: updatedCompany.name,
        botName: updatedCompany.botName,
        botColor: updatedCompany.botColor,
        welcomeMessage: updatedCompany.welcomeMessage
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/settings/password
// @desc    Update password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const company = await Company.findById(req.company._id).select('+password');

    const isMatch = await company.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    company.password = newPassword;
    await company.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


export default router;