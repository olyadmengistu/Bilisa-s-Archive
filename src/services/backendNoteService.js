import { notesApi } from '../api';

export class BackendNoteService {
  static async addNote(userId, noteData) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      const result = await notesApi.createNote(noteData);
      return result;
    } catch (error) {
      console.error('Error adding note:', error);
      return { success: false, error: error.message };
    }
  }

  static async getAllNotes(userId, filters = {}) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      const result = await notesApi.getAllNotes(filters);
      return result;
    } catch (error) {
      console.error('Error getting notes:', error);
      return { success: false, error: error.message };
    }
  }

  static async searchNotes(userId, filters = {}) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      const result = await notesApi.getAllNotes(filters);
      return result;
    } catch (error) {
      console.error('Error searching notes:', error);
      return { success: false, error: error.message };
    }
  }

  static async getNoteById(userId, id) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      const result = await notesApi.getNoteById(id);
      return result;
    } catch (error) {
      console.error('Error getting note:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteNote(userId, id) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      const result = await notesApi.deleteNote(id);
      return result;
    } catch (error) {
      console.error('Error deleting note:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateNote(userId, id, updateData) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      const result = await notesApi.updateNote(id, updateData);
      return result;
    } catch (error) {
      console.error('Error updating note:', error);
      return { success: false, error: error.message };
    }
  }

  static extractKeywords(content) {
    if (!content) return [];
    
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could'].includes(word));
    
    return [...new Set(words)].slice(0, 20);
  }

  static async getStats(userId) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      const { statsApi } = await import('../api');
      const result = await statsApi.getUserStats();
      return result;
    } catch (error) {
      console.error('Error getting stats:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time listener for notes (using polling for now, can be upgraded to WebSocket)
  static onNotesChange(userId, callback) {
    if (!userId) {
      console.error('Cannot set up listener: User not authenticated');
      return () => {};
    }

    // Poll for changes every 5 seconds
    const interval = setInterval(async () => {
      try {
        const result = await this.getAllNotes(userId);
        if (result.success) {
          callback(result.notes);
        }
      } catch (error) {
        console.error('Error polling for notes:', error);
      }
    }, 5000);

    // Initial fetch
    this.getAllNotes(userId).then(result => {
      if (result.success) {
        callback(result.notes);
      }
    });

    // Return cleanup function
    return () => clearInterval(interval);
  }
}

export default BackendNoteService;
