import express from 'express';
import { backupService } from '../services/backup.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Export user data
router.get('/export', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await backupService.exportUserData(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Import user data
router.post('/import', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({
      success: false,
      error: 'Import data is required'
    });
  }

  const result = await backupService.importUserData(userId, data);
  
  if (result.success) {
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('data-imported', result.imported);
    
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Create backup
router.post('/create', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await backupService.createBackup(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// List backups
router.get('/list', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await backupService.listBackups(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Delete backup
router.delete('/:backupId', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const backupId = req.params.backupId;
  const result = await backupService.deleteBackup(userId, backupId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
}));

export default router;
