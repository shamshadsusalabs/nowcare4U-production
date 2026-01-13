const mongoose = require('mongoose');

const congitiveSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    correctC: { type: Number, default: 0 },
    wrongC: { type: Number, default: 0 },
    correctionC: { type: Number, default: 0 },
    round: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('congitiveTest', congitiveSchema);