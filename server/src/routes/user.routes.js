import express from 'express';
import { userService } from '../services/user.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get user profile
router.get('/profile', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.getProfile(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
}));

// Update user profile
router.put('/profile', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.updateProfile(userId, req.body);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get user preferences
router.get('/preferences', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.getPreferences(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
}));

// Update user preferences
router.put('/preferences', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.updatePreferences(userId, req.body);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Delete user account
router.delete('/account', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.deleteAccount(userId);
  
  if (result.success) {
    res.json({ success: true, message: 'Account deleted successfully' });
  } else {
    res.status(400).json(result);
  }
}));

export default router;
