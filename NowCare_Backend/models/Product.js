const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pharmacist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacist',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    // Composition/Salt (e.g., Paracetamol 500mg)
    composition: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    manufacturer: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Cream', 'Gel', 'Drops', 'Powder', 'Equipment', 'Other'],
        default: 'Other'
    },

    // Description and Media
    description: {
        type: String,
        trim: true
    },
    images: [{
        type: String // Cloudinary URLs
    }],

    // Inventory Details ("kitna strip hai")
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: 0
    },
    unit: {
        type: String,
        default: 'Strip', // e.g., Strip, Bottle, Box, Tube
        required: true
    },
    packingDetails: {
        type: String,
        default: '10 Tablets/Strip' // Helper text to clarify unit size
    },

    // Important Dates
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    manufacturingDate: {
        type: Date
    },

    // Pricing & Offers
    mrp: {
        type: Number,
        required: [true, 'MRP is required'],
        min: 0
    },
    price: {
        type: Number,
        required: [true, 'Selling price is required'],
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    // Delivery & Logistics
    deliveryTime: {
        type: String, // e.g., "2 hours", "1 day" ("kab tak delivery karega")
        default: "24 hours"
    },
    minimumOrderQuantity: {
        type: Number, // "minimum kitna dega"
        default: 1
    },
    isPrescriptionRequired: {
        type: Boolean,
        default: false
    },

    // Status
    isAvailable: {
        type: Boolean,
        default: true
    },

    // Location Details (Optional override or cache of Pharmacist location)
    location: {
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        pincode: { type: String, trim: true },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    }
}, {
    timestamps: true
});

// Calculate discounted price before saving if not specifically set? 
// Or just let frontend handle it. Usually better to store the explicit selling price.

module.exports = mongoose.model('Product', productSchema);
