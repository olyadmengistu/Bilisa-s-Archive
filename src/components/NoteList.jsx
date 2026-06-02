import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Eye, Download, FileText, Calendar, BookOpen, ChevronDown } from 'lucide-react';
import { NoteService } from '../db';
import { FirebaseNoteService } from '../firebase/firebaseService';
import FullScreenNoteViewer from './FullScreenNoteViewer';
import MathRenderer from './MathRenderer';

// Comprehensive text cleaning function to remove markdown and special characters
const cleanText = (text) => {
  if (!text) return '';
  
  return text
    // Remove headers (###, ##, #)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers (**, __, *, _)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove strikethrough (~~)
    .replace(/~~(.*?)~~/g, '$1')
    // Remove code blocks (``` and `)
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
    .replace(/`(.*?)`/g, '$1')
    // Remove horizontal rules (---, ***, ___)
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove list markers (*, -, +, 1., 2., etc.)
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquote markers (>)
    .replace(/^>\s+/gm, '')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images ![alt](url) -> alt
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove extra asterisks and special characters
    .replace(/\*/g, '')
    // Remove extra whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .trim();
};

const GRADES = ['all', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const SUBJECTS = ['all', 'Chemistry', 'Physics', 'Biology', 'Mathematics', 'English'];
const UNITS = ['all', ...Array.from({ length: 11 }, (_, i) => `Unit ${i + 1}`)];

export default function NoteList({ notes, onNoteDeleted, loading, userId, useFirebase }) {
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [filters, setFilters] = useState({
    grade: 'all',
    subject: 'all',
    unit: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    applyFilters();
  }, [notes, filters]);

  const applyFilters = () => {
    let filtered = [...notes];

    if (filters.grade !== 'all') {
      filtered = filtered.filter(note => note.grade === filters.grade);
    }

    if (filters.subject !== 'all') {
      filtered = filtered.filter(note => note.subject === filters.subject);
    }

    if (filters.unit !== 'all') {
      filtered = filtered.filter(note => note.unit === filters.unit);
    }

    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(note =>
        note.title?.toLowerCase().includes(searchTerm) ||
        cleanText(note.content)?.toLowerCase().includes(searchTerm) ||
        note.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredNotes(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      grade: 'all',
      subject: 'all',
      unit: 'all',
      search: ''
    });
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    let result;
    if (useFirebase && userId) {
      result = await FirebaseNoteService.deleteNote(id);
    } else {
      result = await NoteService.deleteNote(id);
    }
    
    if (result.success) {
      onNoteDeleted();
    }
    
    setDeletingId(null);
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Notes</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredNotes.length} of {notes.length} notes
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {(filters.grade !== 'all' || filters.subject !== 'all' || filters.unit !== 'all' || filters.search) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search notes by title, content, or keywords..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {notes.length === 0 
                  ? 'Start adding your first study note to build your archive.'
                  : 'Try adjusting your filters or search terms.'
                }
              </p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div key={note.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
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
                      {note.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
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
                      <div className="text-gray-700 dark:text-gray-300 line-clamp-3">
                        <MathRenderer text={note.content} />
                      </div>
                    )}
                    
                    {note.keywords && note.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {note.keywords.slice(0, 5).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                        {note.keywords.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                            +{note.keywords.length - 5}
                          </span>
                        )}
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
                    
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={deletingId === note.id}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete note"
                    >
                      {deletingId === note.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Full Screen Note Viewer */}
      {selectedNote && (
        <FullScreenNoteViewer 
          note={selectedNote} 
          onClose={() => setSelectedNote(null)} 
        />
      )}
    </div>
  );
}
