import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, Sun, 
  Type, 
  Palette, 
  User, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Info, 
  HelpCircle,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';

function Settings({ darkMode, toggleDarkMode }) {
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [activeSection, setActiveSection] = useState('appearance');

  useEffect(() => {
    // Load saved settings from localStorage
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';
    const savedShowPreview = localStorage.getItem('showPreview') !== 'false';
    const savedAutoSave = localStorage.getItem('autoSave') !== 'false';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    
    setFontSize(savedFontSize);
    setCompactMode(savedCompactMode);
    setShowPreview(savedShowPreview);
    setAutoSave(savedAutoSave);
    setNotifications(savedNotifications);
  }, []);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px';
  };

  const handleCompactModeToggle = () => {
    const newValue = !compactMode;
    setCompactMode(newValue);
    localStorage.setItem('compactMode', newValue);
    document.documentElement.classList.toggle('compact-mode', newValue);
  };

  const handleShowPreviewToggle = () => {
    const newValue = !showPreview;
    setShowPreview(newValue);
    localStorage.setItem('showPreview', newValue);
  };

  const handleAutoSaveToggle = () => {
    const newValue = !autoSave;
    setAutoSave(newValue);
    localStorage.setItem('autoSave', newValue);
  };

  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notifications', newValue);
  };

  const handleExportData = async () => {
    try {
      // Get all notes from IndexedDB
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const data = {
        notes,
        settings: {
          fontSize,
          compactMode,
          showPreview,
          autoSave,
          notifications,
          darkMode
        },
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bilisa-archive-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      try {
        const file = e.target.files[0];
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.notes) {
          localStorage.setItem('notes', JSON.stringify(data.notes));
        }
        
        if (data.settings) {
          Object.entries(data.settings).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
          // Reload to apply settings
          window.location.reload();
        }
        
        alert('Data imported successfully!');
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import data. Please check the file format.');
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      if (confirm('This will delete all your notes and settings. Continue?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const sections = [
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'display', icon: Type, label: 'Display' },
    { id: 'account', icon: User, label: 'Account' },
    { id: 'data', icon: Database, label: 'Data Management' },
    { id: 'about', icon: Info, label: 'About' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="feature-icon gradient-primary">
          <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold logo-bilisa">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                      activeSection === section.id
                        ? 'gradient-primary text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            
            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
                
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {darkMode ? (
                      <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Dark Mode</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors duration-300 ${
                      darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        darkMode ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Font Size */}
                <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Type className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Font Size</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Adjust the base font size</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleFontSizeChange(size)}
                        className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                          fontSize === size
                            ? 'gradient-primary text-white shadow-lg'
                            : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Mode */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Compact Mode</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Reduce spacing for more content</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCompactModeToggle}
                    className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors duration-300 ${
                      compactMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        compactMode ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Display Section */}
            {activeSection === 'display' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Display</h2>
                
                {/* Show Preview */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {showPreview ? (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Show Note Preview</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Display preview text in note list</p>
                    </div>
                  </div>
                  <button
                    onClick={handleShowPreviewToggle}
                    className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors duration-300 ${
                      showPreview ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        showPreview ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Save */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Save className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Auto Save</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Automatically save notes while editing</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAutoSaveToggle}
                    className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors duration-300 ${
                      autoSave ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        autoSave ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Notifications</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Show notifications for important events</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNotificationsToggle}
                    className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors duration-300 ${
                      notifications ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        notifications ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Account Section */}
            {activeSection === 'account' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Account</h2>
                
                <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                      B
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg truncate">
                        Bilisa
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        Local User
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Account Type</span>
                      <span className="font-medium text-gray-900 dark:text-white">Local</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Storage Used</span>
                      <span className="font-medium text-gray-900 dark:text-white">Local Storage</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Last Sync</span>
                      <span className="font-medium text-gray-900 dark:text-white">Real-time</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">Privacy & Security</p>
                      <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Your data is stored locally in your browser. No information is sent to external servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management Section */}
            {activeSection === 'data' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Data Management</h2>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Export */}
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium text-green-900 dark:text-green-100 text-sm sm:text-base">Export Data</p>
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">Download all notes and settings as JSON</p>
                    </div>
                  </button>

                  {/* Import */}
                  <button
                    onClick={handleImportData}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">Import Data</p>
                      <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Restore notes and settings from backup</p>
                    </div>
                  </button>

                  {/* Clear Data */}
                  <button
                    onClick={handleClearData}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium text-red-900 dark:text-red-100 text-sm sm:text-base">Clear All Data</p>
                      <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">Permanently delete all notes and settings</p>
                    </div>
                  </button>
                </div>

                <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100 text-sm sm:text-base">Backup Recommendation</p>
                      <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Regularly export your data to prevent accidental loss. Store backups in a safe location.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                
                <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="feature-icon gradient-primary">
                        <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold logo-bilisa">Bilisa Archive</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Version 1.0.0</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">Developer</span>
                      <span className="font-medium text-gray-900 dark:text-white">Bilisa</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">Release Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">June 2026</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">Technology</span>
                      <span className="font-medium text-gray-900 dark:text-white">React + Firebase</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">License</span>
                      <span className="font-medium text-gray-900 dark:text-white">Personal Use</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="text-indigo-900 dark:text-indigo-100 text-xs sm:text-sm italic">
                    "This is Bilisa, on June 2, 2026. This private study tool is my personal space for storing notes and preparing for my Grade 12 entrance exam. It is designed solely for me, ensuring my learning journey stays organized, private, and accessible for years to come. I can do all things through Christ who strengthens me."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">5</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Subjects</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-xl sm:text-2xl font-bold text-bilisa-600 dark:text-bilisa-400">4</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Grade Levels</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
