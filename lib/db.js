// Database connection and utilities for Vercel Postgres
import { sql } from '@vercel/postgres';

export async function getUserByEmail(email) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result.rows[0];
}

export async function createUser(email, passwordHash, displayName) {
  const result = await sql`
    INSERT INTO users (email, password_hash, display_name)
    VALUES (${email}, ${passwordHash}, ${displayName})
    RETURNING *
  `;
  return result.rows[0];
}

export async function createNote(userId, noteData) {
  const result = await sql`
    INSERT INTO notes (user_id, title, grade, subject, unit, content, pdf_data, pdf_name, keywords)
    VALUES (
      ${userId},
      ${noteData.title},
      ${noteData.grade},
      ${noteData.subject},
      ${noteData.unit},
      ${noteData.content || null},
      ${noteData.pdfData || null},
      ${noteData.pdfName || null},
      ${noteData.keywords || []}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function getNotesByUserId(userId) {
  const result = await sql`
    SELECT * FROM notes 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return result.rows;
}

export async function getNoteById(noteId, userId) {
  const result = await sql`
    SELECT * FROM notes 
    WHERE id = ${noteId} AND user_id = ${userId}
  `;
  return result.rows[0];
}

export async function updateNote(noteId, userId, updateData) {
  const result = await sql`
    UPDATE notes 
    SET 
      title = ${updateData.title},
      grade = ${updateData.grade},
      subject = ${updateData.subject},
      unit = ${updateData.unit},
      content = ${updateData.content || null},
      pdf_data = ${updateData.pdfData || null},
      pdf_name = ${updateData.pdfName || null},
      keywords = ${updateData.keywords || []},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${noteId} AND user_id = ${userId}
    RETURNING *
  `;
  return result.rows[0];
}

export async function deleteNote(noteId, userId) {
  const result = await sql`
    DELETE FROM notes 
    WHERE id = ${noteId} AND user_id = ${userId}
    RETURNING *
  `;
  return result.rows[0];
}

export async function searchNotes(userId, filters) {
  let query = sql`SELECT * FROM notes WHERE user_id = ${userId}`;
  const params = [];

  if (filters.grade && filters.grade !== 'all') {
    query = sql`${query} AND grade = ${filters.grade}`;
  }

  if (filters.subject && filters.subject !== 'all') {
    query = sql`${query} AND subject = ${filters.subject}`;
  }

  if (filters.unit && filters.unit !== 'all') {
    query = sql`${query} AND unit = ${filters.unit}`;
  }

  if (filters.keywords && filters.keywords.trim()) {
    query = sql`${query} AND (
      title ILIKE ${'%' + filters.keywords + '%'} OR
      content ILIKE ${'%' + filters.keywords + '%'}
    )`;
  }

  query = sql`${query} ORDER BY created_at DESC`;
  const result = await query;
  return result.rows;
}

export async function getNoteStats(userId) {
  const result = await sql`
    SELECT 
      COUNT(*) as total_notes,
      grade,
      COUNT(*) as grade_count
    FROM notes 
    WHERE user_id = ${userId}
    GROUP BY grade
  `;
  
  const stats = { totalNotes: 0, gradeStats: {} };
  result.rows.forEach(row => {
    stats.totalNotes += parseInt(row.total_notes);
    stats.gradeStats[row.grade] = parseInt(row.grade_count);
  });
  
  return stats;
}
