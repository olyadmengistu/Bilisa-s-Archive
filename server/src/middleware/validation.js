import { body, validationResult } from 'express-validator';

export const validateSignup = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Display name must be less than 255 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }
    next();
  }
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }
    next();
  }
];

export const validateNote = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 500 })
    .withMessage('Title must be less than 500 characters'),
  body('grade')
    .optional()
    .isIn(['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'])
    .withMessage('Invalid grade'),
  body('subject')
    .optional()
    .isIn(['Chemistry', 'Physics', 'Biology', 'Mathematics', 'English'])
    .withMessage('Invalid subject'),
  body('unit')
    .optional()
    .matches(/^Unit \d{1,2}$/)
    .withMessage('Invalid unit format'),
  body('content')
    .optional()
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }
    next();
  }
];
