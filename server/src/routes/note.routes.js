import express from 'express';
import { noteService } from '../services/note.service.js';
import { validateNote } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all notes for user
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const filters = req.query;
  const result = await noteService.getAllNotes(userId, filters);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get single note by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const result = await noteService.getNoteById(userId, noteId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
}));

// Create new note
router.post('/', validateNote, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await noteService.createNote(userId, req.body);
  
  if (result.success) {
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('note-created', result.note);
    
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Update note
router.put('/:id', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const result = await noteService.updateNote(userId, noteId, req.body);
  
  if (result.success) {
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('note-updated', result.note);
    
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Delete note
router.delete('/:id', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const result = await noteService.deleteNote(userId, noteId);
  
  if (result.success) {
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('note-deleted', { id: noteId });
    
    res.json(result);
  } else {
    res.status(404).json(result);
  }
}));

// Get notes by subject
router.get('/subject/:subject', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const subject = req.params.subject;
  const result = await noteService.getNotesBySubject(userId, subject);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get favorite notes
router.get('/favorites/list', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await noteService.getFavoriteNotes(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

// Get archived notes
router.get('/archived/list', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await noteService.getArchivedNotes(userId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
}));

export default router;
