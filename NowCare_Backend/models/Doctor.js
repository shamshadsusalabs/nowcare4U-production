const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const doctorSchema = new mongoose.Schema({
  // Authentication fields
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profile fields
  name: {
    type: String,
    required: true,
    trim: true
  },
  speciality: {
    type: String,
    required: false,
    default: ''
  },
  languages: [{
    type: String
  }],
  qualification: {
    type: String,
    required: false,
    default: ''
  },
  experience: {
    type: String,
    required: false,
    default: ''
  },
  location: {
    type: String,
    required: false,
    default: ''
  },
  consultationFee: {
    type: String,
    required: false,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Profile completion status
  profileCompleted: {
    type: Boolean,
    default: false
  },
  
  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Rating system
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);
