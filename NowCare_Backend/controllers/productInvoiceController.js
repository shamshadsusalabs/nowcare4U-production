const ProductInvoice = require('../models/ProductInvoice');
const Product = require('../models/Product');
const Pharmacist = require('../models/Pharmacist');
const mongoose = require('mongoose');

// Create new invoice
exports.createInvoice = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            customer,
            items,
            billingAddress,
            shippingAddress,
            paymentDetails,
            notes,
            termsAndConditions,
            status,
            dueDate
        } = req.body;

        // 1. Fetch Pharmacist details for Vendor Snapshot
        const pharmacist = await Pharmacist.findById(req.pharmacistId);
        if (!pharmacist) {
            throw new Error('Pharmacist not found');
        }

        const vendorDetails = {
            name: pharmacist.name || 'Pharmacy Name', // Assuming name exists
            address: pharmacist.address || 'Address',
            gstNumber: pharmacist.gstNumber,
            licenseNumber: pharmacist.licenseNumber,
            email: pharmacist.email,
            phone: pharmacist.phoneNumber
        };

        // 2. Validate Items and Calculate Totals
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        let grandTotal = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product).session(session);
            if (!product) {
                throw new Error(`Product not found: ${item.name}`);
            }

            // Check Stock
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
            }

            // Deduct Stock
            product.stock -= item.quantity;
            await product.save({ session });

            // Calculations
            // Item Total = (Price * Qty) - Discount + Tax
            // Taxable Amount = (Price * Qty) - Discount

            const itemPriceTotal = item.price * item.quantity;
            const itemDiscount = item.discount || 0; // Absolute value provided by frontend?
            // Or if discount is percentage, calculate it. Assuming absolute value for now based on schema defaulting to 0 number.

            const taxableAmount = itemPriceTotal - itemDiscount;

            // Calculate GST
            // If rates are provided
            const cgstRate = item.cgstRate || 0;
            const sgstRate = item.sgstRate || 0;
            const igstRate = item.igstRate || 0;

            const cgstAmount = Number(((taxableAmount * cgstRate) / 100).toFixed(2));
            const sgstAmount = Number(((taxableAmount * sgstRate) / 100).toFixed(2));
            const igstAmount = Number(((taxableAmount * igstRate) / 100).toFixed(2));

            const itemTotalTax = cgstAmount + sgstAmount + igstAmount;
            const itemTotal = taxableAmount + itemTotalTax;

            processedItems.push({
                ...item,
                batchNumber: item.batchNumber || 'BATCH-NA', // Should ideally come from Product
                expiryDate: item.expiryDate || product.expiryDate,
                taxableAmount,
                cgstAmount,
                sgstAmount,
                igstAmount,
                total: itemTotal
            });

            subtotal += itemPriceTotal;
            totalDiscount += itemDiscount;
            totalTax += itemTotalTax;
        }

        const shippingCharges = req.body.shippingCharges || 0;
        const tempGrandTotal = (subtotal - totalDiscount) + totalTax + shippingCharges;

        // Round off logic
        const roundedGrandTotal = Math.round(tempGrandTotal);
        const roundOff = Number((roundedGrandTotal - tempGrandTotal).toFixed(2));

        // 3. Create Invoice
        const newInvoice = new ProductInvoice({
            pharmacist: req.pharmacistId,
            vendorDetails,
            customer,
            items: processedItems,
            billingAddress,
            shippingAddress: shippingAddress || billingAddress, // Default to billing if not present
            bankDetails: req.body.bankDetails, // You might want to store default bank details in Pharmacist model

            subtotal,
            totalDiscount,
            taxableAmount: subtotal - totalDiscount,
            totalTax,
            shippingCharges,
            roundOff,
            grandTotal: roundedGrandTotal,

            status: status || 'Pending',
            paymentDetails,
            dueDate,
            notes,
            termsAndConditions
        });

        await newInvoice.save({ session });

        await session.commitTransaction();
        res.status(201).json({
            success: true,
            data: newInvoice
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

// Get all invoices for logged-in pharmacist
exports.getInvoices = async (req, res) => {
    try {
        const { search, startDate, endDate, status, page = 1, limit = 10 } = req.query;
        const query = { pharmacist: req.pharmacistId };

        if (status && status !== 'All') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { 'customer.name': { $regex: search, $options: 'i' } },
                { 'customer.phone': { $regex: search, $options: 'i' } },
                { invoiceNumber: { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate && endDate) {
            query.issueDate = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            };
        }

        const invoices = await ProductInvoice.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ProductInvoice.countDocuments(query);

        res.status(200).json({
            success: true,
            data: invoices,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get specific invoice
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await ProductInvoice.findOne({
            _id: req.params.id,
            pharmacist: req.pharmacistId
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update status
exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { status, paymentDetails } = req.body;

        const invoice = await ProductInvoice.findOne({
            _id: req.params.id,
            pharmacist: req.pharmacistId
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        invoice.status = status;
        if (paymentDetails) {
            invoice.paymentDetails = { ...invoice.paymentDetails, ...paymentDetails };
        }

        await invoice.save();

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
