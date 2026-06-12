import express from 'express';
import { searchService } from '../services/search.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Full text search
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { q, grade, subject, unit, contentType, archived } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required'
    });
  }

  const filters = { grade, subject, unit, contentType, archived };
  const result = await searchService.fullTextSearch(userId, q, filters);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Search by keywords
router.get('/keywords', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { keywords, grade, subject, unit, archived } = req.query;
  
  if (!keywords) {
    return res.status(400).json({
      success: false,
      error: 'Keywords are required'
    });
  }

  const keywordArray = keywords.split(',').map(k => k.trim());
  const filters = { grade, subject, unit, archived };
  const result = await searchService.searchByKeywords(userId, keywordArray, filters);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Search by tags
router.get('/tags', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { tags, grade, subject, unit, archived } = req.query;
  
  if (!tags) {
    return res.status(400).json({
      success: false,
      error: 'Tags are required'
    });
  }

  const tagArray = tags.split(',').map(t => t.trim());
  const filters = { grade, subject, unit, archived };
  const result = await searchService.searchByTags(userId, tagArray, filters);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Advanced search
router.post('/advanced', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await searchService.advancedSearch(userId, req.body);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get search suggestions
router.get('/suggestions', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { term } = req.query;
  
  if (!term) {
    return res.status(400).json({
      success: false,
      error: 'Search term is required'
    });
  }

  const result = await searchService.getSuggestions(userId, term);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

export default router;
