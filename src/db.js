import { firestoreService } from './firebase/firestore';
import { useAuth } from './firebase/AuthProvider';

// Firebase-based NoteService
export class NoteService {
  static async addNote(noteData) {
    const { getCurrentUser } = useAuth();
    const user = getCurrentUser();
    
    if (!user) {
      return { success: false, error: 'User must be authenticated' };
    }

    return await firestoreService.addNote(user.uid, noteData);
  }

  static async getAllNotes() {
    const { getCurrentUser } = useAuth();
    const user = getCurrentUser();
    
    if (!user) {
      return { success: false, error: 'User must be authenticated' };
    }

    return await firestoreService.getAllNotes(user.uid);
  }

  static async searchNotes(filters = {}) {
    const { getCurrentUser } = useAuth();
    const user = getCurrentUser();
    
    if (!user) {
      return { success: false, error: 'User must be authenticated' };
    }

    return await firestoreService.searchNotes(user.uid, filters);
  }

  static async getNoteById(id) {
    const { getCurrentUser } = useAuth();
    const user = getCurrentUser();
    
    if (!user) {
      return { success: false, error: 'User must be authenticated' };
    }

    return await firestoreService.getNoteById(user.uid, id);
  }

  static async deleteNote(id) {
    const { getCurrentUser } = useAuth();
    const user = getCurrentUser();
    
    if (!user) {
      return { success: false, error: 'User must be authenticated' };
    }

    return await firestoreService.deleteNote(user.uid, id);
  }

  static async updateNote(id, updateData) {
    const { getCurrentUser } = useAuth();
    const user = getCurrentUser();
    
    if (!user) {
      return { success: false, error: 'User must be authenticated' };
    }

    return await firestoreService.updateNote(user.uid, id, updateData);
  }

  static extractKeywords(content) {
    return firestoreService.extractKeywords(content);
  }

  static async getStats() {
    const { getCurrentUser } = useAuth();
    const user = getCurrentUser();
    
    if (!user) {
      return { success: false, error: 'User must be authenticated' };
    }

    return await firestoreService.getStats(user.uid);
  }

  // Real-time listener for notes
  static onNotesChange(userId, callback) {
    return firestoreService.onNotesChange(userId, callback);
  }
}

export default NoteService;
