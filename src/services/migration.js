import Dexie from 'dexie';
import { firestoreService } from '../firebase/firestore';
import { authService } from '../firebase/auth';

// Migration script to move data from Dexie (IndexedDB) to Firebase Firestore
export class DataMigration {
  static async migrateFromDexieToFirebase() {
    try {
      console.log('Starting migration from Dexie to Firebase...');

      // Check if user is authenticated
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to migrate data');
      }

      console.log(`Authenticated as: ${user.email}`);

      // Initialize Dexie database
      const db = new Dexie('BilisaArchive');
      db.version(1).stores({
        notes: '++id, grade, subject, unit, content, pdfData, timestamp, title, keywords'
      });

      // Get all notes from Dexie
      const dexieNotes = await db.notes.toArray();
      console.log(`Found ${dexieNotes.length} notes in Dexie`);

      if (dexieNotes.length === 0) {
        console.log('No notes to migrate');
        return { success: true, migrated: 0, message: 'No notes to migrate' };
      }

      let migratedCount = 0;
      let failedCount = 0;
      const errors = [];

      // Migrate each note to Firebase
      for (const note of dexieNotes) {
        try {
          // Prepare note data for Firebase
          const noteData = {
            title: note.title,
            content: note.content,
            grade: note.grade,
            subject: note.subject,
            unit: note.unit,
            pdfData: note.pdfData || null,
            keywords: note.keywords || [],
            createdAt: note.timestamp ? new Date(note.timestamp) : new Date(),
            updatedAt: new Date()
          };

          // Add note to Firebase
          const result = await firestoreService.addNote(user.uid, noteData);
          
          if (result.success) {
            migratedCount++;
            console.log(`Migrated note: ${note.title}`);
          } else {
            failedCount++;
            errors.push({ note: note.title, error: result.error });
            console.error(`Failed to migrate note: ${note.title}`, result.error);
          }
        } catch (error) {
          failedCount++;
          errors.push({ note: note.title, error: error.message });
          console.error(`Error migrating note: ${note.title}`, error);
        }
      }

      console.log(`Migration complete: ${migratedCount} succeeded, ${failedCount} failed`);

      return {
        success: true,
        migrated: migratedCount,
        failed: failedCount,
        errors,
        message: `Migration complete: ${migratedCount} notes migrated successfully`
      };

    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        error: error.message,
        message: `Migration failed: ${error.message}`
      };
    }
  }

  // Check if migration is needed
  static async checkMigrationNeeded() {
    try {
      const db = new Dexie('BilisaArchive');
      db.version(1).stores({
        notes: '++id, grade, subject, unit, content, pdfData, timestamp, title, keywords'
      });

      const dexieCount = await db.notes.count();
      
      const user = authService.getCurrentUser();
      if (!user) {
        return { needsMigration: false, reason: 'User not authenticated' };
      }

      const firebaseResult = await firestoreService.getAllNotes(user.uid);
      const firebaseCount = firebaseResult.success ? firebaseResult.notes.length : 0;

      console.log(`Dexie notes: ${dexieCount}, Firebase notes: ${firebaseCount}`);

      return {
        needsMigration: dexieCount > 0 && dexieCount > firebaseCount,
        dexieCount,
        firebaseCount,
        reason: dexieCount > firebaseCount ? 'More notes in Dexie than Firebase' : 'No migration needed'
      };

    } catch (error) {
      console.error('Error checking migration status:', error);
      return { needsMigration: false, reason: error.message };
    }
  }

  // Clear Dexie data after successful migration (optional)
  static async clearDexieData() {
    try {
      const db = new Dexie('BilisaArchive');
      db.version(1).stores({
        notes: '++id, grade, subject, unit, content, pdfData, timestamp, title, keywords'
      });

      await db.notes.clear();
      console.log('Dexie data cleared successfully');
      return { success: true, message: 'Dexie data cleared' };
    } catch (error) {
      console.error('Error clearing Dexie data:', error);
      return { success: false, error: error.message };
    }
  }
}

export default DataMigration;
