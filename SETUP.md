# Bilisa Archive - Setup Guide

## Quick Start

### Option 1: Demo Version (No Installation Required)
1. Open `demo.html` in your web browser
2. This is a fully functional demo with all core features
3. Works immediately without any installation

### Option 2: Full React Application
1. Install Node.js (version 16 or higher)
2. Open command prompt/terminal in the project folder
3. Run: `npm install`
4. Run: `npm run dev`
5. Open http://localhost:3000 in your browser

### Option 3: Local Server (Alternative)
1. Double-click `start-server.bat` (Windows)
2. Open http://localhost:8000/demo.html in your browser
3. Press Ctrl+C to stop the server

## Features Included

### Core Functionality
- **100% Offline**: Works completely without internet
- **Permanent Storage**: IndexedDB for local data persistence
- **Grade Organization**: Grade 9-12 selection
- **Subject Categories**: Chemistry, Physics, Biology, Mathematics, English
- **Unit Structure**: Unit 1-11 for each subject
- **Search System**: Real-time search with filtering
- **Dark Mode**: Eye-friendly theme toggle

### Note Management
- **Text Notes**: Paste and save study content
- **PDF Support**: Upload PDF files (stored locally)
- **Duplicate Prevention**: Smart duplicate detection
- **Keyword Extraction**: Automatic search keywords
- **Delete Management**: Safe note deletion

### User Interface
- **Modern Design**: Clean, colorful interface
- **Responsive Layout**: Mobile and desktop friendly
- **Smooth Navigation**: Easy section switching
- **Visual Organization**: Color-coded grades and subjects
- **Motivational Theme**: Student-focused messaging

## File Structure

```
Bilisa Archive/
  demo.html              # Quick demo version
  start-server.bat       # Easy server launcher
  package.json           # React app dependencies
  vite.config.js         # Build configuration
  index.html             # React app entry
  src/
    App.jsx              # Main application component
    main.jsx             # React entry point
    index.css            # Global styles
    db.js                # IndexedDB service
    components/
      NoteForm.jsx       # Add note form
      NoteList.jsx       # Notes display
      SearchView.jsx     # Search interface
  README.md              # Full documentation
  SETUP.md               # This setup guide
```

## Browser Requirements

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Required Features
- IndexedDB support (for storage)
- ES6+ JavaScript
- CSS Grid and Flexbox
- LocalStorage (for preferences)

## Data Storage

### Where Data is Stored
- **IndexedDB**: Browser's built-in database
- **LocalStorage**: User preferences (dark mode)
- **No External Servers**: 100% local storage

### Storage Limits
- Typically 50MB-250MB per browser origin
- PDF files limited to 10MB each
- Unlimited text notes (within storage limits)

### Data Persistence
- Survives browser restarts
- Survives computer restarts
- Remains until manually deleted
- Works completely offline

## Troubleshooting

### Common Issues

**Demo doesn't work:**
- Try a modern browser (Chrome, Firefox, Safari, Edge)
- Enable JavaScript if disabled
- Check browser console for errors

**React app won't start:**
- Ensure Node.js is installed (v16+)
- Run `npm install` first
- Check if port 3000 is available

**Storage issues:**
- Clear browser data if storage is full
- Check browser permissions for IndexedDB
- Try a different browser if needed

**Search not working:**
- Ensure notes have been added first
- Check IndexedDB permissions
- Refresh the page and try again

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy
- Upload the `dist` folder to any web server
- No backend required
- Works offline after first load

### Example Deployment Options
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Security & Privacy

### Data Privacy
- 100% local storage
- No data transmitted externally
- Complete user control
- No tracking or analytics

### Security Features
- No external API calls
- No third-party dependencies in production
- Safe offline operation
- User data never leaves the browser

## Advanced Usage

### Keyboard Shortcuts
- `Enter`: Submit forms
- `Ctrl+K`: Quick search (in full app)
- `Esc`: Close modals

### Search Tips
- Use specific keywords for better results
- Filter by grade/subject/unit first
- Search looks in titles, content, and keywords
- Results are highlighted in search view

### Organization Tips
- Use descriptive titles
- Select correct grade/subject/unit
- Add comprehensive content
- Regularly clean up old notes

## Support

### Getting Help
1. Check this SETUP.md file
2. Review README.md for detailed docs
3. Test with demo.html first
4. Try different browsers if needed

### Feature Requests
The application includes all requested features:
- Offline functionality
- Permanent storage
- Grade/subject/unit organization
- Search and filtering
- Dark mode
- PDF support
- Responsive design

---

**Bilisa Archive is ready to use! Start with demo.html for immediate access.**
