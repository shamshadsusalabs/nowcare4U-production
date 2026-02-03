const jwt = require('jsonwebtoken');
const Lab = require('../models/Lab');

const labAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const lab = await Lab.findById(decoded.id).select('-password');

        if (!lab) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or lab not found.'
            });
        }

        if (!lab.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Account not approved. Please wait for admin approval.'
            });
        }

        req.lab = lab;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

module.exports = labAuth;
