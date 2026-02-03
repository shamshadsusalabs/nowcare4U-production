const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const labSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Lab name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },

    // License & Registration Details
    labLicenseNumber: {
        type: String,
        required: [true, 'Lab license number is required'],
        unique: true,
        trim: true
    },
    gstNumber: {
        type: String,
        required: [true, 'GST number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
            },
            message: 'Please enter a valid GST number'
        }
    },
    aadharNumber: {
        type: String,
        trim: true
    },
    panNumber: {
        type: String,
        trim: true
    },

    // Document URLs (Cloudinary)
    aadharFile: {
        type: String,
        default: ''
    },
    panFile: {
        type: String,
        default: ''
    },
    labLicenseFile: {
        type: String,
        default: ''
    },
    gstFile: {
        type: String,
        default: ''
    },

    // Address Details
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    pincode: {
        type: String,
        default: ''
    },

    // Approval & Verification Status
    isApproved: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rejectionReason: {
        type: String,
        default: ''
    },

    // Approval Metadata
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    approvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
labSchema.pre('save', async function (next) {
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
labSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Lab', labSchema);
