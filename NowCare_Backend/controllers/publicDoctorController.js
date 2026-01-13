const Doctor = require('../models/Doctor');
const TimeSlot = require('../models/TimeSlot');

// @desc    Get all verified doctors (for public listing)
// @route   GET /api/public/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const { specialty, search, page = 1, limit = 10 } = req.query;
    
    let query = { 
      profileCompleted: true,
      isVerified: true 
    };

    // Filter by specialty
    if (specialty && specialty !== 'All') {
      query.speciality = specialty;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { speciality: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const doctors = await Doctor.find(query)
      .select('-password -email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });

    // Get next available slot for each doctor
    const doctorsWithAvailability = await Promise.all(
      doctors.map(async (doctor) => {
        const nextSlot = await TimeSlot.findOne({
          doctorId: doctor._id,
          isAvailable: true,
          isBooked: false,
          date: { $gte: new Date() }
        }).sort({ date: 1, startTime: 1 });

        const doctorObj = doctor.toObject();
        doctorObj.nextAvailable = nextSlot 
          ? `${nextSlot.date.toLocaleDateString()} ${nextSlot.startTime}`
          : 'No slots available';
        
        return doctorObj;
      })
    );

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      doctors: doctorsWithAvailability,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDoctors: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor by ID (for public viewing)
// @route   GET /api/public/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id)
      .select('-password -email');

    if (!doctor || !doctor.profileCompleted) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get available slots for next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const availableSlots = await TimeSlot.find({
      doctorId: id,
      isAvailable: true,
      isBooked: false,
      date: { $gte: today, $lte: nextWeek }
    }).sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      doctor,
      availableSlots
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all specialties
// @route   GET /api/public/specialties
// @access  Public
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct('speciality', { 
      profileCompleted: true,
      isVerified: true 
    });

    res.json({
      success: true,
      specialties: ['All', ...specialties]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getSpecialties
};
