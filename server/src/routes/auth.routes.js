import express from 'express';
import { authService } from '../services/auth.service.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Register new user
router.post('/register', validateSignup, asyncHandler(async (req, res) => {
  const { email, password, displayName } = req.body;
  const result = await authService.register(email, password, displayName);
  
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Login user
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(401).json(result);
  }
}));

export default router;
