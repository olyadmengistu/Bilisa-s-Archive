import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

export const uploadService = {
  // Middleware for handling single file upload
  single: upload.single('file'),

  // Middleware for handling multiple file uploads
  multiple: upload.array('files', 5),

  // Convert file to base64
  async fileToBase64(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      const base64 = data.toString('base64');
      return base64;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      throw error;
    }
  },

  // Delete uploaded file
  async deleteFile(filename) {
    try {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { success: true };
      }
      return { success: false, error: 'File not found' };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  },

  // Get file info
  getFileInfo(filename) {
    try {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);
      return {
        success: true,
        size: stats.size,
        name: filename,
        path: filePath
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return { success: false, error: error.message };
    }
  }
};

export default uploadService;
