import React, { useState, useEffect } from 'react';

const MathRenderer = ({ text, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load KaTeX dynamically
    const loadKaTeX = async () => {
      try {
        // Load KaTeX CSS
        const katexCSS = document.createElement('link');
        katexCSS.rel = 'stylesheet';
        katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
        document.head.appendChild(katexCSS);

        // Load KaTeX JS
        const katexJS = document.createElement('script');
        katexJS.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
        katexJS.onload = () => {
          setIsLoaded(true);
        };
        document.head.appendChild(katexJS);
      } catch (error) {
        console.error('Failed to load KaTeX:', error);
        setIsLoaded(false);
      }
    };

    loadKaTeX();
  }, []);

  const renderMathExpression = (expr) => {
    if (!isLoaded || !window.katex) {
      return `<span class="math-loading" style="font-family: 'Times New Roman', serif; font-style: italic; color: #2563eb;">${expr}</span>`;
    }

    try {
      // Clean up the expression
      let cleanExpr = expr;
      
      // Handle different math delimiters
      if (cleanExpr.startsWith('$$') && cleanExpr.endsWith('$$')) {
        cleanExpr = cleanExpr.slice(2, -2); // Display math
      } else if (cleanExpr.startsWith('\\[') && cleanExpr.endsWith('\\]')) {
        cleanExpr = cleanExpr.slice(2, -2); // Display math
      } else if (cleanExpr.startsWith('\\(') && cleanExpr.endsWith('\\)')) {
        cleanExpr = cleanExpr.slice(2, -2); // Inline math
      } else if (cleanExpr.startsWith('$') && cleanExpr.endsWith('$')) {
        cleanExpr = cleanExpr.slice(1, -1); // Inline math
      }

      // Handle special LaTeX commands from your examples
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

      const isDisplayMode = expr.startsWith('$$') || expr.startsWith('\\[') || expr.includes('\\begin{equation');
      
      return window.katex.renderToString(cleanExpr, {
        displayMode: isDisplayMode,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: false
      });
    } catch (e) {
      return `<span class="math-error" style="color: #cc0000; font-family: 'Times New Roman', serif; font-style: italic;">${expr}</span>`;
    }
  };

  const processText = (content) => {
    if (!content) return '';

    // Pattern to match various LaTeX math expressions
    const mathPattern = /(\$\$[^$]*\$\$|\\begin\{equation\*?\}.*?\\end\{equation\*?\}|\\\[.*?\\\]|\\\(.*?\\\)|\$(?!\$)[^\$\n]*?\$)/gs;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mathPattern.exec(content)) !== null) {
      // Add text before math
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add math expression
      parts.push({
        type: 'math',
        content: match[0]
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.map(part => {
      if (part.type === 'math') {
        return renderMathExpression(part.content);
      } else {
        // Escape HTML in text portions and preserve formatting
        return part.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br>');
      }
    }).join('');
  };

  if (!text) return null;

  return (
    <div 
      className={`math-renderer ${className}`}
      style={{
        fontFamily: "'Times New Roman', serif",
        lineHeight: '1.6'
      }}
      dangerouslySetInnerHTML={{
        __html: processText(text)
      }}
    />
  );
};

export default MathRenderer;
