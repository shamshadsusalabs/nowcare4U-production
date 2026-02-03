const mongoose = require('mongoose');

const productInvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true,
        trim: true
    },
    // Vendor/Pharmacist Details (Snapshot for History)
    vendorDetails: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        gstNumber: { type: String },
        licenseNumber: { type: String }, // Drug License
        email: { type: String },
        phone: { type: String }
    },

    // Vendor Reference
    pharmacist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacist',
        required: true
    },

    // Customer Details (The receiver)
    customer: {
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String, required: true },
        gstin: { type: String }, // For B2B customers
        address: { type: String } // Quick address snapshot
    },

    // Ordered Items
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: { type: String, required: true },
        brand: { type: String },
        batchNumber: { type: String, required: true }, // CRITICAL for Pharma
        expiryDate: { type: Date, required: true },    // CRITICAL for Pharma
        hsnCode: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        unit: { type: String, default: 'Strip' },
        price: { type: Number, required: true }, // Unit Price
        discount: { type: Number, default: 0 }, // Item level discount
        taxableAmount: { type: Number, required: true }, // (Price * Qty) - Discount
        cgstRate: { type: Number, default: 0 },
        cgstAmount: { type: Number, default: 0 },
        sgstRate: { type: Number, default: 0 },
        sgstAmount: { type: Number, default: 0 },
        igstRate: { type: Number, default: 0 },
        igstAmount: { type: Number, default: 0 },
        total: { type: Number, required: true } // Taxable + Taxes
    }],

    // Address Details
    billingAddress: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' }
    },
    shippingAddress: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' }
    },

    // Bank Details
    bankDetails: {
        bankName: { type: String },
        accountName: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },
        branch: { type: String }
    },

    // Financial Summary
    subtotal: { type: Number, required: true }, // Gross Total before Discount
    totalDiscount: { type: Number, default: 0 }, // Total Discount given
    taxableAmount: { type: Number, required: true }, // Subtotal - Discount
    totalTax: { type: Number, default: 0 },
    shippingCharges: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 }, // +/- value to round off
    grandTotal: { type: Number, required: true }, // Final Payable

    // Invoice Status
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Paid', 'Cancelled', 'Overdue'],
        default: 'Pending'
    },

    // Dates
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    // Payment Info
    paymentDetails: {
        method: { type: String }, // e.g., 'UPI', 'Cash', 'Card'
        transactionId: { type: String },
        paymentDate: { type: Date },
        isPaid: { type: Boolean, default: false }
    },

    // Additional Info
    termsAndConditions: { type: String, default: 'Goods once sold will not be taken back.' },
    notes: { type: String, trim: true },
    prescriptionImage: { type: String } // Optional link to prescription
}, {
    timestamps: true
});

// Auto-generate Invoice Number
productInvoiceSchema.pre('save', async function (next) {
    if (!this.isNew || this.invoiceNumber) return next();

    try {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const prefix = `INV-${year}${month}${day}`;

        // Find last invoice with this prefix
        const lastInvoice = await this.constructor.findOne({
            invoiceNumber: { $regex: `^${prefix}` }
        }).sort({ invoiceNumber: -1 });

        let sequence = '001';
        if (lastInvoice && lastInvoice.invoiceNumber) {
            const parts = lastInvoice.invoiceNumber.split('-');
            const lastSequence = parseInt(parts[parts.length - 1]);
            if (!isNaN(lastSequence)) {
                sequence = String(lastSequence + 1).padStart(3, '0');
            }
        }

        this.invoiceNumber = `${prefix}-${sequence}`;
        next();
    } catch (error) {
        next(error);
    }
});

// Auto-populate helper indices
productInvoiceSchema.index({ invoiceNumber: 1 });
productInvoiceSchema.index({ pharmacist: 1 });
// productInvoiceSchema.index({ 'customer.userId': 1 }); // Removed as per request

module.exports = mongoose.model('ProductInvoice', productInvoiceSchema);
