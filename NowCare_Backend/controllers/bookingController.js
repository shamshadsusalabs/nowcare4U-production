const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const Doctor = require('../models/Doctor');

// @desc    Book an appointment
// @route   POST /api/bookings
// @access  Public
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, timeSlotId, patientPhone, patientName } = req.body;

    // Validate required fields
    if (!doctorId || !timeSlotId || !patientPhone || !patientName) {
      return res.status(400).json({ 
        message: 'Doctor ID, time slot ID, patient phone, and patient name are required' 
      });
    }

    // Check if time slot exists and is available
    const timeSlot = await TimeSlot.findById(timeSlotId).populate('doctorId');
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    if (timeSlot.isBooked || !timeSlot.isAvailable) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create booking
    const booking = await Booking.create({
      doctorId,
      timeSlotId,
      patientPhone,
      patientName,
      bookingDate: new Date(),
      appointmentDate: timeSlot.date,
      appointmentTime: timeSlot.startTime
    });

    // Mark time slot as booked
    timeSlot.isBooked = true;
    await timeSlot.save();

    // Populate booking with doctor details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('doctorId', 'name speciality consultationFee location')
      .populate('timeSlotId');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor's bookings
// @route   GET /api/doctors/bookings
// @access  Private (Doctor only)
const getDoctorBookings = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const { date, status } = req.query;

    let query = { doctorId };

    if (date) {
      query.appointmentDate = new Date(date);
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('timeSlotId')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient's bookings by phone
// @route   GET /api/bookings/patient/:phone
// @access  Public
const getPatientBookings = async (req, res) => {
  try {
    const { phone } = req.params;

    const bookings = await Booking.find({ patientPhone: phone })
      .populate('doctorId', 'name speciality consultationFee location image')
      .populate('timeSlotId')
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:bookingId/cancel
// @access  Public
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking can be cancelled (not in the past)
    const now = new Date();
    const appointmentDateTime = new Date(booking.appointmentDate);
    const [hours, minutes] = booking.appointmentTime.split(':');
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

    if (appointmentDateTime <= now) {
      return res.status(400).json({ message: 'Cannot cancel past appointments' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Free up the time slot
    await TimeSlot.findByIdAndUpdate(booking.timeSlotId, { 
      isBooked: false 
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getDoctorBookings,
  getPatientBookings,
  cancelBooking
};
