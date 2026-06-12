import React from 'react';
import { Home, Plus, Archive, Search, Moon, Sun, Brain, Sparkles, LogOut } from 'lucide-react';

function SideBar({ currentView, setCurrentView, darkMode, toggleDarkMode, handleSignOut }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'add', icon: Plus, label: 'Add Note' },
    { id: 'notes', icon: Archive, label: 'My Notes' },
    { id: 'search', icon: Search, label: 'Search' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass shadow-lg border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="feature-icon gradient-primary" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
            <Brain className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold logo-bilisa">Bilisa Archive</h1>
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover-lift ${
                currentView === item.id
                  ? 'gradient-primary text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover-lift"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover-lift"
        >
          {darkMode ? (
            <>
              <Sun className="w-5 h-5" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              Dark Mode
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
