const User = require('../models/congitivetest');

// GET /api/test/progress
exports.getProgress = async (req, res) => {
  try {
    const userId = req.userId;
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId, correctC: 0, wrongC: 0, correctionC: 0, round: 1 });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/test/progress
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { correctC, wrongC, correctionC, round } = req.body || {};
    const user = await User.findOneAndUpdate(
      { userId },
      { correctC, wrongC, correctionC, round },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/test/progress
exports.resetProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOneAndUpdate(
      { userId },
      { correctC: 0, wrongC: 0, correctionC: 0, round: 1 },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};