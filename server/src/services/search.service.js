import pool from '../database/config.js';

export const searchService = {
  async fullTextSearch(userId, searchTerm, filters = {}) {
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

      if (filters.contentType) {
        query += ` AND content_type = $${paramCount}`;
        params.push(filters.contentType);
        paramCount++;
      }

      query += ` ORDER BY rank DESC, created_at DESC LIMIT 50`;

      const result = await pool.query(query, params);

      return {
        success: true,
        results: result.rows.map(note => this.formatSearchResult(note)),
        total: result.rows.length
      };
    } catch (error) {
      console.error('Full text search error:', error);
      return { success: false, error: error.message };
    }
  },

  async searchByKeywords(userId, keywords, filters = {}) {
    try {
      let query = `
        SELECT * FROM notes 
        WHERE user_id = $1 
        AND keywords && $2
        AND is_archived = $3
      `;
      const params = [userId, keywords, filters.archived === true ? true : false];
      let paramCount = 4;

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

      query += ` ORDER BY created_at DESC LIMIT 50`;

      const result = await pool.query(query, params);

      return {
        success: true,
        results: result.rows.map(note => this.formatSearchResult(note)),
        total: result.rows.length
      };
    } catch (error) {
      console.error('Search by keywords error:', error);
      return { success: false, error: error.message };
    }
  },

  async searchByTags(userId, tags, filters = {}) {
    try {
      let query = `
        SELECT * FROM notes 
        WHERE user_id = $1 
        AND tags && $2
        AND is_archived = $3
      `;
      const params = [userId, tags, filters.archived === true ? true : false];
      let paramCount = 4;

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

      query += ` ORDER BY created_at DESC LIMIT 50`;

      const result = await pool.query(query, params);

      return {
        success: true,
        results: result.rows.map(note => this.formatSearchResult(note)),
        total: result.rows.length
      };
    } catch (error) {
      console.error('Search by tags error:', error);
      return { success: false, error: error.message };
    }
  },

  async advancedSearch(userId, searchParams) {
    try {
      const {
        searchTerm,
        grades = [],
        subjects = [],
        units = [],
        contentTypes = [],
        tags = [],
        dateFrom,
        dateTo,
        favoriteOnly = false,
        includeArchived = false
      } = searchParams;

      let query = `
        SELECT * FROM notes 
        WHERE user_id = $1
      `;
      const params = [userId];
      let paramCount = 2;

      // Archive filter
      if (!includeArchived) {
        query += ` AND is_archived = false`;
      }

      // Favorite filter
      if (favoriteOnly) {
        query += ` AND is_favorite = true`;
      }

      // Full text search
      if (searchTerm && searchTerm.trim()) {
        const searchVector = `to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))`;
        const searchQuery = `plainto_tsquery('english', $${paramCount})`;
        query += ` AND ${searchVector} @@ ${searchQuery}`;
        params.push(searchTerm);
        paramCount++;
      }

      // Grade filter
      if (grades.length > 0) {
        query += ` AND grade = ANY($${paramCount})`;
        params.push(grades);
        paramCount++;
      }

      // Subject filter
      if (subjects.length > 0) {
        query += ` AND subject = ANY($${paramCount})`;
        params.push(subjects);
        paramCount++;
      }

      // Unit filter
      if (units.length > 0) {
        query += ` AND unit = ANY($${paramCount})`;
        params.push(units);
        paramCount++;
      }

      // Content type filter
      if (contentTypes.length > 0) {
        query += ` AND content_type = ANY($${paramCount})`;
        params.push(contentTypes);
        paramCount++;
      }

      // Tags filter
      if (tags.length > 0) {
        query += ` AND tags && $${paramCount}`;
        params.push(tags);
        paramCount++;
      }

      // Date range filter
      if (dateFrom) {
        query += ` AND created_at >= $${paramCount}`;
        params.push(dateFrom);
        paramCount++;
      }

      if (dateTo) {
        query += ` AND created_at <= $${paramCount}`;
        params.push(dateTo);
        paramCount++;
      }

      query += ` ORDER BY created_at DESC LIMIT 100`;

      const result = await pool.query(query, params);

      return {
        success: true,
        results: result.rows.map(note => this.formatSearchResult(note)),
        total: result.rows.length
      };
    } catch (error) {
      console.error('Advanced search error:', error);
      return { success: false, error: error.message };
    }
  },

  async getSuggestions(userId, partialTerm) {
    try {
      const query = `
        SELECT DISTINCT 
          unnest(keywords) as keyword,
          COUNT(*) as frequency
        FROM notes 
        WHERE user_id = $1 
        AND is_archived = false
        AND unnest(keywords) LIKE $2
        GROUP BY keyword
        ORDER BY frequency DESC
        LIMIT 10
      `;

      const result = await pool.query(query, [userId, `${partialTerm}%`]);

      return {
        success: true,
        suggestions: result.rows.map(row => row.keyword)
      };
    } catch (error) {
      console.error('Get suggestions error:', error);
      return { success: false, error: error.message };
    }
  },

  formatSearchResult(note) {
    return {
      id: note.id,
      title: note.title,
      content: note.content ? note.content.substring(0, 200) + '...' : '',
      grade: note.grade,
      subject: note.subject,
      unit: note.unit,
      keywords: note.keywords,
      tags: note.tags,
      contentType: note.content_type,
      isFavorite: note.is_favorite,
      createdAt: note.created_at,
      rank: note.rank
    };
  }
};
