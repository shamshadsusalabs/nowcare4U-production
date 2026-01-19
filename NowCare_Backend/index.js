require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const blogRoutes = require('./routes/blogRoutes');
const errorHandler = require('./middleware/errorHandler');
const congitivetestRoutes = require("./routes/congitivetestRoutes");
const kickCounterRoutes = require('./routes/kickCounterRoutes');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const publicDoctorRoutes = require('./routes/publicDoctorRoutes');
const ovulationRoutes = require('./routes/ovulationRoutes');
const phoneAuthRoutes = require('./routes/phoneAuthRoutes');
const diabetesRoutes = require('./routes/diabetesRoutes');
const pregnancyWeightRoutes = require('./routes/pregnancyWeightRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pharmacistRoutes = require('./routes/pharmacistRoutes');
const app = express();

// Enable CORS properly
app.use(cors({
  origin: [
    'https://nowcare4u-f1e6a.web.app',
    'https://nowcare4u.com',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser
app.use(express.json());

// DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/phone-auth', phoneAuthRoutes);
app.use('/api/blogs', blogRoutes);
app.use("/api/test", congitivetestRoutes);
app.use('/api/kick-counter', kickCounterRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/public', publicDoctorRoutes);
app.use('/api/ovulation', ovulationRoutes);
app.use('/api/diabetes', diabetesRoutes);
app.use('/api/pregnancy-weight', pregnancyWeightRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pharmacist', pharmacistRoutes);
// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
