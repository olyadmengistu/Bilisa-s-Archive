import pool from '../database/config.js';

export const noteService = {
  async createNote(userId, noteData) {
    try {
      const {
        title,
        content,
        contentType = 'text',
        grade,
        subject,
        unit,
        pdfData,
        pdfName,
        pdfSize,
        tags = []
      } = noteData;

      // Extract keywords from content
      const keywords = this.extractKeywords(content || '');

      const result = await pool.query(
        `INSERT INTO notes 
         (user_id, title, content, content_type, grade, subject, unit, pdf_data, pdf_name, pdf_size, keywords, tags) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
         RETURNING *`,
        [userId, title, content, contentType, grade, subject, unit, pdfData, pdfName, pdfSize, keywords, tags]
      );

      const note = result.rows[0];

      // Log activity
      await this.logActivity(userId, 'note_created', { noteId: note.id, title });

      return {
        success: true,
        note: this.formatNote(note)
      };
    } catch (error) {
      console.error('Create note error:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllNotes(userId, filters = {}) {
    try {
      let query = `
        SELECT * FROM notes 
        WHERE user_id = $1 AND is_archived = $2
      `;
      const params = [userId, filters.archived === true ? true : false];
      let paramCount = 3;

      // Apply filters
      if (filters.grade && filters.grade !== 'all') {
        query += ` AND grade = $${paramCount}`;
        params.push(filters.grade);
        paramCount++;
      }

      if (filters.subject && filters.subject !== 'all') {
        query += ` AND subject = $${paramCount}`;
        params.push(filters.subject);
        paramCount++;
      }

      if (filters.unit && filters.unit !== 'all') {
        query += ` AND unit = $${paramCount}`;
        params.push(filters.unit);
        paramCount++;
      }

      if (filters.favorite === true) {
        query += ` AND is_favorite = true`;
      }

      if (filters.contentType) {
        query += ` AND content_type = $${paramCount}`;
        params.push(filters.contentType);
        paramCount++;
      }

      query += ` ORDER BY created_at DESC`;

      const result = await pool.query(query, params);

      return {
        success: true,
        notes: result.rows.map(note => this.formatNote(note))
      };
    } catch (error) {
      console.error('Get notes error:', error);
      return { success: false, error: error.message };
    }
  },

  async getNoteById(userId, noteId) {
    try {
      const result = await pool.query(
        'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
        [noteId, userId]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'Note not found' };
      }

      // Increment view count
      await pool.query(
        'UPDATE notes SET view_count = view_count + 1 WHERE id = $1',
        [noteId]
      );

      return {
        success: true,
        note: this.formatNote(result.rows[0])
      };
    } catch (error) {
      console.error('Get note error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateNote(userId, noteId, updates) {
    try {
      const allowedUpdates = ['title', 'content', 'grade', 'subject', 'unit', 'tags', 'is_favorite', 'is_archived'];
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          updateFields.push(`${key} = $${paramCount}`);
          updateValues.push(value);
          paramCount++;
        }
      }

      // Recalculate keywords if content is updated
      if (updates.content) {
        const keywords = this.extractKeywords(updates.content);
        updateFields.push(`keywords = $${paramCount}`);
        updateValues.push(keywords);
        paramCount++;
      }

      if (updateFields.length === 0) {
        return { success: false, error: 'No valid fields to update' };
      }

      updateValues.push(noteId, userId);

      const query = `
        UPDATE notes 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount} AND user_id = $${paramCount + 1} 
        RETURNING *
      `;

      const result = await pool.query(query, updateValues);

      if (result.rows.length === 0) {
        return { success: false, error: 'Note not found' };
      }

      // Log activity
      await this.logActivity(userId, 'note_updated', { noteId, title: result.rows[0].title });

      return {
        success: true,
        note: this.formatNote(result.rows[0])
      };
    } catch (error) {
      console.error('Update note error:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteNote(userId, noteId) {
    try {
      const result = await pool.query(
        'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING title',
        [noteId, userId]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'Note not found' };
      }

      // Log activity
      await this.logActivity(userId, 'note_deleted', { noteId, title: result.rows[0].title });

      return { success: true };
    } catch (error) {
      console.error('Delete note error:', error);
      return { success: false, error: error.message };
    }
  },

  async searchNotes(userId, searchTerm, filters = {}) {
    try {
      const searchVector = `
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
      `;
      const searchQuery = `
        plainto_tsquery('english', $1)
      `;

      let query = `
        SELECT *, ts_rank(${searchVector}, ${searchQuery}) as rank
        FROM notes 
        WHERE user_id = $2 
        AND ${searchVector} @@ ${searchQuery}
        AND is_archived = $3
      `;
      const params = [searchTerm, userId, filters.archived === true ? true : false];
      let paramCount = 4;

      // Apply additional filters
      if (filters.grade && filters.grade !== 'all') {
        query += ` AND grade = $${paramCount}`;
        params.push(filters.grade);
        paramCount++;
      }

      if (filters.subject && filters.subject !== 'all') {
        query += ` AND subject = $${paramCount}`;
        params.push(filters.subject);
        paramCount++;
      }

      if (filters.unit && filters.unit !== 'all') {
        query += ` AND unit = $${paramCount}`;
        params.push(filters.unit);
        paramCount++;
      }

      query += ` ORDER BY rank DESC, created_at DESC`;

      const result = await pool.query(query, params);

      return {
        success: true,
        notes: result.rows.map(note => this.formatNote(note))
      };
    } catch (error) {
      console.error('Search notes error:', error);
      return { success: false, error: error.message };
    }
  },

  async getNotesBySubject(userId, subject) {
    try {
      const result = await pool.query(
        `SELECT * FROM notes 
         WHERE user_id = $1 AND subject = $2 AND is_archived = false 
         ORDER BY created_at DESC`,
        [userId, subject]
      );

      return {
        success: true,
        notes: result.rows.map(note => this.formatNote(note))
      };
    } catch (error) {
      console.error('Get notes by subject error:', error);
      return { success: false, error: error.message };
    }
  },

  async getFavoriteNotes(userId) {
    try {
      const result = await pool.query(
        `SELECT * FROM notes 
         WHERE user_id = $1 AND is_favorite = true AND is_archived = false 
         ORDER BY created_at DESC`,
        [userId]
      );

      return {
        success: true,
        notes: result.rows.map(note => this.formatNote(note))
      };
    } catch (error) {
      console.error('Get favorite notes error:', error);
      return { success: false, error: error.message };
    }
  },

  async getArchivedNotes(userId) {
    try {
      const result = await pool.query(
        `SELECT * FROM notes 
         WHERE user_id = $1 AND is_archived = true 
         ORDER BY created_at DESC`,
        [userId]
      );

      return {
        success: true,
        notes: result.rows.map(note => this.formatNote(note))
      };
    } catch (error) {
      console.error('Get archived notes error:', error);
      return { success: false, error: error.message };
    }
  },

  extractKeywords(content) {
    if (!content) return [];

    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could'].includes(word));

    return [...new Set(words)].slice(0, 20);
  },

  formatNote(note) {
    return {
      id: note.id,
      userId: note.user_id,
      title: note.title,
      content: note.content,
      contentType: note.content_type,
      grade: note.grade,
      subject: note.subject,
      unit: note.unit,
      pdfData: note.pdf_data,
      pdfName: note.pdf_name,
      pdfSize: note.pdf_size,
      keywords: note.keywords,
      tags: note.tags,
      isFavorite: note.is_favorite,
      isArchived: note.is_archived,
      viewCount: note.view_count,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    };
  },

  async logActivity(userId, activityType, activityData) {
    try {
      await pool.query(
        `INSERT INTO user_activities (user_id, activity_type, activity_data) 
         VALUES ($1, $2, $3)`,
        [userId, activityType, JSON.stringify(activityData)]
      );
    } catch (error) {
      console.error('Log activity error:', error);
    }
  }
};
