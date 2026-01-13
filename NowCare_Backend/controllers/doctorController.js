const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new doctor
// @route   POST /api/doctors/register
// @access  Public
const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, licenseNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !licenseNumber) {
      return res.status(400).json({ 
        message: 'All fields are required: name, email, password, phone, and license number' 
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
      if (existingDoctor.email === email) {
        return res.status(400).json({ message: 'Doctor already exists with this email' });
      }
      if (existingDoctor.licenseNumber === licenseNumber) {
        return res.status(400).json({ message: 'Doctor already exists with this license number' });
      }
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      phone,
      licenseNumber,
      speciality: '',
      languages: [],
      qualification: '',
      experience: '',
      location: '',
      consultationFee: ''
    });

    const token = generateToken(doctor._id);

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        licenseNumber: doctor.licenseNumber,
        profileCompleted: doctor.profileCompleted
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login doctor
// @route   POST /api/doctors/login
// @access  Public
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await doctor.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(doctor._id);

    res.json({
      success: true,
      message: 'Login successful',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        licenseNumber: doctor.licenseNumber,
        profileCompleted: doctor.profileCompleted,
        speciality: doctor.speciality,
        location: doctor.location
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private
const updateDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      licenseNumber,
      speciality,
      languages,
      qualification,
      experience,
      location,
      consultationFee,
      image,
      phone
    } = req.body;

    const doctor = await Doctor.findById(req.doctor.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update fields
    doctor.name = name || doctor.name;
    doctor.licenseNumber = licenseNumber || doctor.licenseNumber;
    doctor.speciality = speciality || doctor.speciality;
    doctor.languages = languages || doctor.languages;
    doctor.qualification = qualification || doctor.qualification;
    doctor.experience = experience || doctor.experience;
    doctor.location = location || doctor.location;
    doctor.consultationFee = consultationFee || doctor.consultationFee;
    doctor.image = image || doctor.image;
    doctor.phone = phone || doctor.phone;

    // Check if profile is complete
    const requiredFields = ['name', 'speciality', 'qualification', 'experience', 'location', 'consultationFee'];
    const isProfileComplete = requiredFields.every(field => doctor[field] && doctor[field].trim() !== '') && 
                              doctor.languages.length > 0;
    
    doctor.profileCompleted = isProfileComplete;

    await doctor.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        speciality: doctor.speciality,
        languages: doctor.languages,
        qualification: doctor.qualification,
        experience: doctor.experience,
        location: doctor.location,
        consultationFee: doctor.consultationFee,
        image: doctor.image,
        profileCompleted: doctor.profileCompleted,
        rating: doctor.rating
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile
};
