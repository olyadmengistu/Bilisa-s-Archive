import { notesAPI } from './lib/api';

// NoteService for API-based app with permanent storage
export class NoteService {
  static async addNote(noteData) {
    // Add keywords to note data
    const noteWithKeywords = {
      ...noteData,
      keywords: this.extractKeywords(noteData.content || '')
    };
    
    const result = await notesAPI.createNote(noteWithKeywords);
    return result;
  }

  static async getAllNotes() {
    return await notesAPI.getAllNotes();
  }

  static async searchNotes(filters = {}) {
    return await notesAPI.searchNotes(filters);
  }

  static async getNoteById(id) {
    return await notesAPI.getNoteById(id);
  }

  static async deleteNote(id) {
    return await notesAPI.deleteNote(id);
  }

  static async updateNote(id, updateData) {
    const updateWithKeywords = {
      ...updateData,
      keywords: this.extractKeywords(updateData.content || '')
    };
    
    return await notesAPI.updateNote(id, updateWithKeywords);
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

  static async getStats() {
    return await notesAPI.getStats();
  }

  // Polling-based listener for notes (since we don't have real-time with API)
  static onNotesChange(callback) {
    // Initial fetch
    notesAPI.getAllNotes().then(result => {
      if (result.success) {
        callback(result.notes);
      }
    });
    
    // Set up polling every 5 seconds
    const intervalId = setInterval(async () => {
      const result = await notesAPI.getAllNotes();
      if (result.success) {
        callback(result.notes);
      }
    }, 5000);
    
    // Return cleanup function
    return () => clearInterval(intervalId);
  }
}

export default NoteService;
