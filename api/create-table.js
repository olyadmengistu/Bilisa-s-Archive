// Database schema setup for Vercel Postgres
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        display_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create notes table
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        grade VARCHAR(50) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        content TEXT,
        pdf_data TEXT,
        pdf_name VARCHAR(255),
        keywords TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_grade ON notes(grade);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
    `;

    res.status(200).json({ message: 'Database tables created successfully' });
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ error: error.message });
  }
}
