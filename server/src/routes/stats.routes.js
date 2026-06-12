import express from 'express';
import { statsService } from '../services/stats.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get user statistics
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await statsService.getUserStats(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get activity statistics
router.get('/activity', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { days = 30 } = req.query;
  const result = await statsService.getActivityStats(userId, parseInt(days));
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get study session statistics
router.get('/study-sessions', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await statsService.getStudySessionStats(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get recent activity
router.get('/recent-activity', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 20 } = req.query;
  const result = await statsService.getRecentActivity(userId, parseInt(limit));
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get storage usage
router.get('/storage', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await statsService.getStorageUsage(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

export default router;
