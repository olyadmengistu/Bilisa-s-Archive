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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16 animate-fadeInDown">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="feature-icon gradient-primary animate-float">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold logo-bilisa animate-scaleIn">
                  Bilisa Notes
                </h1>
                <div className="feature-icon gradient-secondary animate-float" style={{animationDelay: '0.5s'}}>
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              
              <div className="gradient-hero text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl animate-glow max-w-4xl mx-auto">
                <p className="text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 font-semibold animate-fadeInUp">
                  Bilisa, your future success starts here. Every note you save brings you closer to scoring high in Grade 12.
                </p>
                <p className="text-sm sm:text-base lg:text-lg opacity-90 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  Build your personal academic archive - secure, synchronized, and accessible anywhere.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 lg:mb-16">
              <div className="modern-card p-6 sm:p-8 card-hover hover-lift animate-slideInLeft">
                <div className="feature-icon gradient-primary mb-4 animate-pulse-slow">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-slate-900 dark:text-white">Total Notes</h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600 dark:text-indigo-400 animate-scaleIn">{stats.totalNotes}</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">Knowledge stored</p>
              </div>
              
              <div className="modern-card p-6 sm:p-8 card-hover hover-lift animate-fadeInUp">
                <div className="feature-icon gradient-secondary mb-4 animate-pulse-slow" style={{animationDelay: '0.3s'}}>
                  <Target className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-slate-900 dark:text-white">Subjects</h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-600 dark:text-cyan-400 animate-scaleIn" style={{animationDelay: '0.2s'}}>5</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">Academic areas</p>
              </div>
              
              <div className="modern-card p-6 sm:p-8 card-hover hover-lift animate-slideInRight sm:col-span-2 lg:col-span-1">
                <div className="feature-icon gradient-success mb-4 animate-pulse-slow" style={{animationDelay: '0.6s'}}>
                  <Award className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-slate-900 dark:text-white">Grades</h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 dark:text-emerald-400 animate-scaleIn" style={{animationDelay: '0.4s'}}>4</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">Grade levels</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <button
                onClick={() => setCurrentView('add')}
                className="btn-animated gradient-primary text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover-lift text-sm sm:text-base lg:text-lg shadow-md w-full sm:w-auto"
              >
                <div className="feature-icon" style={{width: '36px', height: '36px', fontSize: '14px'}}>
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                Add New Note
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </button>
              
              <button
                onClick={() => setCurrentView('notes')}
                className="btn-animated gradient-secondary text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover-lift text-sm sm:text-base lg:text-lg shadow-md w-full sm:w-auto"
              >
                <div className="feature-icon" style={{width: '36px', height: '36px', fontSize: '14px'}}>
                  <Archive className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                View All Notes
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </button>
              
              <button
                onClick={() => setCurrentView('search')}
                className="btn-animated gradient-success text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover-lift text-sm sm:text-base lg:text-lg shadow-md w-full sm:w-auto"
              >
                <div className="feature-icon" style={{width: '36px', height: '36px', fontSize: '14px'}}>
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                Search Notes
                <Target className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      {isAuthenticated && (
        <header className="glass shadow-sm border-b border-slate-200 dark:border-slate-700 animate-fadeInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <div className="feature-icon gradient-primary" style={{width: '32px', height: '32px', fontSize: '14px'}}>
                  <Brain className="w-4 h-4" />
                </div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold logo-bilisa">Bilisa Archive</h1>
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              </div>
              <nav className="hidden md:flex gap-1">
                <button
                  onClick={() => setCurrentView('home')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift ${
                    currentView === 'home'
                      ? 'gradient-primary text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Home
                </button>
                <button
                  onClick={() => setCurrentView('add')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift ${
                    currentView === 'add'
                      ? 'gradient-primary text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Note
                </button>
                <button
                  onClick={() => setCurrentView('notes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift ${
                    currentView === 'notes'
                      ? 'gradient-primary text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Archive className="w-4 h-4 inline mr-2" />
                  My Notes
                </button>
                <button
                  onClick={() => setCurrentView('search')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift ${
                    currentView === 'search'
                      ? 'gradient-primary text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Search
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={handleSignOut}
                  className="feature-icon hover-lift p-2"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={toggleDarkMode}
                className="feature-icon hover-lift p-2"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      )}

      {/* Mobile Navigation */}
      {isAuthenticated && (
        <div className="md:hidden glass border-b border-slate-200 dark:border-slate-700 animate-fadeInDown">
        <div className="flex justify-around py-3">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center p-3 rounded-xl text-xs transition-all duration-200 hover-lift ${
              currentView === 'home'
                ? 'gradient-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            Home
          </button>
          <button
            onClick={() => setCurrentView('add')}
            className={`flex flex-col items-center p-3 rounded-xl text-xs transition-all duration-200 hover-lift ${
              currentView === 'add'
                ? 'gradient-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Plus className="w-5 h-5 mb-1" />
            Add
          </button>
          <button
            onClick={() => setCurrentView('notes')}
            className={`flex flex-col items-center p-3 rounded-xl text-xs transition-all duration-200 hover-lift ${
              currentView === 'notes'
                ? 'gradient-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Archive className="w-5 h-5 mb-1" />
            Notes
          </button>
          <button
            onClick={() => setCurrentView('search')}
            className={`flex flex-col items-center p-3 rounded-xl text-xs transition-all duration-200 hover-lift ${
              currentView === 'search'
                ? 'gradient-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Search className="w-5 h-5 mb-1" />
            Search
          </button>
        </div>
      </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
