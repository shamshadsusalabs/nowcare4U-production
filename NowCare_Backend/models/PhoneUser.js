const mongoose = require('mongoose');

const PhoneUserSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    displayName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PhoneUser', PhoneUserSchema);
