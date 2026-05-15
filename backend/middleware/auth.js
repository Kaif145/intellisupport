import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, no token' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id);
    
    if (!company) {
      return res.status(401).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    req.company = company;
    return next();

  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, invalid token' 
    });
  }
};

export default protect;