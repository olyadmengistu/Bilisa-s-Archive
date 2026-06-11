import React, { useState, useEffect } from 'react';
import { Search, Plus, Moon, Sun, BookOpen, Home, Archive, Settings, Sparkles, Brain, Target, Zap, Award, LogOut } from 'lucide-react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import SearchView from './components/SearchView';
import PasswordForm from './components/Auth/PasswordForm';
import { NoteService } from './db';
import { useSimpleAuth } from './auth/SimpleAuthProvider';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalNotes: 0, gradeStats: {} });
  
  const { isAuthenticated, loading: authLoading, signOut } = useSimpleAuth();

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    // Load initial notes only when user is authenticated
    if (isAuthenticated) {
      loadNotes();
      loadStats();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const loadNotes = async () => {
    setLoading(true);
    const result = await NoteService.getAllNotes();
    if (result.success) {
      setNotes(result.notes);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await NoteService.getStats();
    if (result.success) {
      setStats(result.stats);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('home');
    setNotes([]);
    setStats({ totalNotes: 0, gradeStats: {} });
  };

  const handleNoteAdded = () => {
    loadNotes();
    loadStats();
    setCurrentView('notes');
  };

  const handleNoteDeleted = () => {
    loadNotes();
    loadStats();
  };

  const renderContent = () => {
    // Show authentication screen if user is not authenticated
    if (!isAuthenticated) {
      return <PasswordForm />;
    }

    switch (currentView) {
      case 'home':
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12 animate-fadeInDown">
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="feature-icon gradient-primary animate-float">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold logo-bilisa animate-scaleIn">
                  Bilisa Notes
                </h1>
                <div className="feature-icon gradient-bilisa animate-float" style={{animationDelay: '0.5s'}}>
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              
              <div className="gradient-warm text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl animate-glow max-w-4xl mx-auto">
                <p className="text-base sm:text-lg lg:text-2xl mb-2 sm:mb-4 font-semibold animate-fadeInUp">
                  Bilisa, your future success starts here. Every note you save brings you closer to scoring high in Grade 12.
                </p>
                <p className="text-sm sm:text-base lg:text-lg opacity-90 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  Build your personal academic archive - secure, synchronized, and accessible anywhere.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 dark:border-gray-700 card-hover hover-lift animate-slideInLeft">
                <div className="feature-icon gradient-primary mb-3 sm:mb-4 animate-pulse-slow">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">Total Notes</h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 animate-scaleIn">{stats.totalNotes}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Knowledge stored</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 dark:border-gray-700 card-hover hover-lift animate-fadeInUp">
                <div className="feature-icon gradient-bilisa mb-3 sm:mb-4 animate-pulse-slow" style={{animationDelay: '0.3s'}}>
                  <Target className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">Subjects</h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-bilisa-600 dark:text-bilisa-400 animate-scaleIn" style={{animationDelay: '0.2s'}}>5</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Academic areas</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 dark:border-gray-700 card-hover hover-lift animate-slideInRight sm:col-span-2 lg:col-span-1">
                <div className="feature-icon gradient-success mb-3 sm:mb-4 animate-pulse-slow" style={{animationDelay: '0.6s'}}>
                  <Award className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">Grades</h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 animate-scaleIn" style={{animationDelay: '0.4s'}}>4</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Grade levels</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <button
                onClick={() => setCurrentView('add')}
                className="btn-animated gradient-primary text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 sm:gap-3 hover-lift text-sm sm:text-base lg:text-lg shadow-lg w-full sm:w-auto"
              >
                <div className="feature-icon" style={{width: '32px', height: '32px', fontSize: '14px'}}>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                Add New Note
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </button>
              
              <button
                onClick={() => setCurrentView('notes')}
                className="btn-animated gradient-bilisa text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 sm:gap-3 hover-lift text-sm sm:text-base lg:text-lg shadow-lg w-full sm:w-auto"
              >
                <div className="feature-icon" style={{width: '32px', height: '32px', fontSize: '14px'}}>
                  <Archive className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                View All Notes
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </button>
              
              <button
                onClick={() => setCurrentView('search')}
                className="btn-animated gradient-success text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 sm:gap-3 hover-lift text-sm sm:text-base lg:text-lg shadow-lg w-full sm:w-auto"
              >
                <div className="feature-icon" style={{width: '32px', height: '32px', fontSize: '14px'}}>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                Search Notes
                <Target className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </button>
            </div>
          </div>
        );

      case 'add':
        return <NoteForm onNoteAdded={handleNoteAdded} />;

      case 'notes':
        return <NoteList notes={notes} onNoteDeleted={handleNoteDeleted} loading={loading} />;

      case 'search':
        return <SearchView />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      {isAuthenticated && (
        <header className="glass shadow-lg border-b border-gray-200 dark:border-gray-700 animate-fadeInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="feature-icon gradient-primary" style={{width: '28px', height: '28px', fontSize: '12px'}}>
                  <Brain className="w-4 h-4" />
                </div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold logo-bilisa">Bilisa Archive</h1>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 animate-pulse" />
              </div>
              <nav className="hidden md:flex gap-1 sm:gap-2">
                <button
                  onClick={() => setCurrentView('home')}
                  className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover-lift ${
                    currentView === 'home'
                      ? 'gradient-primary text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Home className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Home
                </button>
                <button
                  onClick={() => setCurrentView('add')}
                  className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover-lift ${
                    currentView === 'add'
                      ? 'gradient-primary text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Add Note
                </button>
                <button
                  onClick={() => setCurrentView('notes')}
                  className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover-lift ${
                    currentView === 'notes'
                      ? 'gradient-primary text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Archive className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  My Notes
                </button>
                <button
                  onClick={() => setCurrentView('search')}
                  className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover-lift ${
                    currentView === 'search'
                      ? 'gradient-primary text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Search
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              {isAuthenticated && (
                <button
                  onClick={handleSignOut}
                  className="feature-icon hover-lift animate-pulse-slow p-1 sm:p-2"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <button
                onClick={toggleDarkMode}
                className="feature-icon hover-lift animate-pulse-slow p-1 sm:p-2"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      )}

      {/* Mobile Navigation */}
      {isAuthenticated && (
        <div className="md:hidden glass border-b border-gray-200 dark:border-gray-700 animate-fadeInDown">
        <div className="flex justify-around py-2 sm:py-3">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center p-2 sm:p-3 rounded-xl text-xs transition-all duration-300 hover-lift ${
              currentView === 'home'
                ? 'gradient-primary text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
            Home
          </button>
          <button
            onClick={() => setCurrentView('add')}
            className={`flex flex-col items-center p-2 sm:p-3 rounded-xl text-xs transition-all duration-300 hover-lift ${
              currentView === 'add'
                ? 'gradient-primary text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
            Add
          </button>
          <button
            onClick={() => setCurrentView('notes')}
            className={`flex flex-col items-center p-2 sm:p-3 rounded-xl text-xs transition-all duration-300 hover-lift ${
              currentView === 'notes'
                ? 'gradient-primary text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Archive className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
            Notes
          </button>
          <button
            onClick={() => setCurrentView('search')}
            className={`flex flex-col items-center p-2 sm:p-3 rounded-xl text-xs transition-all duration-300 hover-lift ${
              currentView === 'search'
                ? 'gradient-primary text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
            Search
          </button>
        </div>
      </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
