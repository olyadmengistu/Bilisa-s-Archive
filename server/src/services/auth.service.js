import bcrypt from 'bcryptjs';
import pool from '../database/config.js';
import { generateToken } from '../middleware/auth.js';

export const authService = {
  async register(email, password, displayName) {
    try {
      // Check if user already exists
      const userExists = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (userExists.rows.length > 0) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert new user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, display_name) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, display_name, created_at`,
        [email, passwordHash, displayName || email.split('@')[0]]
      );

      const user = result.rows[0];
      const token = generateToken(user);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          createdAt: user.created_at
        },
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  async login(email, password) {
    try {
      // Find user by email
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [email]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );

      const token = generateToken(user);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          avatarUrl: user.avatar_url,
          preferences: user.preferences,
          createdAt: user.created_at
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserById(userId) {
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
        user: {
          id: result.rows[0].id,
          email: result.rows[0].email,
          displayName: result.rows[0].display_name,
          avatarUrl: result.rows[0].avatar_url,
          preferences: result.rows[0].preferences,
          createdAt: result.rows[0].created_at,
          lastLogin: result.rows[0].last_login
        }
      };
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateUserPreferences(userId, preferences) {
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

  async updateUserProfile(userId, updates) {
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
        user: {
          id: result.rows[0].id,
          email: result.rows[0].email,
          displayName: result.rows[0].display_name,
          avatarUrl: result.rows[0].avatar_url
        }
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }
};
