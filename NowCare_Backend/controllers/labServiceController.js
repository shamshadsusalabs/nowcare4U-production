const LabService = require('../models/LabService');

// Create a new lab service
exports.createService = async (req, res) => {
    try {
        const serviceData = {
            ...req.body,
            labId: req.lab._id
        };

        const service = await LabService.create(serviceData);

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating service',
            error: error.message
        });
    }
};

// Get all services (with filters)
exports.getServices = async (req, res) => {
    try {
        const { testName, category, city, pincode, page = 1, limit = 10 } = req.query;
        const query = { isActive: true };

        if (testName) {
            query.testName = { $regex: testName, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        if (city) {
            query['location.city'] = { $regex: city, $options: 'i' };
        }
        if (pincode) {
            query['location.pincode'] = pincode;
        }

        const services = await LabService.find(query)
            .populate('labId', 'name email phoneNumber')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await LabService.countDocuments(query);

        res.status(200).json({
            success: true,
            data: services,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
};

// Get my services (for logged-in lab)
exports.getMyServices = async (req, res) => {
    try {
        const services = await LabService.find({ labId: req.lab._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your services',
            error: error.message
        });
    }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
    try {
        const service = await LabService.findById(req.params.id)
            .populate('labId', 'name email phoneNumber address city state');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching service details',
            error: error.message
        });
    }
};

// Update service
exports.updateService = async (req, res) => {
    try {
        let service = await LabService.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Check ownership
        if (service.labId.toString() !== req.lab._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this service'
            });
        }

        service = await LabService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating service',
            error: error.message
        });
    }
};

// Delete service
exports.deleteService = async (req, res) => {
    try {
        const service = await LabService.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Check ownership
        if (service.labId.toString() !== req.lab._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this service'
            });
        }

        await service.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting service',
            error: error.message
        });
    }
};
