const mongoose = require('mongoose');

const labServiceSchema = new mongoose.Schema({
    labId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: [true, 'Lab ID is required']
    },
    testName: {
        type: String,
        required: [true, 'Test name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'], // e.g., Pathology, Radiology
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Test description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    discountedPrice: {
        type: Number,
        min: [0, 'Discounted price cannot be negative']
    },

    // Detailed Location
    location: {
        address: {
            type: String,
            trim: true,
            required: [true, 'Location address is required']
        },
        city: {
            type: String,
            trim: true,
            required: [true, 'City is required']
        },
        pincode: {
            type: String,
            trim: true,
            required: [true, 'Pincode is required']
        },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },

    // Enhanced Details
    sampleType: {
        type: String, // e.g., 'Blood', 'Urine', 'Swab'
        trim: true
    },
    preTestRequirements: {
        type: [String], // e.g., ['Fasting required', 'Drink water']
        default: []
    },
    reportTurnaroundTime: {
        type: String, // e.g., '24 hours', '2-3 days'
        trim: true
    },
    ageGroup: {
        type: String, // e.g., 'All', 'Adults', 'Children', 'Senior Citizens'
        default: 'All'
    },
    gender: {
        type: String, // e.g., 'Male', 'Female', 'Both'
        enum: ['Male', 'Female', 'Both'],
        default: 'Both'
    },

    isHomeCollectionAvailable: {
        type: Boolean,
        default: false
    },
    homeCollectionCharges: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LabService', labServiceSchema);
