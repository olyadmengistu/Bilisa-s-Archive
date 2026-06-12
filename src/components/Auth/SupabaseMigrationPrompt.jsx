import React, { useState, useEffect } from 'react';
import { Database, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { FirebaseToSupabaseMigration } from '../../services/supabaseMigration';

export default function SupabaseMigrationPrompt() {
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    const status = await FirebaseToSupabaseMigration.checkMigrationNeeded();
    setMigrationStatus(status);
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    const result = await FirebaseToSupabaseMigration.migrateFromFirebaseToSupabase();
    setMigrationResult(result);
    setIsMigrating(false);
    
    // Refresh status after migration
    if (result.success) {
      setTimeout(checkMigrationStatus, 1000);
    }
  };

  if (!migrationStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!migrationStatus.needsMigration) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">
              No migration needed
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Your data is already in Supabase
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <Database className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Migrate Data to Supabase
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            We found {migrationStatus.firebaseCount} notes in Firebase that can be migrated to Supabase. 
            Supabase will provide better cross-browser synchronization and reliability.
          </p>
          
          {migrationResult ? (
            <div className={`rounded-lg p-4 mb-4 ${
              migrationResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {migrationResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <span className={`font-medium ${
                  migrationResult.success 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {migrationResult.message}
                </span>
              </div>
              {migrationResult.errors && migrationResult.errors.length > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  <p className="font-medium">Failed to migrate {migrationResult.errors.length} notes:</p>
                  <ul className="list-disc list-inside mt-1">
                    {migrationResult.errors.map((error, idx) => (
                      <li key={idx}>{error.note}: {error.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleMigration}
              disabled={isMigrating}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isMigrating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Migrating...
                </>
              ) : (
                <>
                  Start Migration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
