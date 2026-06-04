import { firestoreService } from './firebase/firestore';

// Fixed user ID for single-user password-based app
const SINGLE_USER_ID = 'bilisa-archive-user';

// NoteService for single-user password-based app
export class NoteService {
  static async addNote(noteData) {
    console.log('NoteService.addNote called with userId:', SINGLE_USER_ID);
    console.log('NoteService.addNote noteData:', noteData);
    const result = await firestoreService.addNote(SINGLE_USER_ID, noteData);
    console.log('NoteService.addNote result:', result);
    return result;
  }

  static async getAllNotes() {
    return await firestoreService.getAllNotes(SINGLE_USER_ID);
  }

  static async searchNotes(filters = {}) {
    return await firestoreService.searchNotes(SINGLE_USER_ID, filters);
  }

  static async getNoteById(id) {
    return await firestoreService.getNoteById(SINGLE_USER_ID, id);
  }

  static async deleteNote(id) {
    return await firestoreService.deleteNote(SINGLE_USER_ID, id);
  }

  static async updateNote(id, updateData) {
    return await firestoreService.updateNote(SINGLE_USER_ID, id, updateData);
  }

  static extractKeywords(content) {
    return firestoreService.extractKeywords(content);
  }

  static async getStats() {
    return await firestoreService.getStats(SINGLE_USER_ID);
  }

  // Real-time listener for notes
  static onNotesChange(callback) {
    return firestoreService.onNotesChange(SINGLE_USER_ID, callback);
  }
}

export default NoteService;
