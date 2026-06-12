// DEPRECATED: This file is replaced by api/notes/index.js
// Please use api/notes/index.js for all notes API operations
// This file is kept for backward compatibility only

export default async function handler(req, res) {
  res.status(301).json({ 
    message: 'This endpoint is deprecated. Please use /api/notes/index.js instead',
    redirect: '/api/notes'
  });
}
