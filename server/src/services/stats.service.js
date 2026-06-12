import pool from '../database/config.js';

export const statsService = {
  async getUserStats(userId) {
    try {
      const queries = await Promise.all([
        // Total notes
        pool.query(
          'SELECT COUNT(*) as count FROM notes WHERE user_id = $1 AND is_archived = false',
          [userId]
        ),
        // Notes by grade
        pool.query(
          `SELECT grade, COUNT(*) as count 
           FROM notes 
           WHERE user_id = $1 AND is_archived = false 
           GROUP BY grade 
           ORDER BY grade`,
          [userId]
        ),
        // Notes by subject
        pool.query(
          `SELECT subject, COUNT(*) as count 
           FROM notes 
           WHERE user_id = $1 AND is_archived = false 
           GROUP BY subject 
           ORDER BY count DESC`,
          [userId]
        ),
        // Notes by content type
        pool.query(
          `SELECT content_type, COUNT(*) as count 
           FROM notes 
           WHERE user_id = $1 AND is_archived = false 
           GROUP BY content_type`,
          [userId]
        ),
        // Favorite notes count
        pool.query(
          'SELECT COUNT(*) as count FROM notes WHERE user_id = $1 AND is_favorite = true AND is_archived = false',
          [userId]
        ),
        // Archived notes count
        pool.query(
          'SELECT COUNT(*) as count FROM notes WHERE user_id = $1 AND is_archived = true',
          [userId]
        ),
        // Total view count
        pool.query(
          'SELECT SUM(view_count) as total FROM notes WHERE user_id = $1',
          [userId]
        ),
        // Notes created in last 7 days
        pool.query(
          `SELECT COUNT(*) as count 
           FROM notes 
           WHERE user_id = $1 
           AND created_at >= NOW() - INTERVAL '7 days'`,
          [userId]
        ),
        // Notes created in last 30 days
        pool.query(
          `SELECT COUNT(*) as count 
           FROM notes 
           WHERE user_id = $1 
           AND created_at >= NOW() - INTERVAL '30 days'`,
          [userId]
        )
      ]);

      return {
        success: true,
        stats: {
          totalNotes: parseInt(queries[0].rows[0].count),
          byGrade: queries[1].rows,
          bySubject: queries[2].rows,
          byContentType: queries[3].rows,
          favoriteNotes: parseInt(queries[4].rows[0].count),
          archivedNotes: parseInt(queries[5].rows[0].count),
          totalViews: parseInt(queries[6].rows[0].total) || 0,
          notesLast7Days: parseInt(queries[7].rows[0].count),
          notesLast30Days: parseInt(queries[8].rows[0].count)
        }
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return { success: false, error: error.message };
    }
  },

  async getActivityStats(userId, days = 30) {
    try {
      const result = await pool.query(
        `SELECT 
          activity_type,
          COUNT(*) as count,
          DATE(created_at) as date
         FROM user_activities 
         WHERE user_id = $1 
         AND created_at >= NOW() - INTERVAL '${days} days'
         GROUP BY activity_type, DATE(created_at)
         ORDER BY date DESC, count DESC`,
        [userId]
      );

      return {
        success: true,
        activities: result.rows
      };
    } catch (error) {
      console.error('Get activity stats error:', error);
      return { success: false, error: error.message };
    }
  },

  async getStudySessionStats(userId) {
    try {
      const result = await pool.query(
        `SELECT 
          COUNT(*) as total_sessions,
          SUM(duration_minutes) as total_minutes,
          AVG(duration_minutes) as avg_duration,
          MAX(duration_minutes) as max_duration
         FROM study_sessions 
         WHERE user_id = $1`,
        [userId]
      );

      const sessionsBySubject = await pool.query(
        `SELECT 
          n.subject,
          COUNT(ss.id) as session_count,
          SUM(ss.duration_minutes) as total_minutes
         FROM study_sessions ss
         LEFT JOIN notes n ON ss.note_id = n.id
         WHERE ss.user_id = $1
         GROUP BY n.subject
         ORDER BY total_minutes DESC`,
        [userId]
      );

      return {
        success: true,
        stats: {
          totalSessions: parseInt(result.rows[0].total_sessions),
          totalMinutes: parseInt(result.rows[0].total_minutes) || 0,
          avgDuration: parseFloat(result.rows[0].avg_duration) || 0,
          maxDuration: parseInt(result.rows[0].max_duration) || 0,
          bySubject: sessionsBySubject.rows
        }
      };
    } catch (error) {
      console.error('Get study session stats error:', error);
      return { success: false, error: error.message };
    }
  },

  async getRecentActivity(userId, limit = 20) {
    try {
      const result = await pool.query(
        `SELECT activity_type, activity_data, created_at
         FROM user_activities 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [userId, limit]
      );

      return {
        success: true,
        activities: result.rows
      };
    } catch (error) {
      console.error('Get recent activity error:', error);
      return { success: false, error: error.message };
    }
  },

  async getStorageUsage(userId) {
    try {
      const result = await pool.query(
        `SELECT 
          COUNT(*) as note_count,
          SUM(pdf_size) as total_pdf_size,
          SUM(LENGTH(content)) as total_text_size
         FROM notes 
         WHERE user_id = $1`,
        [userId]
      );

      const totalPdfSize = parseInt(result.rows[0].total_pdf_size) || 0;
      const totalTextSize = parseInt(result.rows[0].total_text_size) || 0;

      return {
        success: true,
        usage: {
          noteCount: parseInt(result.rows[0].note_count),
          totalPdfSize,
          totalTextSize,
          totalSize: totalPdfSize + totalTextSize,
          totalPdfSizeMB: (totalPdfSize / (1024 * 1024)).toFixed(2),
          totalTextSizeMB: (totalTextSize / (1024 * 1024)).toFixed(2),
          totalSizeMB: ((totalPdfSize + totalTextSize) / (1024 * 1024)).toFixed(2)
        }
      };
    } catch (error) {
      console.error('Get storage usage error:', error);
      return { success: false, error: error.message };
    }
  }
};
