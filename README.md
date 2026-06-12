# Bilisa Archive

A cloud-based note-taking application with Vercel Postgres backend, designed for students to organize their study materials by grade, subject, and unit.

## Features

### Core Functionality
- **Cloud Storage**: All notes stored in Vercel Postgres database
- **User Authentication**: Secure email/password authentication
- **Cross-Device Sync**: Access notes from any device
- **Step-by-Step Organization**: Grade (9-12) -> Subject -> Unit -> Content
- **Search System**: Filter by grade, subject, unit, and keywords
- **Dark Mode**: Eye-friendly dark theme toggle
- **Responsive Design**: Works on mobile and desktop

### Note Types
- **Text Notes**: Paste and save text content
- **PDF Upload**: Store PDF files (up to 10MB)
- **Smart Keywords**: Automatic keyword extraction for search

### Data Organization
- **Grades**: Grade 9, Grade 10, Grade 11, Grade 12
- **Subjects**: Chemistry, Physics, Biology, Mathematics, English
- **Units**: Unit 1 through Unit 11
- **Duplicate Prevention**: No duplicate notes allowed

## Technical Details

### Technology Stack
- **Frontend**: React 18 with Vite
- **Backend**: Vercel Postgres
- **API**: Vercel Serverless Functions
- **Styling**: TailwindCSS with custom themes
- **Icons**: Lucide React
- **Build Tool**: Vite

### Data Persistence
- All notes stored in Vercel Postgres database
- User authentication with secure password hashing
- Data persists across sessions and devices
- PDF files stored as base64 strings in database

### Security & Privacy
- Secure password hashing with SHA-256
- User-specific data isolation
- CORS-protected API endpoints
- Environment-based configuration

## Installation & Usage

### Prerequisites
- Node.js 16+
- Vercel account (for deployment)
- Vercel Postgres database

### Setup
1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Vercel Postgres connection string
4. Initialize database:
   ```bash
   # Deploy to Vercel and run the create-table endpoint
   ```
5. Start development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000 in your browser

### Production Build
```bash
npm run build
```
The built files will be in the `dist` folder and can be deployed to Vercel.

## Application Structure

### Main Components
- **App.jsx**: Main application with navigation and dark mode
- **NoteForm.jsx**: Form for adding new notes with grade/subject/unit selection
- **NoteList.jsx**: Display all notes with filtering and management
- **SearchView.jsx**: Advanced search with highlighting
- **AuthProvider.jsx**: Authentication context and provider

### API Structure
- **api/auth/login.js**: User login endpoint
- **api/auth/signup.js**: User registration endpoint
- **api/notes/index.js**: Notes CRUD operations
- **api/create-table.js**: Database schema initialization
- **lib/db.js**: Database utility functions

### Key Features

#### Adding Notes
1. Sign up or log in to your account
2. Click "Add New Note" or navigate to Add Note section
3. Enter a descriptive title
4. Select Grade (9-12)
5. Select Subject (Chemistry, Physics, Biology, Mathematics, English)
6. Select Unit (1-11)
7. Choose content type:
   - Text: Paste your study notes
   - PDF: Upload a PDF file (max 10MB)
8. Click "Save Note"

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

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically

### Database Setup
1. Create Vercel Postgres database
2. Add connection string to environment variables
3. Run the `/api/create-table` endpoint to initialize schema

## Troubleshooting

### Common Issues
- **Database Connection Failed**: Check environment variables and Vercel Postgres configuration
- **PDF Upload Fails**: Ensure file is under 10MB and is a valid PDF
- **Search Not Working**: Check database indexes and API connectivity
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
- Real-time updates with websockets
- PDF compression for storage optimization
- Advanced search with full-text indexing
- Mobile app version

## License

This project is created for educational purposes and personal use.

---

**Bilisa Archive - Your personal academic companion for cloud-based studying.**
