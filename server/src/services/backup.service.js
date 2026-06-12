import pool from '../database/config.js';

export const backupService = {
  async exportUserData(userId) {
    try {
      // Get user info
      const userResult = await pool.query(
        'SELECT id, email, display_name, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }

      // Get all notes
      const notesResult = await pool.query(
        'SELECT * FROM notes WHERE user_id = $1',
        [userId]
      );

      // Get study sessions
      const sessionsResult = await pool.query(
        'SELECT * FROM study_sessions WHERE user_id = $1',
        [userId]
      );

      // Get user activities
      const activitiesResult = await pool.query(
        'SELECT * FROM user_activities WHERE user_id = $1',
        [userId]
      );

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        user: userResult.rows[0],
        notes: notesResult.rows,
        studySessions: sessionsResult.rows,
        activities: activitiesResult.rows
      };

      return {
        success: true,
        data: exportData,
        size: JSON.stringify(exportData).length
      };
    } catch (error) {
      console.error('Export user data error:', error);
      return { success: false, error: error.message };
    }
  },

  async importUserData(userId, importData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const { notes, studySessions, activities } = importData;

      // Import notes
      if (notes && notes.length > 0) {
        for (const note of notes) {
          await client.query(
            `INSERT INTO notes 
             (id, user_id, title, content, content_type, grade, subject, unit, pdf_data, pdf_name, pdf_size, keywords, tags, is_favorite, is_archived, view_count, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
             ON CONFLICT (id) DO NOTHING`,
            [
              note.id,
              userId,
              note.title,
              note.content,
              note.content_type,
              note.grade,
              note.subject,
              note.unit,
              note.pdf_data,
              note.pdf_name,
              note.pdf_size,
              note.keywords,
              note.tags,
              note.is_favorite,
              note.is_archived,
              note.view_count,
              note.created_at,
              note.updated_at
            ]
          );
        }
      }

      // Import study sessions
      if (studySessions && studySessions.length > 0) {
        for (const session of studySessions) {
          await client.query(
            `INSERT INTO study_sessions 
             (id, user_id, note_id, duration_minutes, started_at, ended_at, notes) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO NOTHING`,
            [
              session.id,
              userId,
              session.note_id,
              session.duration_minutes,
              session.started_at,
              session.ended_at,
              session.notes
            ]
          );
        }
      }

      // Import activities (optional, may skip for privacy)
      if (activities && activities.length > 0) {
        for (const activity of activities) {
          await client.query(
            `INSERT INTO user_activities 
             (id, user_id, activity_type, activity_data, created_at) 
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO NOTHING`,
            [
              activity.id,
              userId,
              activity.activity_type,
              activity.activity_data,
              activity.created_at
            ]
          );
        }
      }

      await client.query('COMMIT');

      return {
        success: true,
        imported: {
          notes: notes?.length || 0,
          studySessions: studySessions?.length || 0,
          activities: activities?.length || 0
        }
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Import user data error:', error);
      return { success: false, error: error.message };
    } finally {
      client.release();
    }
  },

  async createBackup(userId) {
    try {
      const exportResult = await this.exportUserData(userId);
      
      if (!exportResult.success) {
        return exportResult;
      }

      // Create backup record
      const result = await pool.query(
        `INSERT INTO backups (user_id, data, size) 
         VALUES ($1, $2, $3) 
         RETURNING id, created_at`,
        [userId, JSON.stringify(exportResult.data), exportResult.size]
      );

      return {
        success: true,
        backupId: result.rows[0].id,
        createdAt: result.rows[0].created_at,
        size: exportResult.size
      };
    } catch (error) {
      console.error('Create backup error:', error);
      return { success: false, error: error.message };
    }
  },

  async listBackups(userId) {
    try {
      const result = await pool.query(
        `SELECT id, size, created_at 
         FROM backups 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [userId]
      );

      return {
        success: true,
        backups: result.rows
      };
    } catch (error) {
      console.error('List backups error:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteBackup(userId, backupId) {
    try {
      await pool.query(
        'DELETE FROM backups WHERE id = $1 AND user_id = $2',
        [backupId, userId]
      );

      return { success: true };
    } catch (error) {
      console.error('Delete backup error:', error);
      return { success: false, error: error.message };
    }
  }
};
