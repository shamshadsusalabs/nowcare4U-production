const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 500, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadBlogImage = upload.single('image');

// Pharmacist Documents Storage
const pharmacistDocsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file mimetype
    const isPDF = file.mimetype === 'application/pdf';

    return {
      folder: 'pharmacist-documents',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      resource_type: isPDF ? 'raw' : 'image',
      // Don't transform PDFs, only images
      transformation: isPDF ? undefined : [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto' }]
    };
  }
});

const uploadPharmacistDocs = multer({
  storage: pharmacistDocsStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per file
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs only
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'));
    }
  }
}).fields([
  { name: 'aadharFile', maxCount: 1 },
  { name: 'panFile', maxCount: 1 },
  { name: 'licenseFile', maxCount: 1 },
  { name: 'gstFile', maxCount: 1 }
]);

// Lab Documents Storage
const labDocsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';

    return {
      folder: 'lab-documents',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      resource_type: isPDF ? 'raw' : 'image',
      transformation: isPDF ? undefined : [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto' }]
    };
  }
});

const uploadLabDocs = multer({
  storage: labDocsStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per file
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'));
    }
  }
}).fields([
  { name: 'aadharFile', maxCount: 1 },
  { name: 'panFile', maxCount: 1 },
  { name: 'labLicenseFile', maxCount: 1 },
  { name: 'gstFile', maxCount: 1 }
]);

// Storage for Product Images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = {
  uploadBlogImage,
  uploadPharmacistDocs,
  uploadLabDocs,
  uploadProductImages: uploadProduct.array('images', 5)
};


