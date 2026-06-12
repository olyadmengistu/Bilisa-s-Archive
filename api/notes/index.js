// API endpoint for notes CRUD operations
import { 
  createNote, 
  getNotesByUserId, 
  getNoteById, 
  updateNote, 
  deleteNote, 
  searchNotes,
  getNoteStats
} from '../../lib/db.js';

export default async function handler(req, res) {
  const { method } = req;
  const userId = req.headers['x-user-id'];

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-User-Id');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  try {
    switch (method) {
      case 'GET':
        if (req.query.id) {
          // Get single note
          const note = await getNoteById(req.query.id, userId);
          if (!note) {
            return res.status(404).json({ error: 'Note not found' });
          }
          return res.status(200).json({ success: true, note });
        } else if (req.query.search === 'true') {
          // Search notes
          const filters = {
            grade: req.query.grade,
            subject: req.query.subject,
            unit: req.query.unit,
            keywords: req.query.keywords
          };
          const notes = await searchNotes(userId, filters);
          return res.status(200).json({ success: true, notes });
        } else if (req.query.stats === 'true') {
          // Get stats
          const stats = await getNoteStats(userId);
          return res.status(200).json({ success: true, stats });
        } else {
          // Get all notes
          const notes = await getNotesByUserId(userId);
          return res.status(200).json({ success: true, notes });
        }

      case 'POST':
        // Create new note
        const noteData = req.body;
        const newNote = await createNote(userId, noteData);
        return res.status(201).json({ success: true, note: newNote });

      case 'PUT':
        // Update note
        if (!req.query.id) {
          return res.status(400).json({ error: 'Note ID required' });
        }
        const updatedNote = await updateNote(req.query.id, userId, req.body);
        if (!updatedNote) {
          return res.status(404).json({ error: 'Note not found' });
        }
        return res.status(200).json({ success: true, note: updatedNote });

      case 'DELETE':
        // Delete note
        if (!req.query.id) {
          return res.status(400).json({ error: 'Note ID required' });
        }
        const deletedNote = await deleteNote(req.query.id, userId);
        if (!deletedNote) {
          return res.status(404).json({ error: 'Note not found' });
        }
        return res.status(200).json({ success: true });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
