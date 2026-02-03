const Lab = require('../models/Lab');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new lab
// @route   POST /api/labs/register
// @access  Public
exports.registerLab = async (req, res) => {
    try {
        const {
            name, email, password, phoneNumber,
            labLicenseNumber, gstNumber,
            address, city, state, pincode
        } = req.body;

        // Check if lab already exists
        const labExists = await Lab.findOne({
            $or: [{ email }, { labLicenseNumber }, { gstNumber }]
        });

        if (labExists) {
            return res.status(400).json({
                success: false,
                message: 'Lab already exists with this email, license, or GST number'
            });
        }

        // Create lab
        const lab = await Lab.create({
            name,
            email,
            password,
            phoneNumber,
            labLicenseNumber,
            gstNumber,
            address,
            city,
            state,
            pincode
        });

        if (lab) {
            res.status(201).json({
                success: true,
                message: 'Lab registered successfully. Please wait for admin approval.',
                data: {
                    _id: lab._id,
                    name: lab.name,
                    email: lab.email,
                    isApproved: lab.isApproved
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid lab data'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering lab',
            error: error.message
        });
    }
};

// @desc    Login lab
// @route   POST /api/labs/login
// @access  Public
exports.loginLab = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for lab email
        const lab = await Lab.findOne({ email });

        if (lab && (await lab.comparePassword(password))) {
            if (!lab.isApproved) {
                return res.status(403).json({
                    success: false,
                    message: 'Account not approved. Please contact admin.'
                });
            }

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    _id: lab._id,
                    name: lab.name,
                    email: lab.email,
                    token: generateToken(lab._id)
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// @desc    Get lab profile
// @route   GET /api/labs/profile
// @access  Private
exports.getLabProfile = async (req, res) => {
    try {
        const lab = await Lab.findById(req.lab._id).select('-password');

        if (lab) {
            res.json({
                success: true,
                data: lab
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Lab not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// @desc    Update lab profile
// @route   PUT /api/labs/profile
// @access  Private
exports.updateLabProfile = async (req, res) => {
    try {
        const lab = await Lab.findById(req.lab._id);

        if (lab) {
            lab.name = req.body.name || lab.name;
            lab.phoneNumber = req.body.phoneNumber || lab.phoneNumber;
            lab.address = req.body.address || lab.address;
            lab.city = req.body.city || lab.city;
            lab.state = req.body.state || lab.state;
            lab.pincode = req.body.pincode || lab.pincode;

            if (req.body.password) {
                lab.password = req.body.password;
            }

            const updatedLab = await lab.save();

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    _id: updatedLab._id,
                    name: updatedLab.name,
                    email: updatedLab.email
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Lab not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
