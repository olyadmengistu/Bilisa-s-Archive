# Bilisa Archive - Offline Note-Taking Application

A fully offline, local-first note-taking application designed for students to organize their study materials by grade, subject, and unit.

## Features

### Core Functionality
- **100% Offline**: Works completely without internet connection
- **Permanent Storage**: All notes saved locally using IndexedDB
- **Step-by-Step Organization**: Grade (9-12) -> Subject -> Unit -> Content
- **Search System**: Filter by grade, subject, unit, and keywords
- **Dark Mode**: Eye-friendly dark theme toggle
- **Responsive Design**: Works on mobile and desktop

### Note Types
- **Text Notes**: Paste and save text content
- **PDF Upload**: Store PDF files locally (up to 10MB)
- **Smart Keywords**: Automatic keyword extraction for search

### Data Organization
- **Grades**: Grade 9, Grade 10, Grade 11, Grade 12
- **Subjects**: Chemistry, Physics, Biology, Mathematics, English
- **Units**: Unit 1 through Unit 11
- **Duplicate Prevention**: No duplicate notes allowed

## Technical Details

### Technology Stack
- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS with custom themes
- **Icons**: Lucide React
- **Storage**: IndexedDB via Dexie.js
- **Build Tool**: Vite

### Data Persistence
- All notes stored in browser's IndexedDB
- Data persists across browser sessions
- No external dependencies or cloud services
- PDF files stored as base64 strings

### Security & Privacy
- 100% local storage
- No data transmitted to external servers
- Complete privacy and data ownership
- Works offline after initial load

## Installation & Usage

### Prerequisites
- Node.js 16+ 
- Modern web browser with IndexedDB support

### Setup
1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

### Production Build
```bash
npm run build
```
The built files will be in the `dist` folder and can be served by any web server.

## Application Structure

### Main Components
- **App.jsx**: Main application with navigation and dark mode
- **NoteForm.jsx**: Form for adding new notes with grade/subject/unit selection
- **NoteList.jsx**: Display all notes with filtering and management
- **SearchView.jsx**: Advanced search with highlighting
- **db.js**: IndexedDB service for data operations

### Key Features

#### Adding Notes
1. Click "Add New Note" or navigate to Add Note section
2. Enter a descriptive title
3. Select Grade (9-12)
4. Select Subject (Chemistry, Physics, Biology, Mathematics, English)
5. Select Unit (1-11)
6. Choose content type:
   - Text: Paste your study notes
   - PDF: Upload a PDF file (max 10MB)
7. Click "Save Note"

#### Searching Notes
1. Navigate to Search section
2. Enter keywords in the search bar
3. Use filters to narrow down by grade, subject, or unit
4. Results show highlighted matches
5. Click on any note to view full content

#### Managing Notes
- View all notes in the "My Notes" section
- Filter by grade, subject, unit
- Search within notes
- Delete unwanted notes
- Download PDF files

## Design Features

### User Experience
- Clean, modern interface with smooth transitions
- Color-coded grades and subjects for easy identification
- Motivational landing message for students
- Mobile-responsive navigation
- Eye-friendly dark mode option

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- High contrast colors in dark mode
- Clear visual hierarchy

## Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Required Features
- IndexedDB support
- ES6+ JavaScript
- CSS Grid and Flexbox
- LocalStorage for preferences

## Data Management

### Storage Limits
- IndexedDB typically allows 50MB-250MB per origin
- PDF files limited to 10MB each
- No limit on number of text notes
- Automatic keyword extraction for search optimization

### Backup & Export
- Notes can be exported individually (PDF download)
- For full backup, browser's IndexedDB can be exported
- Data persists until manually deleted

## Troubleshooting

### Common Issues
- **Storage Full**: Clear old notes or check browser storage limits
- **PDF Upload Fails**: Ensure file is under 10MB and is a valid PDF
- **Search Not Working**: Check IndexedDB permissions and browser support
- **Dark Mode Not Saving**: Ensure LocalStorage is enabled in browser

### Performance Tips
- Keep PDF files under 5MB for better performance
- Regularly clean up old notes to maintain speed
- Use specific search terms for faster results

## Future Enhancements

### Planned Features
- Export all notes as JSON backup
- Import notes from backup
- Note categories and tags
- Study session timer
- Progress tracking dashboard

### Technical Improvements
- Service Worker for true offline PWA
- WebAssembly for PDF processing
- IndexedDB compression
- Real-time sync across tabs

## License

This project is created for educational purposes and personal use.

---

**Bilisa Archive - Your personal academic companion for offline studying.**
