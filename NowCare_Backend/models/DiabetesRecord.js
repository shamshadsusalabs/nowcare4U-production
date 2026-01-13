const mongoose = require('mongoose');

const diabetesRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  inputs: {
    gender: { type: Number, required: true },
    ageGroup: { type: Number, required: true },
    race: { type: Number, required: true },
    familyHistory: { type: Number, required: true },
    waist: { type: Number, required: true },
    activity: { type: Number, required: true },
    bp: { type: Number, required: true }
  },
  results: {
    dm: { type: Number, required: true },
    pdm: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('DiabetesRecord', diabetesRecordSchema);
