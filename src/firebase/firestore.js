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
  limit,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const NOTES_COLLECTION = 'notes';
const USERS_COLLECTION = 'users';

export const firestoreService = {
  // Add a new note
  async addNote(userId, noteData) {
    try {
      const noteRef = collection(db, USERS_COLLECTION, userId, NOTES_COLLECTION);
      
      // Check for duplicates by querying existing notes with same metadata
      const q = query(
        noteRef,
        where('grade', '==', noteData.grade),
        where('subject', '==', noteData.subject),
        where('unit', '==', noteData.unit),
        where('title', '==', noteData.title)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('A note with this title already exists for this grade, subject, and unit.');
      }

      const noteWithTimestamp = {
        ...noteData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        keywords: this.extractKeywords(noteData.content || '')
      };

      const docRef = await addDoc(noteRef, noteWithTimestamp);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all notes for a user
  async getAllNotes(userId) {
    try {
      const notesRef = collection(db, USERS_COLLECTION, userId, NOTES_COLLECTION);
      const q = query(notesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, notes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get a single note by ID
  async getNoteById(userId, noteId) {
    try {
      const noteRef = doc(db, USERS_COLLECTION, userId, NOTES_COLLECTION, noteId);
      const docSnap = await getDoc(noteRef);
      
      if (docSnap.exists()) {
        return { success: true, note: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Note not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update a note
  async updateNote(userId, noteId, updateData) {
    try {
      const noteRef = doc(db, USERS_COLLECTION, userId, NOTES_COLLECTION, noteId);
      const noteWithTimestamp = {
        ...updateData,
        updatedAt: serverTimestamp(),
        keywords: this.extractKeywords(updateData.content || '')
      };
      
      await updateDoc(noteRef, noteWithTimestamp);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete a note
  async deleteNote(userId, noteId) {
    try {
      const noteRef = doc(db, USERS_COLLECTION, userId, NOTES_COLLECTION, noteId);
      await deleteDoc(noteRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search notes with filters
  async searchNotes(userId, filters = {}) {
    try {
      let constraints = [];
      const notesRef = collection(db, USERS_COLLECTION, userId, NOTES_COLLECTION);

      // Add filter constraints
      if (filters.grade && filters.grade !== 'all') {
        constraints.push(where('grade', '==', filters.grade));
      }

      if (filters.subject && filters.subject !== 'all') {
        constraints.push(where('subject', '==', filters.subject));
      }

      if (filters.unit && filters.unit !== 'all') {
        constraints.push(where('unit', '==', filters.unit));
      }

      // Always order by creation date
      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(notesRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      let notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });

      // Client-side filtering for keywords (since Firestore doesn't support array-contains-any efficiently)
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
  },

  // Get statistics
  async getStats(userId) {
    try {
      const notesRef = collection(db, USERS_COLLECTION, userId, NOTES_COLLECTION);
      const querySnapshot = await getDocs(notesRef);
      
      const totalNotes = querySnapshot.size;
      const gradeStats = {};
      
      querySnapshot.forEach((doc) => {
        const note = doc.data();
        gradeStats[note.grade] = (gradeStats[note.grade] || 0) + 1;
      });

      return { success: true, stats: { totalNotes, gradeStats } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Real-time listener for notes
  onNotesChange(userId, callback) {
    const notesRef = collection(db, USERS_COLLECTION, userId, NOTES_COLLECTION);
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const notes = [];
      snapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });
      callback(notes);
    }, (error) => {
      console.error('Error listening to notes:', error);
    });
  },

  // Extract keywords from content
  extractKeywords(content) {
    if (!content) return [];
    
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could'].includes(word));
    
    return [...new Set(words)].slice(0, 20);
  },

  // Enable offline persistence (call this once during app initialization)
  async enableOfflinePersistence() {
    try {
      const { enableIndexedDbPersistence } = await import('firebase/firestore');
      await enableIndexedDbPersistence(db);
      console.log('Offline persistence enabled');
    } catch (error) {
      if (error.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (error.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      }
    }
  }
};

export default firestoreService;
