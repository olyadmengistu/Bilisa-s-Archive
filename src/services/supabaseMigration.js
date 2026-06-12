import { firestoreService } from '../firebase/firestore';
import { supabaseDbService } from '../supabase/database';

// Fixed user ID for single-user password-based app
const SINGLE_USER_ID = 'bilisa-archive-user';

// Migration script to move data from Firebase Firestore to Supabase
export class FirebaseToSupabaseMigration {
  static async migrateFromFirebaseToSupabase() {
    try {
      console.log('Starting migration from Firebase to Supabase...');
      console.log(`Using single user ID: ${SINGLE_USER_ID}`);

      // Get all notes from Firebase
      const firebaseResult = await firestoreService.getAllNotes(SINGLE_USER_ID);
      
      if (!firebaseResult.success) {
        throw new Error(firebaseResult.error);
      }

      const firebaseNotes = firebaseResult.notes;
      console.log(`Found ${firebaseNotes.length} notes in Firebase`);

      if (firebaseNotes.length === 0) {
        console.log('No notes to migrate');
        return { success: true, migrated: 0, message: 'No notes to migrate' };
      }

      let migratedCount = 0;
      let failedCount = 0;
      const errors = [];

      // Migrate each note to Supabase
      for (const note of firebaseNotes) {
        try {
          // Prepare note data for Supabase
          const noteData = {
            title: note.title,
            content: note.content,
            grade: note.grade,
            subject: note.subject,
            unit: note.unit,
            pdfData: note.pdfData || null,
            keywords: note.keywords || []
          };

          // Add note to Supabase
          const result = await supabaseDbService.addNote(SINGLE_USER_ID, noteData);
          
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
      // Get Firebase notes count
      const firebaseResult = await firestoreService.getAllNotes(SINGLE_USER_ID);
      const firebaseCount = firebaseResult.success ? firebaseResult.notes.length : 0;

      // Get Supabase notes count
      const supabaseResult = await supabaseDbService.getAllNotes(SINGLE_USER_ID);
      const supabaseCount = supabaseResult.success ? supabaseResult.notes.length : 0;

      console.log(`Firebase notes: ${firebaseCount}, Supabase notes: ${supabaseCount}`);

      return {
        needsMigration: firebaseCount > 0 && firebaseCount > supabaseCount,
        firebaseCount,
        supabaseCount,
        reason: firebaseCount > supabaseCount ? 'More notes in Firebase than Supabase' : 'No migration needed'
      };

    } catch (error) {
      console.error('Error checking migration status:', error);
      return { needsMigration: false, reason: error.message };
    }
  }
}

export default FirebaseToSupabaseMigration;
