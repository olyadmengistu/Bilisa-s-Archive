import React, { useState } from 'react';
import { Save, Upload, FileText, X, AlertCircle, Eye } from 'lucide-react';
import { NoteService } from '../db';

const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const SUBJECTS = ['Chemistry', 'Physics', 'Biology', 'Mathematics', 'English'];
const UNITS = Array.from({ length: 11 }, (_, i) => `Unit ${i + 1}`);

export default function NoteForm({ onNoteAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    grade: '',
    subject: '',
    unit: '',
    content: '',
    pdfFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('PDF file size must be less than 10MB.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        pdfFile: file,
        content: '' // Clear text content when PDF is selected
      }));
      setError('');
    }
  };

  const removePdf = () => {
    setFormData(prev => ({
      ...prev,
      pdfFile: null
    }));
  };

  const viewPdf = () => {
    if (!formData.pdfFile) return;
    
    const fileURL = URL.createObjectURL(formData.pdfFile);
    const newWindow = window.open(fileURL, '_blank');
    
    // Clean up the object URL when the window is closed
    if (newWindow) {
      newWindow.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(fileURL);
      });
    }
  };

  const readPdfAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Please enter a title for your note.');
      }
      if (!formData.grade) {
        throw new Error('Please select a grade.');
      }
      if (!formData.subject) {
        throw new Error('Please select a subject.');
      }
      if (!formData.unit) {
        throw new Error('Please select a unit.');
      }
      if (!formData.content.trim() && !formData.pdfFile) {
        throw new Error('Please add text content or upload a PDF file.');
      }

      let pdfData = null;
      if (formData.pdfFile) {
        pdfData = await readPdfAsBase64(formData.pdfFile);
      }

      const noteData = {
        title: formData.title.trim(),
        grade: formData.grade,
        subject: formData.subject,
        unit: formData.unit,
        content: formData.content.trim(),
        pdfData: pdfData,
        pdfName: formData.pdfFile ? formData.pdfFile.name : null
      };
      
      // Add timeout to prevent endless loading (10 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Save operation timed out after 10 seconds')), 10000);
      });
      
      const result = await Promise.race([
        NoteService.addNote(noteData),
        timeoutPromise
      ]);

      if (result.success) {
        setSuccess('Note saved successfully!');
        setFormData({
          title: '',
          grade: '',
          subject: '',
          unit: '',
          content: '',
          pdfFile: null
        });
        
        // Real-time listener will automatically update notes, no need for callback
        onNoteAdded();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Add New Note</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Organize your study materials by grade, subject, and unit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Chemical Bonding Notes"
              required
            />
          </div>

          {/* Grade, Subject, Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                required
              >
                <option value="">Select Grade</option>
                {GRADES.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                required
              >
                <option value="">Select Subject</option>
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                required
              >
                <option value="">Select Unit</option>
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Type
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, pdfFile: null }))}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  !formData.pdfFile
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <FileText className="w-4 h-4" />
                Text Note
              </button>
              
              <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.pdfFile
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                <Upload className="w-4 h-4" />
                PDF File
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Text Content */}
          {!formData.pdfFile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Note Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Paste your study notes here..."
                required
              />
            </div>
          )}

          {/* PDF Upload */}
          {formData.pdfFile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                PDF File
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{formData.pdfFile.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={viewPdf}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="View PDF"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={removePdf}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Remove PDF"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error and Success Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
              <p className="text-green-700 dark:text-green-300">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Note
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
