const jwt = require('jsonwebtoken');
const PhoneUser = require('../models/PhoneUser');

// POST /api/phone-auth/phone-login
// Body: { phone: "+91xxxxxxxxxx", displayName?: string }
// Creates or finds a user by phone and returns a JWT
const phoneLogin = async (req, res) => {
  try {
    const { phone, displayName } = req.body || {};
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const normalized = phone.replace(/\s+/g, '');

    let user = await PhoneUser.findOne({ phone: normalized });
    if (!user) {
      user = new PhoneUser({ phone: normalized, displayName });
      await user.save();
    } else if (displayName && !user.displayName) {
      user.displayName = displayName;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id.toString(), phone: user.phone },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      token,
      user: { id: user._id, phone: user.phone, displayName: user.displayName || null },
    });
  } catch (err) {
    console.error('phoneLogin error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { phoneLogin };
