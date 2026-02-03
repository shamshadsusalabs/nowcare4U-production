const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Blog = require('../models/Blog');
const Pharmacist = require('../models/Pharmacist');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


exports.signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }


    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }


    const admin = new Admin({
      email,
      password,
      name,
      role: 'admin',
      isActive: true,
    });

    await admin.save();


    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }


    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    admin.lastLogin = new Date();
    await admin.save();


    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    next(error);
  }
};

exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({}).sort({ createdAt: -1 });
    res.json({ doctors });
  } catch (error) {
    next(error);
  }
};


exports.updateDoctorStatus = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { isApproved, rejectionReason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isApproved = isApproved;
    if (!isApproved && rejectionReason) {
      doctor.rejectionReason = rejectionReason;
    }
    doctor.approvedBy = req.admin.id;
    doctor.approvedAt = new Date();

    await doctor.save();

    res.json({ message: 'Doctor status updated successfully', doctor });
  } catch (error) {
    next(error);
  }
};


exports.verifyDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { isVerified, rejectionReason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isVerified = isVerified;
    if (!isVerified && rejectionReason) {
      doctor.rejectionReason = rejectionReason;
    } else if (isVerified) {
      doctor.rejectionReason = undefined;
    }

    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor verification status updated successfully',
      doctor
    });
  } catch (error) {
    next(error);
  }
};


exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
    const pendingDoctors = await Doctor.countDocuments({ isVerified: false, rejectionReason: { $exists: false } });
    const rejectedDoctors = await Doctor.countDocuments({ isVerified: false, rejectionReason: { $exists: true } });

    res.json({
      totalDoctors,
      verifiedDoctors,
      pendingDoctors,
      rejectedDoctors,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments({})
    ]);

    res.json({
      success: true,
      blogs,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


exports.getPharmacists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const search = req.query.search || '';
    const status = req.query.status; // 'pending', 'approved', 'verified', 'rejected'

    // Build filter query
    const filter = {};

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
        { gstNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      switch (status) {
        case 'pending':
          filter.isApproved = false;
          filter.rejectionReason = { $exists: false };
          break;
        case 'approved':
          filter.isApproved = true;
          filter.isVerified = false;
          filter.rejectionReason = { $exists: false };
          break;
        case 'verified':
          filter.isApproved = true;
          filter.isVerified = true;
          break;
        case 'rejected':
          filter.rejectionReason = { $exists: true };
          break;
      }
    }

    // Execute query with pagination
    const [pharmacists, total] = await Promise.all([
      Pharmacist.find(filter)
        .select('-password')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Pharmacist.countDocuments(filter)
    ]);

    res.json({
      success: true,
      pharmacists,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Approve/reject pharmacist
exports.updatePharmacistStatus = async (req, res, next) => {
  try {
    const { pharmacistId } = req.params;
    const { isApproved, rejectionReason } = req.body;

    const pharmacist = await Pharmacist.findById(pharmacistId);
    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacist not found'
      });
    }

    pharmacist.isApproved = isApproved;
    if (!isApproved && rejectionReason) {
      pharmacist.rejectionReason = rejectionReason;
    } else if (isApproved) {
      pharmacist.rejectionReason = undefined;
    }
    pharmacist.approvedBy = req.admin.id;
    pharmacist.approvedAt = new Date();

    await pharmacist.save();

    res.json({
      success: true,
      message: 'Pharmacist status updated successfully',
      pharmacist
    });
  } catch (error) {
    next(error);
  }
};

// Verify/reject pharmacist
exports.verifyPharmacist = async (req, res, next) => {
  try {
    const { pharmacistId } = req.params;
    const { isVerified, rejectionReason } = req.body;

    const pharmacist = await Pharmacist.findById(pharmacistId);
    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacist not found'
      });
    }

    pharmacist.isVerified = isVerified;
    if (!isVerified && rejectionReason) {
      pharmacist.rejectionReason = rejectionReason;
    } else if (isVerified) {
      pharmacist.rejectionReason = undefined;
    }

    await pharmacist.save();

    res.json({
      success: true,
      message: 'Pharmacist verification status updated successfully',
      pharmacist
    });
  } catch (error) {
    next(error);
  }
};

// Create pharmacist by admin
exports.createPharmacist = async (req, res, next) => {
  try {


    const {
      name,
      email,
      phoneNumber,
      password,
      licenseNumber,
      gstNumber,
      aadharNumber,
      panNumber,
      isApproved,
      isVerified
    } = req.body;


    // Validate required fields
    if (!name || !email || !phoneNumber || !password || !licenseNumber || !gstNumber) {

      return res.status(400).json({
        success: false,
        message: 'Required fields: name, email, phoneNumber, password, licenseNumber, gstNumber'
      });
    }

    // Check if pharmacist already exists
    const existingPharmacist = await Pharmacist.findOne({
      $or: [
        { email },
        { licenseNumber },
        { gstNumber }
      ]
    });

    if (existingPharmacist) {
      return res.status(409).json({
        success: false,
        message: 'Pharmacist with this email, license number, or GST number already exists'
      });
    }

    // Handle uploaded files from Cloudinary
    const files = req.files || {};
    const aadharFile = files.aadharFile?.[0]?.path;
    const panFile = files.panFile?.[0]?.path;
    const licenseFile = files.licenseFile?.[0]?.path;
    const gstFile = files.gstFile?.[0]?.path;

    // Create new pharmacist
    const pharmacist = new Pharmacist({
      name,
      email,
      phoneNumber,
      password,
      licenseNumber,
      gstNumber,
      aadharNumber,
      panNumber,
      aadharFile,
      panFile,
      licenseFile,
      gstFile,
      isApproved: isApproved !== undefined ? isApproved : true,  // Auto-approve if added by admin
      isVerified: isVerified !== undefined ? isVerified : true,  // Auto-verify if added by admin
      approvedBy: req.admin.id,
      approvedAt: new Date()
    });

    await pharmacist.save();

    // Return pharmacist without password
    const pharmacistData = pharmacist.toObject();
    delete pharmacistData.password;

    res.status(201).json({
      success: true,
      message: 'Pharmacist created successfully',
      pharmacist: pharmacistData
    });
  } catch (error) {
    console.error('Error creating pharmacist:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    next(error);
  }
};



// Create doctor by admin
exports.createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      speciality,
      experience,
      qualification,
      location,
      consultationFee,
      licenseNumber,
      languages,
      isVerified,
      isApproved
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, email, password, phone, licenseNumber'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [
        { email },
        { licenseNumber }
      ]
    });

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'Doctor with this email or license number already exists'
      });
    }

    // Create new doctor
    const doctor = new Doctor({
      name,
      email,
      password,
      phone,
      speciality: speciality || '',
      experience: experience || '',
      qualification: qualification || '',
      location: location || '',
      consultationFee: consultationFee || '',
      licenseNumber,
      languages: languages || [],
      isVerified: isVerified !== undefined ? isVerified : true,
      isApproved: isApproved !== undefined ? isApproved : true,
      profileCompleted: true,
      rating: 0,
      totalReviews: 0
    });

    await doctor.save();

    // Return doctor without password
    const doctorData = doctor.toObject();
    delete doctorData.password;

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor: doctorData
    });
  } catch (error) {
    console.error('Error creating doctor:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Doctor with this email or license number already exists'
      });
    }

    next(error);
  }
};

// ==================== LAB MANAGEMENT ====================

// Get all labs with pagination and filters
exports.getLabs = async (req, res, next) => {
  try {
    const Lab = require('../models/Lab');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const search = req.query.search || '';
    const status = req.query.status;

    // Build filter query
    const filter = {};

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { labLicenseNumber: { $regex: search, $options: 'i' } },
        { gstNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      switch (status) {
        case 'pending':
          filter.isApproved = false;
          filter.rejectionReason = { $exists: false };
          break;
        case 'approved':
          filter.isApproved = true;
          filter.isVerified = false;
          filter.rejectionReason = { $exists: false };
          break;
        case 'verified':
          filter.isApproved = true;
          filter.isVerified = true;
          break;
        case 'rejected':
          filter.rejectionReason = { $exists: true, $ne: '' };
          break;
      }
    }

    // Execute query with pagination
    const [labs, total] = await Promise.all([
      Lab.find(filter)
        .select('-password')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lab.countDocuments(filter)
    ]);

    res.json({
      success: true,
      labs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create lab by admin
exports.createLab = async (req, res, next) => {
  try {
    const Lab = require('../models/Lab');

    const {
      name,
      email,
      phoneNumber,
      password,
      labLicenseNumber,
      gstNumber,
      aadharNumber,
      panNumber,
      address,
      city,
      state,
      pincode,
      isApproved,
      isVerified
    } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !password || !labLicenseNumber || !gstNumber) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, email, phoneNumber, password, labLicenseNumber, gstNumber'
      });
    }

    // Check if lab already exists
    const existingLab = await Lab.findOne({
      $or: [
        { email },
        { labLicenseNumber },
        { gstNumber }
      ]
    });

    if (existingLab) {
      return res.status(409).json({
        success: false,
        message: 'Lab with this email, license number, or GST number already exists'
      });
    }

    // Handle uploaded files from Cloudinary
    const files = req.files || {};
    const aadharFile = files.aadharFile?.[0]?.path;
    const panFile = files.panFile?.[0]?.path;
    const labLicenseFile = files.labLicenseFile?.[0]?.path;
    const gstFile = files.gstFile?.[0]?.path;

    // Create new lab
    const lab = new Lab({
      name,
      email,
      phoneNumber,
      password,
      labLicenseNumber,
      gstNumber,
      aadharNumber,
      panNumber,
      address,
      city,
      state,
      pincode,
      aadharFile,
      panFile,
      labLicenseFile,
      gstFile,
      isApproved: isApproved !== undefined ? isApproved : true,
      isVerified: isVerified !== undefined ? isVerified : true,
      approvedBy: req.admin.id,
      approvedAt: new Date()
    });

    await lab.save();

    // Return lab without password
    const labData = lab.toObject();
    delete labData.password;

    res.status(201).json({
      success: true,
      message: 'Lab created successfully',
      lab: labData
    });
  } catch (error) {
    console.error('Error creating lab:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    next(error);
  }
};

// Update lab approval status
exports.updateLabStatus = async (req, res, next) => {
  try {
    const Lab = require('../models/Lab');
    const { labId } = req.params;
    const { isApproved, rejectionReason } = req.body;

    const lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    lab.isApproved = isApproved;
    if (!isApproved && rejectionReason) {
      lab.rejectionReason = rejectionReason;
    } else if (isApproved) {
      lab.rejectionReason = undefined;
    }
    lab.approvedBy = req.admin.id;
    lab.approvedAt = new Date();

    await lab.save();

    res.json({
      success: true,
      message: 'Lab status updated successfully',
      lab
    });
  } catch (error) {
    next(error);
  }
};

// Update lab verification status
exports.verifyLab = async (req, res, next) => {
  try {
    const Lab = require('../models/Lab');
    const { labId } = req.params;
    const { isVerified, rejectionReason } = req.body;

    const lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    lab.isVerified = isVerified;
    if (!isVerified && rejectionReason) {
      lab.rejectionReason = rejectionReason;
    } else if (isVerified) {
      lab.rejectionReason = undefined;
    }

    await lab.save();

    res.json({
      success: true,
      message: 'Lab verification status updated successfully',
      lab
    });
  } catch (error) {
    next(error);
  }
};

// Get services for a specific lab
exports.getLabServices = async (req, res, next) => {
  try {
    const LabService = require('../models/LabService');
    const { labId } = req.params;

    const services = await LabService.find({ labId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      services
    });
  } catch (error) {
    next(error);
  }
};
