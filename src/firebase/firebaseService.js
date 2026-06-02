import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

const NOTES_COLLECTION = 'notes';

export class FirebaseNoteService {
  // Add a new note
  static async addNote(noteData, userId) {
    try {
      // Check for duplicates
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId),
        where('grade', '==', noteData.grade),
        where('subject', '==', noteData.subject),
        where('unit', '==', noteData.unit),
        where('title', '==', noteData.title)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        throw new Error('A note with this title already exists for this grade, subject, and unit.');
      }

      const note = {
        ...noteData,
        userId,
        keywords: this.extractKeywords(noteData.content || ''),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, NOTES_COLLECTION), note);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all notes for a user
  static async getAllNotes(userId) {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, notes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Real-time listener for notes
  static subscribeToNotes(userId, callback) {
    const q = query(
      collection(db, NOTES_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notes);
    }, (error) => {
      console.error('Error listening to notes:', error);
    });
  }

  // Search notes with filters
  static async searchNotes(userId, filters = {}) {
    try {
      let constraints = [where('userId', '==', userId)];
      
      if (filters.grade && filters.grade !== 'all') {
        constraints.push(where('grade', '==', filters.grade));
      }
      
      if (filters.subject && filters.subject !== 'all') {
        constraints.push(where('subject', '==', filters.subject));
      }
      
      if (filters.unit && filters.unit !== 'all') {
        constraints.push(where('unit', '==', filters.unit));
      }

      const q = query(
        collection(db, NOTES_COLLECTION),
        ...constraints,
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      let notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Client-side keyword filtering
      if (filters.keywords && filters.keywords.trim()) {
        const searchTerm = filters.keywords.toLowerCase();
        notes = notes.filter(note => 
          note.content?.toLowerCase().includes(searchTerm) ||
          note.title?.toLowerCase().includes(searchTerm) ||
          note.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
        );
      }

      return { success: true, notes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get note by ID
  static async getNoteById(noteId) {
    try {
      const docRef = doc(db, NOTES_COLLECTION, noteId);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        return { success: false, error: 'Note not found' };
      }

      return { 
        success: true, 
        note: { id: snapshot.id, ...snapshot.data() } 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update note
  static async updateNote(noteId, updateData) {
    try {
      const docRef = doc(db, NOTES_COLLECTION, noteId);
      await updateDoc(docRef, {
        ...updateData,
        keywords: this.extractKeywords(updateData.content || ''),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete note
  static async deleteNote(noteId) {
    try {
      const docRef = doc(db, NOTES_COLLECTION, noteId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get statistics
  static async getStats(userId) {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const notes = snapshot.docs.map(doc => doc.data());
      
      const totalNotes = notes.length;
      const gradeStats = {};
      
      notes.forEach(note => {
        gradeStats[note.grade] = (gradeStats[note.grade] || 0) + 1;
      });

      return { success: true, stats: { totalNotes, gradeStats } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Extract keywords from content
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
}

export default FirebaseNoteService;
