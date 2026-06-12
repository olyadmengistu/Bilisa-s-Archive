import { supabaseDbService } from './database';

// NoteService for Supabase-based app with real user authentication
export class NoteService {
  static async addNote(userId, noteData) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    console.log('NoteService.addNote called with userId:', userId);
    console.log('NoteService.addNote noteData:', noteData);
    const result = await supabaseDbService.addNote(userId, noteData);
    console.log('NoteService.addNote result:', result);
    return result;
  }

  static async getAllNotes(userId) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await supabaseDbService.getAllNotes(userId);
  }

  static async searchNotes(userId, filters = {}) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await supabaseDbService.searchNotes(userId, filters);
  }

  static async getNoteById(userId, id) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await supabaseDbService.getNoteById(userId, id);
  }

  static async deleteNote(userId, id) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await supabaseDbService.deleteNote(userId, id);
  }

  static async updateNote(userId, id, updateData) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await supabaseDbService.updateNote(userId, id, updateData);
  }

  static extractKeywords(content) {
    return supabaseDbService.extractKeywords(content);
  }

  static async getStats(userId) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await supabaseDbService.getStats(userId);
  }

  // Real-time listener for notes
  static onNotesChange(userId, callback) {
    if (!userId) {
      console.error('Cannot set up listener: User not authenticated');
      return () => {};
    }
    return supabaseDbService.onNotesChange(userId, callback);
  }
}

export default NoteService;
