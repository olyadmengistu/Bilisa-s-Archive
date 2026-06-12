import { firestoreService } from './firebase/firestore';

// NoteService for Firebase-based app with real user authentication
export class NoteService {
  static async addNote(userId, noteData) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    console.log('NoteService.addNote called with userId:', userId);
    console.log('NoteService.addNote noteData:', noteData);
    const result = await firestoreService.addNote(userId, noteData);
    console.log('NoteService.addNote result:', result);
    return result;
  }

  static async getAllNotes(userId) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await firestoreService.getAllNotes(userId);
  }

  static async searchNotes(userId, filters = {}) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await firestoreService.searchNotes(userId, filters);
  }

  static async getNoteById(userId, id) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await firestoreService.getNoteById(userId, id);
  }

  static async deleteNote(userId, id) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await firestoreService.deleteNote(userId, id);
  }

  static async updateNote(userId, id, updateData) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await firestoreService.updateNote(userId, id, updateData);
  }

  static extractKeywords(content) {
    return firestoreService.extractKeywords(content);
  }

  static async getStats(userId) {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return await firestoreService.getStats(userId);
  }

  // Real-time listener for notes
  static onNotesChange(userId, callback) {
    if (!userId) {
      console.error('Cannot set up listener: User not authenticated');
      return () => {};
    }
    return firestoreService.onNotesChange(userId, callback);
  }
}

export default NoteService;
