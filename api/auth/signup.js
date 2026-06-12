// Simple signup endpoint
import { getUserByEmail, createUser } from '../../lib/db.js';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const passwordHash = hashPassword(password);
    const user = await createUser(email, passwordHash, displayName || email.split('@')[0]);

    res.status(201).json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        displayName: user.display_name 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
}
