import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, Eye, EyeOff, Moon, Sun, Type, Palette, Download, Settings, Monitor, BookOpen, FileText, Save, RotateCcw } from 'lucide-react';
import MathRenderer from './MathRenderer';

const TEXT_STYLES = {
  classic: {
    name: 'Classic',
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#1f2937'
  },
  modern: {
    name: 'Modern',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#374151'
  },
  readable: {
    name: 'Readable',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '20px',
    lineHeight: '1.8',
    color: '#1f2937'
  },
  elegant: {
    name: 'Elegant',
    fontFamily: 'Merriweather, serif',
    fontSize: '19px',
    lineHeight: '1.7',
    color: '#2d3748'
  },
  focus: {
    name: 'Focus',
    fontFamily: 'SF Mono, Monaco, monospace',
    fontSize: '17px',
    lineHeight: '1.6',
    color: '#2d3748'
  }
};

const EYE_PROTECTION_MODES = {
  normal: {
    name: 'Normal',
    background: '#ffffff',
    filter: 'none'
  },
  warm: {
    name: 'Warm Light',
    background: '#faf8f3',
    filter: 'sepia(0.2)'
  },
  night: {
    name: 'Night Mode',
    background: '#1a1a1a',
    filter: 'invert(1) hue-rotate(180deg)'
  },
  blueLight: {
    name: 'Blue Light Filter',
    background: '#f5f3ff',
    filter: 'sepia(0.1) hue-rotate(10deg)'
  },
  sepia: {
    name: 'Sepia',
    background: '#f4ecd8',
    filter: 'sepia(0.4)'
  }
};

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

export default function FullScreenNoteViewer({ note, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textStyle, setTextStyle] = useState('classic');
  const [eyeProtectionMode, setEyeProtectionMode] = useState('normal');
  const [showControls, setShowControls] = useState(true);
  const [fontSize, setFontSize] = useState(100);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [showSettings, setShowSettings] = useState(false);
  const contentRef = useRef(null);
  const viewerRef = useRef(null);
  
  // Eye comfort settings from screenshots
  const [brightness, setBrightness] = useState(100);
  const [blueFilterIntensity, setBlueFilterIntensity] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Sans-serif');
  const [fontSizeDropdown, setFontSizeDropdown] = useState('Medium');
  const [lineSpacing, setLineSpacing] = useState('1.6');
  const [letterSpacing, setLetterSpacing] = useState('Normal');
  const [wordSpacing, setWordSpacing] = useState('Normal');
  const [maxColumnWidth, setMaxColumnWidth] = useState('Medium');
  const [margins, setMargins] = useState('Medium');
  const [readingRuler, setReadingRuler] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [autoHideControls, setAutoHideControls] = useState(false);
  const [invertColors, setInvertColors] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [savedPosition, setSavedPosition] = useState(null);
  
  // Options for dropdowns
  const FONT_FAMILY_OPTIONS = ['Sans-serif', 'Serif', 'Monospace', 'Georgia', 'Arial', 'Times New Roman'];
  const FONT_SIZE_OPTIONS = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];
  const SPACING_OPTIONS = ['Tight', 'Normal', 'Relaxed', 'Extra-Relaxed'];
  const WIDTH_OPTIONS = ['Small', 'Medium', 'Large', 'Full'];
  const MARGIN_OPTIONS = ['Small', 'Medium', 'Large', 'Extra-Large'];
  
  // Auto-hide controls timer
  useEffect(() => {
    if (autoHideControls && showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoHideControls, showControls]);

  // Auto-save settings when they change
  useEffect(() => {
    const settings = {
      brightness, blueFilterIntensity, contrast, backgroundColor, textColor,
      fontFamily, fontSizeDropdown, lineSpacing, letterSpacing, wordSpacing,
      maxColumnWidth, margins, readingRuler, focusMode, autoHideControls,
      invertColors, grayscale, textStyle, eyeProtectionMode, fontSize, lineHeight
    };
    localStorage.setItem('noteViewerSettings', JSON.stringify(settings));
  }, [
    brightness, blueFilterIntensity, contrast, backgroundColor, textColor,
    fontFamily, fontSizeDropdown, lineSpacing, letterSpacing, wordSpacing,
    maxColumnWidth, margins, readingRuler, focusMode, autoHideControls,
    invertColors, grayscale, textStyle, eyeProtectionMode, fontSize, lineHeight
  ]);
  
  // Manual save settings (for user-triggered save)
  const saveSettings = () => {
    const settings = {
      brightness, blueFilterIntensity, contrast, backgroundColor, textColor,
      fontFamily, fontSizeDropdown, lineSpacing, letterSpacing, wordSpacing,
      maxColumnWidth, margins, readingRuler, focusMode, autoHideControls,
      invertColors, grayscale, textStyle, eyeProtectionMode, fontSize, lineHeight
    };
    localStorage.setItem('noteViewerSettings', JSON.stringify(settings));
    // Show save confirmation
    alert('Settings saved successfully!');
  };
  
  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('noteViewerSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.brightness !== undefined) setBrightness(settings.brightness);
        if (settings.blueFilterIntensity !== undefined) setBlueFilterIntensity(settings.blueFilterIntensity);
        if (settings.contrast !== undefined) setContrast(settings.contrast);
        if (settings.backgroundColor !== undefined) setBackgroundColor(settings.backgroundColor);
        if (settings.textColor !== undefined) setTextColor(settings.textColor);
        if (settings.fontFamily !== undefined) setFontFamily(settings.fontFamily);
        if (settings.fontSizeDropdown !== undefined) setFontSizeDropdown(settings.fontSizeDropdown);
        if (settings.lineSpacing !== undefined) setLineSpacing(settings.lineSpacing);
        if (settings.letterSpacing !== undefined) setLetterSpacing(settings.letterSpacing);
        if (settings.wordSpacing !== undefined) setWordSpacing(settings.wordSpacing);
        if (settings.maxColumnWidth !== undefined) setMaxColumnWidth(settings.maxColumnWidth);
        if (settings.margins !== undefined) setMargins(settings.margins);
        if (settings.readingRuler !== undefined) setReadingRuler(settings.readingRuler);
        if (settings.focusMode !== undefined) setFocusMode(settings.focusMode);
        if (settings.autoHideControls !== undefined) setAutoHideControls(settings.autoHideControls);
        if (settings.invertColors !== undefined) setInvertColors(settings.invertColors);
        if (settings.grayscale !== undefined) setGrayscale(settings.grayscale);
        if (settings.textStyle !== undefined) setTextStyle(settings.textStyle);
        if (settings.eyeProtectionMode !== undefined) setEyeProtectionMode(settings.eyeProtectionMode);
        if (settings.fontSize !== undefined) setFontSize(settings.fontSize);
        if (settings.lineHeight !== undefined) setLineHeight(settings.lineHeight);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);
  
  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return '0 min';
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };
  
  // Save current scroll position
  const savePosition = () => {
    if (contentRef.current) {
      const position = contentRef.current.scrollTop;
      setSavedPosition(position);
      localStorage.setItem(`notePosition_${note.id}`, position.toString());
    }
  };
  
  // Restore saved scroll position
  const restorePosition = () => {
    const saved = localStorage.getItem(`notePosition_${note.id}`);
    if (saved && contentRef.current) {
      contentRef.current.scrollTop = parseInt(saved);
      setSavedPosition(parseInt(saved));
    }
  };
  
  // Restore position on mount
  useEffect(() => {
    restorePosition();
  }, [note.id]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      }
      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === 'h') {
        setShowControls(!showControls);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, showControls, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const downloadNote = () => {
    const content = note.content || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadNoteAsPdf = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups for this website to download PDF');
      return;
    }

    // Create the content for PDF
    const content = note.content || '';
    
    // Process content with math rendering - pre-render math on main thread
    const processContentWithMath = (content) => {
      if (!content) return '';
      
      // Pattern to match various LaTeX math expressions
      const mathPattern = /(\$\$[^$]*\$\$|\\begin\{equation\*?\}.*?\\end\{equation\*?\}|\\\[.*?\\\]|\\\(.*?\\\)|\$(?!\$)[^\$\n]*?\$)/gs;
      
      let processedContent = content;
      let match;
      let mathCounter = 0;
      
      // Replace math expressions with placeholders
      const mathExpressions = [];
      processedContent = processedContent.replace(mathPattern, (match) => {
        mathExpressions.push(match);
        return `__MATH_PLACEHOLDER_${mathCounter++}__`;
      });
      
      // Clean text portions (but keep math placeholders) - preserve LaTeX characters
      processedContent = processedContent
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/^[-*_]{3,}\s*$/gm, '')
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        .replace(/^>\s+/gm, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        .replace(/<[^>]*>/g, '')
        .replace(/\n\s*\n/g, '\n\n')
        .replace(/^\s+|\s+$/g, '')
        .trim();
      
      // Restore math expressions with pre-rendered KaTeX HTML
      mathExpressions.forEach((expr, index) => {
        let renderedMath = expr;
        
        // Use KaTeX from window if available (already loaded in main app)
        if (window.katex) {
          try {
            let cleanExpr = expr;
            let isDisplay = false;
            
            // Handle different math delimiters
            if (cleanExpr.startsWith('$$') && cleanExpr.endsWith('$$')) {
              cleanExpr = cleanExpr.slice(2, -2);
              isDisplay = true;
            } else if (cleanExpr.startsWith('\\[') && cleanExpr.endsWith('\\]')) {
              cleanExpr = cleanExpr.slice(2, -2);
              isDisplay = true;
            } else if (cleanExpr.startsWith('\\(') && cleanExpr.endsWith('\\)')) {
              cleanExpr = cleanExpr.slice(2, -2);
              isDisplay = false;
            } else if (cleanExpr.startsWith('$') && cleanExpr.endsWith('$')) {
              cleanExpr = cleanExpr.slice(1, -1);
              isDisplay = false;
            }
            
            // Handle special LaTeX commands
            cleanExpr = cleanExpr
              .replace(/\\left\(/g, '(')
              .replace(/\\right\)/g, ')')
              .replace(/\\left\[/g, '[')
              .replace(/\\right\]/g, ']')
              .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '{$1\\over $2}')
              .replace(/°/g, '^\\circ')
              .replace(/\\sin/g, '\\sin')
              .replace(/\\cos/g, '\\cos')
              .replace(/\\sqrt/g, '\\sqrt')
              .replace(/\\pi/g, '\\pi');
            
            renderedMath = window.katex.renderToString(cleanExpr, {
              displayMode: isDisplay,
              throwOnError: false,
              strict: false
            });
            
            if (isDisplay) {
              renderedMath = `<div style="text-align: center; margin: 1em 0;">${renderedMath}</div>`;
            }
          } catch (e) {
            renderedMath = `<span style="color: #cc0000; font-style: italic;">${expr}</span>`;
          }
        } else {
          // Fallback if KaTeX not loaded
          renderedMath = `<span style="color: #cc0000; font-style: italic;">${expr}</span>`;
        }
        
        processedContent = processedContent.replace(
          `__MATH_PLACEHOLDER_${index}__`, 
          renderedMath
        );
      });
      
      return processedContent;
    };
    
    const processedContent = processContentWithMath(content);
    
    // HTML structure for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${note.title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
        <style>
          @page {
            margin: 1in;
            size: A4;
          }
          body {
            font-family: 'Georgia', serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 0;
            word-spacing: 0.05em;
            letter-spacing: 0.01em;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .title {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .metadata {
            font-size: 10pt;
            color: #666;
            margin-bottom: 5px;
          }
          .content {
            text-align: left;
            line-height: 1.4;
            word-wrap: break-word;
          }
          .content p {
            margin-bottom: 0.5em;
          }
          .keywords {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            font-size: 10pt;
            color: #666;
          }
          .katex {
            font-size: 1em;
          }
          .katex-display {
            margin: 1em 0;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${note.title}</div>
          <div class="metadata">Grade: ${note.grade} | Subject: ${note.subject} | Unit: ${note.unit}</div>
          <div class="metadata">Created: ${formatDate(note.timestamp)}</div>
        </div>
        <div class="content" id="content">${processedContent}</div>
        ${note.keywords && note.keywords.length > 0 ? `
          <div class="keywords">
            <strong>Keywords:</strong> ${note.keywords.join(', ')}
          </div>
        ` : ''}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getCurrentStyle = () => TEXT_STYLES[textStyle];
  const getCurrentEyeProtection = () => EYE_PROTECTION_MODES[eyeProtectionMode];

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      ref={viewerRef}
      className="fixed inset-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: backgroundColor,
        filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(${blueFilterIntensity / 100}%) ${invertColors ? 'invert(1)' : ''} ${grayscale ? 'grayscale(1)' : ''}`
      }}
    >
      {/* Controls Header */}
      <div 
        className={`absolute top-0 left-0 right-0 z-10 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <div className="bg-black bg-opacity-50 backdrop-blur-md border-b border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <h1 className="text-white text-base sm:text-xl font-semibold truncate max-w-[200px] sm:max-w-md">
                {note.title}
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm flex-shrink-0">
                <span className="px-1.5 sm:px-2 py-1 bg-blue-600 rounded-full text-xs">
                  {note.grade}
                </span>
                <span className="px-1.5 sm:px-2 py-1 bg-green-600 rounded-full text-xs">
                  {note.subject}
                </span>
                <span className="px-1.5 sm:px-2 py-1 bg-purple-600 rounded-full text-xs">
                  {note.unit}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {note.content && (
                <button
                  onClick={downloadNoteAsPdf}
                  className="p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Download as PDF"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              
              <button
                onClick={downloadNote}
                className="p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Download note"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen (F)"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 sm:top-20 right-2 sm:right-4 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 w-[calc(100%-1rem)] sm:w-96 max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Eye Comfort Settings</h3>
            <button
              onClick={saveSettings}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900 rounded-lg transition-colors"
              title="Save settings"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
          
          {/* Brightness */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brightness: {brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="150"
              value={brightness}
              onChange={(e) => {
                setBrightness(parseInt(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          
          {/* Blue Filter Intensity */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blue filter intensity: {blueFilterIntensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={blueFilterIntensity}
              onChange={(e) => {
                setBlueFilterIntensity(parseInt(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          
          {/* Contrast */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contrast: {contrast}%
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => {
                setContrast(parseInt(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          
          {/* Background Color */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Background color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Text Color */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Font Family */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font family
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              {FONT_FAMILY_OPTIONS.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          
          {/* Font Size Dropdown */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font size
            </label>
            <select
              value={fontSizeDropdown}
              onChange={(e) => setFontSizeDropdown(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              {FONT_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          {/* Line Spacing */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Line spacing
            </label>
            <select
              value={lineSpacing}
              onChange={(e) => setLineSpacing(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              {['1.0', '1.2', '1.4', '1.6', '1.8', '2.0'].map(spacing => (
                <option key={spacing} value={spacing}>{spacing}</option>
              ))}
            </select>
          </div>
          
          {/* Letter Spacing */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Letter spacing
            </label>
            <select
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              {SPACING_OPTIONS.map(spacing => (
                <option key={spacing} value={spacing}>{spacing}</option>
              ))}
            </select>
          </div>
          
          {/* Word Spacing */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Word spacing
            </label>
            <select
              value={wordSpacing}
              onChange={(e) => setWordSpacing(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              {SPACING_OPTIONS.map(spacing => (
                <option key={spacing} value={spacing}>{spacing}</option>
              ))}
            </select>
          </div>
          
          {/* Max Column Width */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max column width
            </label>
            <select
              value={maxColumnWidth}
              onChange={(e) => setMaxColumnWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              {WIDTH_OPTIONS.map(width => (
                <option key={width} value={width}>{width}</option>
              ))}
            </select>
          </div>
          
          {/* Margins (Padding) */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Margins (padding)
            </label>
            <select
              value={margins}
              onChange={(e) => setMargins(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              {MARGIN_OPTIONS.map(margin => (
                <option key={margin} value={margin}>{margin}</option>
              ))}
            </select>
          </div>
          
          {/* Feature Toggles */}
          <div className="mb-4 sm:mb-6 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={readingRuler}
                onChange={(e) => setReadingRuler(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Reading ruler</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={focusMode}
                onChange={(e) => setFocusMode(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Focus mode</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoHideControls}
                onChange={(e) => setAutoHideControls(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Auto-hide controls (full screen)</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={invertColors}
                onChange={(e) => setInvertColors(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Invert colors</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={grayscale}
                onChange={(e) => setGrayscale(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Grayscale</span>
            </label>
          </div>
          
          {/* Reading Time */}
          <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reading time: {calculateReadingTime(cleanText(note.content))}
            </p>
          </div>
          
          {/* Save Position and Restore Buttons */}
          <div className="flex gap-3">
            <button
              onClick={savePosition}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save position
            </button>
            <button
              onClick={restorePosition}
              className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restore
            </button>
          </div>

          {/* Reset Settings Button */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all settings to default?')) {
                setBrightness(100);
                setBlueFilterIntensity(0);
                setContrast(100);
                setBackgroundColor('#ffffff');
                setTextColor('#000000');
                setFontFamily('Sans-serif');
                setFontSizeDropdown('Medium');
                setLineSpacing('1.6');
                setLetterSpacing('Normal');
                setWordSpacing('Normal');
                setMaxColumnWidth('Medium');
                setMargins('Medium');
                setReadingRuler(false);
                setFocusMode(false);
                setAutoHideControls(false);
                setInvertColors(false);
                setGrayscale(false);
                setTextStyle('classic');
                setEyeProtectionMode('normal');
                setFontSize(100);
                setLineHeight(1.6);
                alert('Settings reset to default!');
              }
            }}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Settings
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div 
        ref={contentRef}
        className="h-full overflow-y-auto pt-20 pb-8 px-4 sm:px-8 lg:px-16"
        onClick={() => setShowControls(!showControls)}
        style={{
          transition: 'all 0.3s ease'
        }}
      >
        {/* Reading Ruler */}
        {readingRuler && (
          <div 
            className="fixed left-0 right-0 h-1 bg-yellow-400 pointer-events-none z-30"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)'
            }}
          />
        )}
        
        {/* Focus Mode Overlay */}
        {focusMode && (
          <div 
            className="fixed inset-0 pointer-events-none z-25"
            style={{
              background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 70%)'
            }}
          />
        )}
        
        <div 
          className="max-w-4xl mx-auto transition-all duration-300"
          style={{
            maxWidth: maxColumnWidth === 'Small' ? '600px' : 
                      maxColumnWidth === 'Medium' ? '800px' : 
                      maxColumnWidth === 'Large' ? '1000px' : '100%',
            padding: margins === 'Small' ? '1rem' : 
                     margins === 'Medium' ? '2rem' : 
                     margins === 'Large' ? '3rem' : '4rem'
          }}
        >
          {/* Note Metadata */}
          <div className="mb-8 text-center opacity-75">
            <p className="text-sm" style={{ color: textColor }}>
              Created: {formatDate(note.timestamp)}
            </p>
            {note.keywords && note.keywords.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {note.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs"
                    style={{ color: textColor }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Note Content */}
          <div className="prose prose-lg max-w-none">
            {note.content ? (
              <div
                className="transition-all duration-300"
                style={{
                  fontFamily: fontFamily === 'Sans-serif' ? 'system-ui, sans-serif' :
                             fontFamily === 'Serif' ? 'Georgia, serif' :
                             fontFamily === 'Monospace' ? 'SF Mono, Monaco, monospace' :
                             fontFamily === 'Georgia' ? 'Georgia, serif' :
                             fontFamily === 'Arial' ? 'Arial, sans-serif' :
                             fontFamily === 'Times New Roman' ? 'Times New Roman, serif' :
                             fontFamily,
                  fontSize: fontSizeDropdown === 'Small' ? '14px' :
                           fontSizeDropdown === 'Medium' ? '16px' :
                           fontSizeDropdown === 'Large' ? '18px' :
                           fontSizeDropdown === 'X-Large' ? '20px' : '24px',
                  lineHeight: lineSpacing,
                  letterSpacing: letterSpacing === 'Tight' ? '-0.5px' :
                                 letterSpacing === 'Normal' ? '0px' :
                                 letterSpacing === 'Relaxed' ? '0.5px' : '1px',
                  wordSpacing: wordSpacing === 'Tight' ? '-1px' :
                              wordSpacing === 'Normal' ? '0px' :
                              wordSpacing === 'Relaxed' ? '2px' : '4px',
                  color: textColor,
                  backgroundColor: 'transparent',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  textAlign: 'justify'
                }}
              >
                <MathRenderer text={note.content} />
              </div>
            ) : note.pdfData ? (
              <div className="w-full" style={{ height: '80vh' }}>
                <iframe
                  src={note.pdfData}
                  title={note.pdfName || 'PDF Document'}
                  className="w-full h-full border border-gray-300 dark:border-gray-600 rounded-lg"
                  style={{
                    minHeight: '600px'
                  }}
                />
                <div className="mt-4 text-center">
                  <p className="text-sm mb-3" style={{ color: textColor }}>
                    Viewing: {note.pdfName || 'PDF Document'}
                  </p>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = note.pdfData;
                      link.download = note.pdfName || 'note.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-24 h-24 mx-auto mb-6 opacity-50" style={{ color: textColor }} />
                <p className="text-xl" style={{ color: textColor }}>
                  No content available for this note.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Hint */}
      <div className="absolute bottom-4 left-4 text-white text-xs opacity-50">
        Press 'H' to toggle controls, 'F' for fullscreen, 'Esc' to close
      </div>
    </div>
  );
}
