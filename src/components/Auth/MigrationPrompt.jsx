import React, { useState, useEffect } from 'react';
import { Database, ArrowRight, CheckCircle, AlertCircle, X } from 'lucide-react';
import { DataMigration } from '../../services/migration';

const MigrationPrompt = ({ onDismiss }) => {
  const [migrationStatus, setMigrationStatus] = useState('checking'); // checking, needed, migrating, completed, error
  const [migrationResult, setMigrationResult] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    const result = await DataMigration.checkMigrationNeeded();
    setStats(result);
    
    if (result.needsMigration) {
      setMigrationStatus('needed');
    } else {
      setMigrationStatus('completed');
    }
  };

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    const result = await DataMigration.migrateFromDexieToFirebase();
    setMigrationResult(result);
    
    if (result.success) {
      setMigrationStatus('completed');
    } else {
      setMigrationStatus('error');
    }
  };

  if (migrationStatus === 'checking') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300">Checking for existing notes...</p>
        </div>
      </div>
    );
  }

  if (migrationStatus === 'completed' && !stats?.needsMigration) {
    return null; // Don't show if no migration needed
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Migrate Your Notes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We found {stats?.dexieCount || 0} notes in your local storage. 
            Would you like to migrate them to the cloud for safe, cross-device access?
          </p>
        </div>

        {migrationStatus === 'needed' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-1">Why migrate?</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                    <li>Access notes from any device</li>
                    <li>Automatic cloud backup</li>
                    <li>Never lose your data</li>
                    <li>Real-time synchronization</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleMigration}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Database className="w-5 h-5" />
                Migrate Notes
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onDismiss}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {migrationStatus === 'migrating' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">Migrating your notes to the cloud...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a moment</p>
          </div>
        )}

        {migrationStatus === 'completed' && migrationResult && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p className="font-semibold mb-1">Migration Complete!</p>
                  <p className="text-green-700 dark:text-green-300">
                    Successfully migrated {migrationResult.migrated} notes to the cloud.
                  </p>
                  {migrationResult.failed > 0 && (
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      {migrationResult.failed} notes could not be migrated.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            >
              Continue to App
            </button>
          </div>
        )}

        {migrationStatus === 'error' && migrationResult && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-semibold mb-1">Migration Failed</p>
                  <p className="text-red-700 dark:text-red-300">{migrationResult.error}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleMigration}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
              >
                Try Again
              </button>
              <button
                onClick={onDismiss}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrationPrompt;
