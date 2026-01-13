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
    const pharmacists = await Pharmacist.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      pharmacists
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
