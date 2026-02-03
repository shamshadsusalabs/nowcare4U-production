const Product = require('../models/Product');
const Pharmacist = require('../models/Pharmacist');

// Create a new product
exports.createProduct = async (req, res, next) => {
    try {
        // Only pharmacists can add products directly for now
        // If admin adds, they need to select a pharmacist? 
        // Assuming logged-in pharmacist adds for themselves.
        const pharmacistId = req.pharmacist.id;

        // Check if pharmacist is active/approved
        if (!req.pharmacist.isApproved) {
            return res.status(403).json({ success: false, message: 'Pharmacist not approved to add products' });
        }

        const {
            name, composition, brand, manufacturer, category, description,
            stock, unit, packingDetails,
            expiryDate, manufacturingDate,
            mrp, price, discount,
            deliveryTime, minimumOrderQuantity, isPrescriptionRequired,
            // Location override
            address, city, pincode, lat, lng
        } = req.body;

        const images = req.files ? req.files.map(file => file.path) : [];

        // Parse location if provided
        let location = undefined;
        if (address || city || pincode || (lat && lng)) {
            location = {
                address, city, pincode,
                coordinates: (lat && lng) ? { lat: Number(lat), lng: Number(lng) } : undefined
            };
        }

        const product = new Product({
            pharmacist: pharmacistId,
            name, composition, brand, manufacturer, category, description,
            images,
            stock: Number(stock),
            unit, packingDetails,
            expiryDate, manufacturingDate,
            mrp: Number(mrp),
            price: Number(price),
            discount: Number(discount || 0),
            deliveryTime,
            minimumOrderQuantity: Number(minimumOrderQuantity || 1),
            isPrescriptionRequired: isPrescriptionRequired === 'true',
            location
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

// Get all products (with filters)
exports.getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        // Filter by name (search)
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { composition: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Filter by Category
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Filter by Pharmacist (e.g. for "My Products" page or public store view)
        if (req.query.pharmacistId) {
            filter.pharmacist = req.query.pharmacistId;
        }
        // If logged in as pharmacist and asking for own products (via route logic?)
        // This function can handle generic queries.

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('pharmacist', 'name address city state pincode phoneNumber isVerified') // Populate pharmacist details
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter)
        ]);

        res.json({
            success: true,
            products,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

// Get single product
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('pharmacist', 'name email phoneNumber address city state pincode');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Authorization check: Only owner (pharmacist) or Admin can update
        // req.pharmacist exists if pharmacist logged in. req.admin exists if admin logged in.
        if (req.pharmacist && product.pharmacist.toString() !== req.pharmacist.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
        }
        // If req.admin exists, they can pass.

        // Merge updates
        const updates = { ...req.body };

        // Handle specific numeric fields to ensure type safety if they are present in body
        if (updates.stock) updates.stock = Number(updates.stock);
        if (updates.mrp) updates.mrp = Number(updates.mrp);
        if (updates.price) updates.price = Number(updates.price);
        if (updates.discount) updates.discount = Number(updates.discount);
        if (updates.minimumOrderQuantity) updates.minimumOrderQuantity = Number(updates.minimumOrderQuantity);

        // Handle images: append new ones? Or replace?
        // Usually append or specific logic. For now, let's say if new images uploaded, we ADD them.
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            updates.images = [...product.images, ...newImages];
        }

        // Check if location fields are updated individually
        if (updates.address || updates.city || updates.pincode || (updates.lat && updates.lng)) {
            updates.location = {
                ...product.location,
                address: updates.address || product.location?.address,
                city: updates.city || product.location?.city,
                pincode: updates.pincode || product.location?.pincode,
                coordinates: (updates.lat && updates.lng) ? { lat: Number(updates.lat), lng: Number(updates.lng) } : product.location?.coordinates
            };
        }

        product = await Product.findByIdAndUpdate(productId, updates, { new: true, runValidators: true });

        res.json({ success: true, message: 'Product updated', product });
    } catch (error) {
        next(error);
    }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Authorization: Owner or Admin
        if (req.pharmacist && product.pharmacist.toString() !== req.pharmacist.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
        }

        await product.deleteOne();

        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};
