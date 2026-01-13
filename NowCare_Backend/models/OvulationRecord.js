const mongoose = require('mongoose');

const OvulationRecordSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    lastDate: { type: Date, required: true },
    cycleLength: { type: Number, required: true },
    ovulationDate: { type: Date, required: true },
    fertileStart: { type: Date, required: true },
    fertileEnd: { type: Date, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OvulationRecord', OvulationRecordSchema);
