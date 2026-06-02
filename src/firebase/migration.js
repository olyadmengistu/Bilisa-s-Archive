import Dexie from 'dexie';
import { FirebaseNoteService } from './firebaseService';

const localDb = new Dexie('BilisaArchive');
localDb.version(1).stores({
  notes: '++id, grade, subject, unit, content, pdfData, timestamp, title, keywords'
});

export class DataMigration {
  static async migrateToFirebase(userId) {
    try {
      console.log('Starting migration from IndexedDB to Firebase...');
      
      // Get all notes from IndexedDB
      const localNotes = await localDb.notes.toArray();
      console.log(`Found ${localNotes.length} notes in IndexedDB`);
      
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const note of localNotes) {
        try {
          // Remove the auto-incremented id and timestamp
          const { id, timestamp, ...noteData } = note;
          
          // Add to Firebase
          const result = await FirebaseNoteService.addNote(noteData, userId);
          
          if (result.success) {
            successCount++;
            console.log(`Migrated note: ${note.title}`);
          } else {
            errorCount++;
            errors.push({ title: note.title, error: result.error });
            console.error(`Failed to migrate note: ${note.title}`, result.error);
          }
        } catch (error) {
          errorCount++;
          errors.push({ title: note.title, error: error.message });
          console.error(`Error migrating note: ${note.title}`, error);
        }
      }

      console.log(`Migration complete: ${successCount} successful, ${errorCount} failed`);
      
      return {
        success: true,
        total: localNotes.length,
        successCount,
        errorCount,
        errors
      };
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getLocalNotesCount() {
    try {
      const count = await localDb.notes.count();
      return { success: true, count };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async clearLocalData() {
    try {
      await localDb.notes.clear();
      console.log('Local IndexedDB cleared');
      return { success: true };
    } catch (error) {
      console.error('Failed to clear local data:', error);
      return { success: false, error: error.message };
    }
  }
}

export default DataMigration;
