const TimeSlot = require('../models/TimeSlot');
const Doctor = require('../models/Doctor');

// Helper function to generate 15-minute time slots
const generateTimeSlots = (startHour, endHour, date) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endMinute = minute + 15;
      const endHour = endMinute >= 60 ? hour + 1 : hour;
      const adjustedEndMinute = endMinute >= 60 ? 0 : endMinute;
      const endTime = `${endHour.toString().padStart(2, '0')}:${adjustedEndMinute.toString().padStart(2, '0')}`;
      
      slots.push({
        date: new Date(date),
        startTime,
        endTime
      });
    }
  }
  return slots;
};

// @desc    Create time slots for a doctor
// @route   POST /api/doctors/time-slots
// @access  Private (Doctor only)
const createTimeSlots = async (req, res) => {
  try {
    const { date, startHour, endHour } = req.body;
    const doctorId = req.doctor.id;

    // Validate input
    if (!date || !startHour || !endHour) {
      return res.status(400).json({ message: 'Date, start hour, and end hour are required' });
    }

    if (startHour >= endHour) {
      return res.status(400).json({ message: 'Start hour must be before end hour' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Generate 15-minute slots
    const slotsData = generateTimeSlots(startHour, endHour, date);
    
    // Add doctorId to each slot
    const slots = slotsData.map(slot => ({
      ...slot,
      doctorId
    }));

    // Remove existing slots for the same date and doctor
    await TimeSlot.deleteMany({ 
      doctorId, 
      date: new Date(date) 
    });

    // Create new slots
    const createdSlots = await TimeSlot.insertMany(slots);

    res.status(201).json({
      success: true,
      message: 'Time slots created successfully',
      slots: createdSlots,
      totalSlots: createdSlots.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor's time slots
// @route   GET /api/doctors/time-slots
// @access  Private (Doctor only)
const getDoctorTimeSlots = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const { date, startDate, endDate } = req.query;

    let query = { doctorId };

    console.log('Doctor ID:', doctorId);
    console.log('Query params:', { date, startDate, endDate });

    if (date) {
      // Get slots for specific date
      query.date = new Date(date);
    } else if (startDate && endDate) {
      // Get slots for date range
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Get all slots for this doctor (remove date filter for debugging)
      // const today = new Date();
      // const nextWeek = new Date(today);
      // nextWeek.setDate(today.getDate() + 7);
      // query.date = {
      //   $gte: today,
      //   $lte: nextWeek
      // };
    }

    console.log('Final query:', query);

    const slots = await TimeSlot.find(query)
      .populate('doctorId', 'name speciality')
      .sort({ date: 1, startTime: 1 });

    console.log('Found slots:', slots.length);
    console.log('Slots data:', slots);

    res.json({
      success: true,
      slots
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available slots for a doctor (Public)
// @route   GET /api/doctors/:doctorId/available-slots
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, startDate, endDate } = req.query;

    console.log('Fetching available slots for doctor:', doctorId);

    // Check if doctorId is a valid ObjectId format
    const mongoose = require('mongoose');
    let doctorQuery;
    
    if (mongoose.Types.ObjectId.isValid(doctorId)) {
      // If it's a valid ObjectId, use it directly
      doctorQuery = doctorId;
    } else {
      // If it's not a valid ObjectId (like a numeric ID), find the doctor first
      const doctor = await Doctor.findOne({ id: doctorId });
      if (!doctor) {
        return res.status(404).json({ 
          success: false,
          message: 'Doctor not found' 
        });
      }
      doctorQuery = doctor._id;
    }

    let query = { 
      doctorId: doctorQuery
    };

    if (date) {
      query.date = new Date(date);
    } else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Get all available slots (remove date filter for debugging)
      // const today = new Date();
      // const nextWeek = new Date(today);
      // nextWeek.setDate(today.getDate() + 7);
      // query.date = {
      //   $gte: today,
      //   $lte: nextWeek
      // };
    }

    console.log('Available slots query:', query);

    const slots = await TimeSlot.find(query)
      .populate('doctorId', 'name speciality consultationFee')
      .sort({ date: 1, startTime: 1 });

    console.log('Found available slots:', slots.length);

    res.json({
      success: true,
      availableSlots: slots
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update slot availability
// @route   PUT /api/doctors/time-slots/:slotId
// @access  Private (Doctor only)
const updateSlotAvailability = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { isAvailable } = req.body;
    const doctorId = req.doctor.id;

    const slot = await TimeSlot.findOne({ _id: slotId, doctorId });
    if (!slot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Cannot modify booked slot' });
    }

    slot.isAvailable = isAvailable;
    await slot.save();

    res.json({
      success: true,
      message: 'Slot availability updated',
      slot
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTimeSlots,
  getDoctorTimeSlots,
  getAvailableSlots,
  updateSlotAvailability
};
