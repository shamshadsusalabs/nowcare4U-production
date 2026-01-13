const OvulationRecord = require('../models/OvulationRecord');

// Helper to add days to a date
function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

// POST /api/ovulation/calculate
// body: { userId: string, lastDate: string (ISO), cycleLength: number }
// Mirrors Flutter logic: ovulation = lastDate + (cycleLength - 14) days; fertile = ovulation ± 2 days; dueDate = lastDate + cycleLength days
exports.calculateAndSave = async (req, res) => {
  try {
    const { userId, lastDate, cycleLength } = req.body;
    if (!userId || !lastDate || !cycleLength) {
      return res.status(400).json({ message: 'userId, lastDate, cycleLength are required' });
    }

    const last = new Date(lastDate);
    if (Number.isNaN(last.getTime())) {
      return res.status(400).json({ message: 'Invalid lastDate' });
    }

    const ovulationDate = addDays(last, Number(cycleLength) - 14);
    const fertileStart = addDays(ovulationDate, -2);
    const fertileEnd = addDays(ovulationDate, 2);
    const dueDate = addDays(last, Number(cycleLength));

    const rec = await OvulationRecord.create({
      userId,
      lastDate: last,
      cycleLength: Number(cycleLength),
      ovulationDate,
      fertileStart,
      fertileEnd,
      dueDate,
    });

    return res.status(201).json(rec);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/ovulation/records?userId=...
exports.listRecords = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const items = await OvulationRecord.find({ userId }).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/ovulation/records?userId=...
exports.clearRecords = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const result = await OvulationRecord.deleteMany({ userId });
    return res.json({ deleted: result.deletedCount || 0 });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
