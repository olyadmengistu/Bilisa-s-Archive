import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Calendar, Eye, Download, FileText, X } from 'lucide-react';
import { NoteService } from '../db';
import { FirebaseNoteService } from '../firebase/firebaseService';

const GRADES = ['all', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const SUBJECTS = ['all', 'Chemistry', 'Physics', 'Biology', 'Mathematics', 'English'];
const UNITS = ['all', ...Array.from({ length: 11 }, (_, i) => `Unit ${i + 1}`)];

export default function SearchView({ userId, useFirebase }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    grade: 'all',
    subject: 'all',
    unit: 'all'
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    
    const searchFilters = {
      ...filters,
      keywords: searchQuery
    };
    
    let result;
    if (useFirebase && userId) {
      result = await FirebaseNoteService.searchNotes(userId, searchFilters);
    } else {
      result = await NoteService.searchNotes(searchFilters);
    }
    
    if (result.success) {
      setSearchResults(result.notes);
    }
    
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      grade: 'all',
      subject: 'all',
      unit: 'all'
    });
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const downloadPdf = (note) => {
    if (!note.pdfData) return;
    
    const link = document.createElement('a');
    link.href = note.pdfData;
    link.download = note.pdfName || 'note.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (grade) => {
    const colors = {
      'Grade 9': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Grade 10': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Grade 11': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Grade 12': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Chemistry': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Physics': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'Biology': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Mathematics': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'English': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search Notes</h2>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by keywords, title, or content..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-lg"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.grade}
              onChange={(e) => handleFilterChange('grade', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              {GRADES.map(grade => (
                <option key={grade} value={grade}>
                  {grade === 'all' ? 'All Grades' : grade}
                </option>
              ))}
            </select>

            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>

            <select
              value={filters.unit}
              onChange={(e) => handleFilterChange('unit', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit}>
                  {unit === 'all' ? 'All Units' : unit}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
              
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Clear filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="p-6">
          {!hasSearched ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Start Searching Your Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter keywords above and use filters to find specific notes quickly.
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Notes Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Found {searchResults.length} note{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="space-y-4">
                {searchResults.map(note => (
                  <div
                    key={note.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(note.grade)}`}>
                            {note.grade}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(note.subject)}`}>
                            {note.subject}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {note.unit}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {highlightText(note.title, searchQuery)}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(note.timestamp)}
                          </div>
                          {note.pdfData && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              PDF
                            </div>
                          )}
                        </div>
                        
                        {note.content && (
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                            {highlightText(note.content, searchQuery)}
                          </p>
                        )}
                        
                        {note.keywords && note.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.keywords
                              .filter(keyword => 
                                keyword.toLowerCase().includes(searchQuery.toLowerCase())
                              )
                              .slice(0, 3)
                              .map((keyword, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs rounded"
                                >
                                  {highlightText(keyword, searchQuery)}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 lg:ml-4">
                        <button
                          onClick={() => setSelectedNote(note)}
                          className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg transition-colors"
                          title="View note"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        {note.pdfData && (
                          <button
                            onClick={() => downloadPdf(note)}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-hidden w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {highlightText(selectedNote.title, searchQuery)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(selectedNote.grade)}`}>
                      {selectedNote.grade}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(selectedNote.subject)}`}>
                      {selectedNote.subject}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {selectedNote.unit}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Created: {formatDate(selectedNote.timestamp)}
              </div>
              
              {selectedNote.content ? (
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                    {highlightText(selectedNote.content, searchQuery)}
                  </pre>
                </div>
              ) : selectedNote.pdfData ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    This note contains a PDF file: {selectedNote.pdfName}
                  </p>
                  <button
                    onClick={() => downloadPdf(selectedNote)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No content available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
