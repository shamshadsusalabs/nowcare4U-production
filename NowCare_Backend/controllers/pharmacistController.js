const Pharmacist = require('../models/Pharmacist');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Pharmacist signup/registration
exports.signup = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password, licenseNumber, gstNumber, aadharNumber, panNumber } = req.body;

    // Check if files are uploaded
    if (!req.files || !req.files.aadharFile || !req.files.panFile || !req.files.licenseFile || !req.files.gstFile) {
      return res.status(400).json({
        success: false,
        message: 'All documents are required (Aadhar, PAN, License, GST)'
      });
    }

    // Extract file URLs from Cloudinary
    const aadharFile = req.files.aadharFile[0].path;
    const panFile = req.files.panFile[0].path;
    const licenseFile = req.files.licenseFile[0].path;
    const gstFile = req.files.gstFile[0].path;

    // Validate required fields
    if (!name || !email || !phoneNumber || !password || !licenseNumber || !gstNumber || !aadharNumber || !panNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, email, phone, password, license number, GST number, Aadhar number, PAN number)'
      });
    }

    // Check if pharmacist already exists with email
    const existingPharmacistByEmail = await Pharmacist.findOne({ email });
    if (existingPharmacistByEmail) {
      return res.status(409).json({
        success: false,
        message: 'Pharmacist with this email already exists'
      });
    }

    // Check if pharmacist already exists with license number
    const existingPharmacistByLicense = await Pharmacist.findOne({ licenseNumber: licenseNumber.toUpperCase() });
    if (existingPharmacistByLicense) {
      return res.status(409).json({
        success: false,
        message: 'Pharmacist with this license number already exists'
      });
    }

    // Check if pharmacist already exists with GST number
    const existingPharmacistByGST = await Pharmacist.findOne({ gstNumber: gstNumber.toUpperCase() });
    if (existingPharmacistByGST) {
      return res.status(409).json({
        success: false,
        message: 'Pharmacist with this GST number already exists'
      });
    }

    // Check if pharmacist already exists with PAN number
    const existingPharmacistByPAN = await Pharmacist.findOne({ panNumber: panNumber.toUpperCase() });
    if (existingPharmacistByPAN) {
      return res.status(409).json({
        success: false,
        message: 'Pharmacist with this PAN number already exists'
      });
    }

    // Create new pharmacist
    const pharmacist = new Pharmacist({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      password, // Will be hashed by pre-save middleware
      licenseNumber: licenseNumber.toUpperCase().trim(),
      gstNumber: gstNumber.toUpperCase().trim(),
      aadharNumber: aadharNumber.trim(),
      panNumber: panNumber.toUpperCase().trim(),
      aadharFile,
      panFile,
      licenseFile,
      gstFile,
      isApproved: false,
      isVerified: false
    });

    await pharmacist.save();

    // Generate token
    const token = generateToken(pharmacist._id);

    res.status(201).json({
      success: true,
      message: 'Pharmacist registration successful. Your application is pending approval.',
      token,
      pharmacist: {
        id: pharmacist._id,
        name: pharmacist.name,
        email: pharmacist.email,
        phoneNumber: pharmacist.phoneNumber,
        licenseNumber: pharmacist.licenseNumber,
        gstNumber: pharmacist.gstNumber,
        aadharNumber: pharmacist.aadharNumber,
        panNumber: pharmacist.panNumber,
        isApproved: pharmacist.isApproved,
        isVerified: pharmacist.isVerified
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }
    next(error);
  }
};

// Pharmacist login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find pharmacist by email
    const pharmacist = await Pharmacist.findOne({ email: email.toLowerCase() });
    if (!pharmacist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordCorrect = await pharmacist.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if pharmacist is approved
    if (!pharmacist.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Please wait for admin approval.'
      });
    }

    // Generate token
    const token = generateToken(pharmacist._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      pharmacist: {
        id: pharmacist._id,
        name: pharmacist.name,
        email: pharmacist.email,
        phoneNumber: pharmacist.phoneNumber,
        licenseNumber: pharmacist.licenseNumber,
        gstNumber: pharmacist.gstNumber,
        isApproved: pharmacist.isApproved,
        isVerified: pharmacist.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get pharmacist profile
exports.getProfile = async (req, res, next) => {
  try {
    const pharmacist = await Pharmacist.findById(req.pharmacist.id).select('-password');
    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacist not found'
      });
    }

    res.json({
      success: true,
      pharmacist
    });
  } catch (error) {
    next(error);
  }
};

// Update pharmacist profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber } = req.body;
    const pharmacist = await Pharmacist.findById(req.pharmacist.id);

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacist not found'
      });
    }

    // Update text fields if provided
    if (name) pharmacist.name = name.trim();
    if (phoneNumber) pharmacist.phoneNumber = phoneNumber.trim();

    // Update files if uploaded
    if (req.files) {
      if (req.files.licenseFile) pharmacist.licenseFile = req.files.licenseFile[0].path;
      if (req.files.gstFile) pharmacist.gstFile = req.files.gstFile[0].path;
      if (req.files.aadharFile) pharmacist.aadharFile = req.files.aadharFile[0].path;
      if (req.files.panFile) pharmacist.panFile = req.files.panFile[0].path;
    }

    await pharmacist.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      pharmacist
    });
  } catch (error) {
    next(error);
  }
};

// Get all pharmacists (for admin)
exports.getAllPharmacists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [pharmacists, total] = await Promise.all([
      Pharmacist.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Pharmacist.countDocuments({})
    ]);

    res.json({
      success: true,
      pharmacists,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};
