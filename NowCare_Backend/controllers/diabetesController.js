const DiabetesRecord = require('../models/DiabetesRecord');

// GET /api/diabetes/records - list user's diabetes records
exports.listRecords = async (req, res, next) => {
  try {
    const records = await DiabetesRecord.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
};

// POST /api/diabetes/records - create a new record
exports.createRecord = async (req, res, next) => {
  try {
    const { inputs, results } = req.body;
    if (!inputs || !results) return res.status(400).json({ error: 'inputs and results are required' });
    const created = await DiabetesRecord.create({ userId: req.userId, inputs, results });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/diabetes/records/:id - delete one record
exports.deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const found = await DiabetesRecord.findOneAndDelete({ _id: id, userId: req.userId });
    if (!found) return res.status(404).json({ error: 'Record not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/diabetes/records - delete all user's records
exports.clearAll = async (req, res, next) => {
  try {
    await DiabetesRecord.deleteMany({ userId: req.userId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
