import React, { useState } from 'react';
import { Database, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { DataMigration } from '../../firebase/migration';

function MigrationPrompt({ userId, onComplete, onSkip }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [localCount, setLocalCount] = useState(null);

  React.useEffect(() => {
    checkLocalData();
  }, []);

  const checkLocalData = async () => {
    const countResult = await DataMigration.getLocalNotesCount();
    if (countResult.success) {
      setLocalCount(countResult.count);
    }
  };

  const handleMigrate = async () => {
    setLoading(true);
    const migrationResult = await DataMigration.migrateToFirebase(userId);
    setResult(migrationResult);
    setLoading(false);

    if (migrationResult.success) {
      setTimeout(() => onComplete(migrationResult), 2000);
    }
  };

  if (localCount === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Local Data Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your local storage is empty. You can start fresh with Firebase.
        </p>
        <button
          onClick={onSkip}
          className="gradient-primary text-white px-6 py-3 rounded-lg font-semibold"
        >
          Continue to App
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Migrate Your Notes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We found {localCount} note{localCount !== 1 ? 's' : ''} in your local storage.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Before you migrate
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your notes will be moved from local storage to Firebase cloud storage. 
                This will enable cross-device access and automatic backups. 
                The migration is one-way and cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {result ? (
          <div className="space-y-4">
            {result.success ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Migration Complete!
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-green-800 dark:text-green-200">
                    <strong>Total notes:</strong> {result.total}
                  </p>
                  <p className="text-green-800 dark:text-green-200">
                    <strong>Successfully migrated:</strong> {result.successCount}
                  </p>
                  {result.errorCount > 0 && (
                    <p className="text-green-800 dark:text-green-200">
                      <strong>Failed:</strong> {result.errorCount}
                    </p>
                  )}
                </div>
                {result.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Errors:
                    </p>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      {result.errors.map((error, index) => (
                        <li key={index}>
                          • {error.title}: {error.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  Migration Failed
                </h3>
                <p className="text-red-800 dark:text-red-200">{result.error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleMigrate}
              disabled={loading}
              className="w-full gradient-primary text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Migrating notes...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Migrate to Firebase
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              onClick={onSkip}
              disabled={loading}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip Migration (Start Fresh)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MigrationPrompt;
