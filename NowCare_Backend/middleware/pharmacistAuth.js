const jwt = require('jsonwebtoken');
const Pharmacist = require('../models/Pharmacist');

const pharmacistAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pharmacist = await Pharmacist.findById(decoded.id).select('-password');
    
    if (!pharmacist) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token or pharmacist not found.' 
      });
    }

    if (!pharmacist.isApproved) {
      return res.status(403).json({ 
        success: false,
        message: 'Account not approved. Please wait for admin approval.' 
      });
    }

    req.pharmacist = pharmacist;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Invalid token.' 
    });
  }
};

module.exports = pharmacistAuth;
