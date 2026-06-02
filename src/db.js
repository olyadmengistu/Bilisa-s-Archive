import Dexie from 'dexie';

const db = new Dexie('BilisaArchive');

db.version(1).stores({
  notes: '++id, grade, subject, unit, content, pdfData, timestamp, title, keywords'
});

export class NoteService {
  static async addNote(noteData) {
    try {
      // Check for duplicates
      const existingNotes = await db.notes
        .where({ 
          grade: noteData.grade, 
          subject: noteData.subject, 
          unit: noteData.unit,
          title: noteData.title 
        })
        .toArray();

      if (existingNotes.length > 0) {
        throw new Error('A note with this title already exists for this grade, subject, and unit.');
      }

      const note = {
        ...noteData,
        timestamp: new Date().toISOString(),
        keywords: this.extractKeywords(noteData.content || '')
      };

      const id = await db.notes.add(note);
      return { success: true, id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getAllNotes() {
    try {
      const notes = await db.notes.orderBy('timestamp').reverse().toArray();
      return { success: true, notes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async searchNotes(filters = {}) {
    try {
      let query = db.notes.toCollection();

      if (filters.grade && filters.grade !== 'all') {
        query = query.filter(note => note.grade === filters.grade);
      }

      if (filters.subject && filters.subject !== 'all') {
        query = query.filter(note => note.subject === filters.subject);
      }

      if (filters.unit && filters.unit !== 'all') {
        query = query.filter(note => note.unit === filters.unit);
      }

      if (filters.keywords && filters.keywords.trim()) {
        const searchTerm = filters.keywords.toLowerCase();
        query = query.filter(note => 
          note.content?.toLowerCase().includes(searchTerm) ||
          note.title?.toLowerCase().includes(searchTerm) ||
          note.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
        );
      }

      const notes = await query.toArray();
      return { success: true, notes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getNoteById(id) {
    try {
      const note = await db.notes.get(parseInt(id));
      return { success: true, note };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteNote(id) {
    try {
      await db.notes.delete(parseInt(id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateNote(id, updateData) {
    try {
      await db.notes.update(parseInt(id), {
        ...updateData,
        timestamp: new Date().toISOString(),
        keywords: this.extractKeywords(updateData.content || '')
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static extractKeywords(content) {
    if (!content) return [];
    
    // Extract meaningful keywords (words longer than 3 characters)
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could'].includes(word));
    
    // Remove duplicates and limit to 20 keywords
    return [...new Set(words)].slice(0, 20);
  }

  static async getStats() {
    try {
      const totalNotes = await db.notes.count();
      const notesByGrade = await db.notes.toArray();
      const gradeStats = {};
      
      notesByGrade.forEach(note => {
        gradeStats[note.grade] = (gradeStats[note.grade] || 0) + 1;
      });

      return { success: true, stats: { totalNotes, gradeStats } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default db;
