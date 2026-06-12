import pool from '../database/config.js';

export const userService = {
  async getProfile(userId) {
    try {
      const result = await pool.query(
        `SELECT id, email, display_name, avatar_url, preferences, created_at, last_login 
         FROM users WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        user: result.rows[0]
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateProfile(userId, updates) {
    try {
      const allowedUpdates = ['display_name', 'avatar_url'];
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

      if (updateFields.length === 0) {
        return { success: false, error: 'No valid fields to update' };
      }

      updateValues.push(userId);

      const query = `
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount} 
        RETURNING id, email, display_name, avatar_url
      `;

      const result = await pool.query(query, updateValues);

      return {
        success: true,
        user: result.rows[0]
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },

  async updatePreferences(userId, preferences) {
    try {
      const result = await pool.query(
        'UPDATE users SET preferences = $1 WHERE id = $2 RETURNING preferences',
        [JSON.stringify(preferences), userId]
      );

      return {
        success: true,
        preferences: result.rows[0].preferences
      };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, error: error.message };
    }
  },

  async getPreferences(userId) {
    try {
      const result = await pool.query(
        'SELECT preferences FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        preferences: result.rows[0].preferences
      };
    } catch (error) {
      console.error('Get preferences error:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteAccount(userId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Delete user activities
      await client.query('DELETE FROM user_activities WHERE user_id = $1', [userId]);

      // Delete study sessions
      await client.query('DELETE FROM study_sessions WHERE user_id = $1', [userId]);

      // Delete notes (will cascade due to foreign key)
      await client.query('DELETE FROM notes WHERE user_id = $1', [userId]);

      // Delete user
      await client.query('DELETE FROM users WHERE id = $1', [userId]);

      await client.query('COMMIT');

      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Delete account error:', error);
      return { success: false, error: error.message };
    } finally {
      client.release();
    }
  }
};
