import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ensure temporary upload directories exist
const uploadDir = path.join(process.cwd(), 'uploads');
const videosDir = path.join(uploadDir, 'videos');
const imagesDir = path.join(uploadDir, 'images');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, videosDir);
    } else {
      cb(null, imagesDir);
    }
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('video/') ||
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only video, image, and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB max
  },
});

// @desc    Upload video or image file to Cloudinary (with local fallback)
// @route   POST /api/upload
// @access  Private (Teacher, Admin)
router.post('/', protect, authorize('teacher', 'admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide a file to upload' });
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const filePath = req.file.path;
    const subfolder = isVideo ? 'videos' : 'images';
    let fileUrl = `/uploads/${subfolder}/${req.file.filename}`;
    let isCloudinary = false;

    // Attempt direct Cloudinary Cloud Upload
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: isVideo ? 'video' : 'image',
          folder: `skillorbit/${subfolder}`,
          chunk_size: isVideo ? 6000000 : undefined,
        });

        if (result && result.secure_url) {
          fileUrl = result.secure_url;
          isCloudinary = true;

          // Delete temp local file after successful Cloudinary upload
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning (using local fallback):', cloudErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `${isVideo ? 'Video' : 'File'} uploaded successfully${isCloudinary ? ' to Cloudinary CDN' : ''}`,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimetype: req.file.mimetype,
      isCloudinary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
