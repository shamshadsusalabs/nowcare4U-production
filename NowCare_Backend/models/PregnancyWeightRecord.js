const mongoose = require('mongoose');

const weightEntrySchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    weight: { type: Number, required: true },
  },
  { _id: false }
);

const pregnancyWeightRecordSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true, unique: true },
    baseline: {
      preWeightKg: { type: Number, required: true },
      heightCm: { type: Number, required: true },
      bmi: { type: Number, required: true },
      minGainKg: { type: Number, required: true },
      maxGainKg: { type: Number, required: true },
      e: { type: Number, required: true, default: 0.15 },
    },
    minVal: [{ type: Number, required: true }], // expected min weight for weeks [0,2,...,40]
    maxVal: [{ type: Number, required: true }], // expected max weight for weeks [0,2,...,40]
    myVal: [weightEntrySchema], // user entries
  },
  { timestamps: true }
);

module.exports = mongoose.model('PregnancyWeightRecord', pregnancyWeightRecordSchema);
