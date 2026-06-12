import express from 'express';
import { uploadService } from '../services/upload.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Upload single PDF file
router.post('/pdf', uploadService.single, asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  try {
    // Convert file to base64
    const base64 = await uploadService.fileToBase64(req.file.path);

    // Delete the temporary file
    await uploadService.deleteFile(req.file.filename);

    res.json({
      success: true,
      file: {
        name: req.file.originalname,
        size: req.file.size,
        data: base64,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}));

// Upload multiple PDF files
router.post('/pdfs', uploadService.multiple, asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files uploaded'
    });
  }

  try {
    const files = await Promise.all(req.files.map(async (file) => {
      const base64 = await uploadService.fileToBase64(file.path);
      await uploadService.deleteFile(file.filename);
      return {
        name: file.originalname,
        size: file.size,
        data: base64,
        mimetype: file.mimetype
      };
    }));

    res.json({
      success: true,
      files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}));

export default router;
