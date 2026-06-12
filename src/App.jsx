import React, { useState, useEffect } from 'react';
import { Search, Plus, Moon, Sun, BookOpen, Home, Archive, Settings, Sparkles, Brain, Target, Zap, Award, Menu } from 'lucide-react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import SearchView from './components/SearchView';
import SideBar from './components/SideBar';
import SettingsComponent from './components/Settings';
import { NoteService } from './db';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalNotes: 0, gradeStats: {} });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    // Load all notes on mount
    const loadNotes = async () => {
      const allNotes = await NoteService.getAllNotes();
      setNotes(allNotes);
      setLoading(false);
      // Update stats
      const totalNotes = allNotes.length;
      const gradeStats = {};
      allNotes.forEach(note => {
        gradeStats[note.grade] = (gradeStats[note.grade] || 0) + 1;
      });
      setStats({ totalNotes, gradeStats });
    };
    loadNotes();
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNoteAdded = () => {
    setCurrentView('notes');
  };


  const handleNoteDeleted = () => {
    // Real-time listener will automatically update notes
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="relative min-h-screen">
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/v2_watermarked-c61d724a-368d-4f77-bc38-7ab06ebfda59.mp4" type="video/mp4" />
            </video>
            
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
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
          </div>
        );

      case 'add':
        return <NoteForm onNoteAdded={handleNoteAdded} />;

      case 'notes':
        return <NoteList notes={notes} onNoteDeleted={handleNoteDeleted} loading={loading} />;

      case 'search':
        return <SearchView />;

      case 'settings':
        return <SettingsComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Side Bar */}
      <SideBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all duration-300 lg:ml-64">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold logo-bilisa">Bilisa Archive</h1>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;