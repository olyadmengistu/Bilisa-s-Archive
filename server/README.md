# Bilisa Archive Backend Server

A powerful, production-ready backend server for the Bilisa Archive note-taking application built with Node.js, Express, PostgreSQL, and WebSocket support.

## Features

### Core Functionality
- **Authentication**: JWT-based authentication with secure password hashing
- **Note Management**: Full CRUD operations for notes with advanced features
- **File Upload**: PDF file upload with base64 conversion and size limits
- **Search**: Full-text search with PostgreSQL tsvector, keyword search, and advanced filtering
- **Real-time Updates**: WebSocket support for instant synchronization across devices
- **Statistics**: Comprehensive analytics including activity tracking, study sessions, and storage usage
- **Backup/Export**: Complete data export and import functionality
- **User Management**: Profile management, preferences, and account deletion

### Advanced Features
- **Full-text Search**: PostgreSQL-powered search with ranking and relevance scoring
- **Real-time Sync**: WebSocket integration for instant updates
- **Activity Tracking**: Detailed user activity logs for analytics
- **Study Sessions**: Track study time and sessions
- **Tagging System**: Organize notes with custom tags
- **Favorites & Archive**: Mark notes as favorites or archive them
- **Storage Management**: Monitor and manage storage usage

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 14+ with advanced features
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, Rate Limiting, bcrypt
- **Logging**: Morgan, Winston
- **Validation**: express-validator

## Installation

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Setup

1. **Navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bilisa_archive
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Set up PostgreSQL database**
```bash
# Create database
createdb bilisa_archive

# Run migration
npm run migrate
```

5. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Note Endpoints (Requires Authentication)

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer <token>

Query Parameters:
- grade: Filter by grade (Grade 9, Grade 10, etc.)
- subject: Filter by subject (Chemistry, Physics, etc.)
- unit: Filter by unit (Unit 1, Unit 2, etc.)
- archived: Include archived notes (true/false)
- favorite: Only favorite notes (true/false)
```

#### Get Single Note
```http
GET /api/notes/:id
Authorization: Bearer <token>
```

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Chemical Bonding Notes",
  "content": "Note content here...",
  "contentType": "text",
  "grade": "Grade 10",
  "subject": "Chemistry",
  "unit": "Unit 3",
  "tags": ["important", "exam"]
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isFavorite": true
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

#### Get Favorite Notes
```http
GET /api/notes/favorites/list
Authorization: Bearer <token>
```

#### Get Archived Notes
```http
GET /api/notes/archived/list
Authorization: Bearer <token>
```

### Search Endpoints (Requires Authentication)

#### Full Text Search
```http
GET /api/search?q=search_term
Authorization: Bearer <token>

Query Parameters:
- grade: Filter by grade
- subject: Filter by subject
- unit: Filter by unit
- contentType: Filter by content type
- archived: Include archived notes
```

#### Advanced Search
```http
POST /api/search/advanced
Authorization: Bearer <token>
Content-Type: application/json

{
  "searchTerm": "chemical bonding",
  "grades": ["Grade 10", "Grade 11"],
  "subjects": ["Chemistry"],
  "tags": ["important"],
  "dateFrom": "2024-01-01",
  "dateTo": "2024-12-31",
  "favoriteOnly": false
}
```

#### Search Suggestions
```http
GET /api/search/suggestions?term=chem
Authorization: Bearer <token>
```

### Statistics Endpoints (Requires Authentication)

#### Get User Statistics
```http
GET /api/stats
Authorization: Bearer <token>
```

#### Get Activity Statistics
```http
GET /api/stats/activity?days=30
Authorization: Bearer <token>
```

#### Get Study Session Statistics
```http
GET /api/stats/study-sessions
Authorization: Bearer <token>
```

#### Get Storage Usage
```http
GET /api/stats/storage
Authorization: Bearer <token>
```

### User Endpoints (Requires Authentication)

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

#### Get Preferences
```http
GET /api/users/preferences
Authorization: Bearer <token>
```

#### Update Preferences
```http
PUT /api/users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "darkMode": true,
  "notifications": false
}
```

#### Delete Account
```http
DELETE /api/users/account
Authorization: Bearer <token>
```

### Upload Endpoints (Requires Authentication)

#### Upload PDF
```http
POST /api/upload/pdf
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <PDF file>
```

#### Upload Multiple PDFs
```http
POST /api/upload/pdfs
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: <PDF files>
```

### Backup Endpoints (Requires Authentication)

#### Export Data
```http
GET /api/backup/export
Authorization: Bearer <token>
```

#### Import Data
```http
POST /api/backup/import
Authorization: Bearer <token>
Content-Type: application/json

{
  "data": {
    "version": "1.0",
    "notes": [...],
    "studySessions": [...]
  }
}
```

#### Create Backup
```http
POST /api/backup/create
Authorization: Bearer <token>
```

#### List Backups
```http
GET /api/backup/list
Authorization: Bearer <token>
```

#### Delete Backup
```http
DELETE /api/backup/:backupId
Authorization: Bearer <token>
```

## WebSocket Events

### Client to Server

#### Join User Room
```javascript
socket.emit('join-user-room', userId);
```

### Server to Client

#### Note Created
```javascript
socket.on('note-created', (note) => {
  console.log('New note created:', note);
});
```

#### Note Updated
```javascript
socket.on('note-updated', (note) => {
  console.log('Note updated:', note);
});
```

#### Note Deleted
```javascript
socket.on('note-deleted', ({ id }) => {
  console.log('Note deleted:', id);
});
```

#### Data Imported
```javascript
socket.on('data-imported', (stats) => {
  console.log('Data imported:', stats);
});
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `display_name` (VARCHAR)
- `avatar_url` (TEXT)
- `preferences` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)
- `is_active` (BOOLEAN)

### Notes Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `title` (VARCHAR)
- `content` (TEXT)
- `content_type` (VARCHAR)
- `grade` (VARCHAR)
- `subject` (VARCHAR)
- `unit` (VARCHAR)
- `pdf_data` (TEXT)
- `pdf_name` (VARCHAR)
- `pdf_size` (INTEGER)
- `keywords` (TEXT[])
- `tags` (TEXT[])
- `is_favorite` (BOOLEAN)
- `is_archived` (BOOLEAN)
- `view_count` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Study Sessions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `note_id` (UUID, Foreign Key)
- `duration_minutes` (INTEGER)
- `started_at` (TIMESTAMP)
- `ended_at` (TIMESTAMP)
- `notes` (TEXT)

### User Activities Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `activity_type` (VARCHAR)
- `activity_data` (JSONB)
- `created_at` (TIMESTAMP)

### Backups Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `data` (JSONB)
- `size` (INTEGER)
- `created_at` (TIMESTAMP)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **Input Validation**: Request validation with express-validator
- **SQL Injection Prevention**: Parameterized queries
- **File Upload Limits**: Size and type restrictions

## Performance Features

- **Database Indexing**: Optimized indexes for common queries
- **Full-text Search**: PostgreSQL tsvector for fast text search
- **Connection Pooling**: Efficient database connection management
- **Compression**: Gzip compression for responses
- **Caching**: Redis-ready architecture (can be added)

## Development

### Running Tests
```bash
npm test
```

### Database Migration
```bash
npm run migrate
```

### Code Structure
```
server/
├── src/
│   ├── database/
│   │   ├── config.js
│   │   ├── schema.sql
│   │   └── migrate.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── note.routes.js
│   │   ├── user.routes.js
│   │   ├── search.routes.js
│   │   ├── stats.routes.js
│   │   ├── backup.routes.js
│   │   └── upload.routes.js
│   └── services/
│       ├── auth.service.js
│       ├── note.service.js
│       ├── user.service.js
│       ├── search.service.js
│       ├── stats.service.js
│       ├── backup.service.js
│       └── upload.service.js
├── uploads/
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Deployment

### Environment Variables
Ensure all environment variables are set in production:
- `NODE_ENV=production`
- Strong `JWT_SECRET`
- Secure database credentials
- Proper `CORS_ORIGIN`

### Production Setup
1. Use a process manager like PM2
2. Set up SSL/TLS certificates
3. Configure reverse proxy (nginx)
4. Enable database backups
5. Set up monitoring and logging
6. Configure firewall rules

### PM2 Setup
```bash
npm install -g pm2
pm2 start server.js --name bilisa-backend
pm2 startup
pm2 save
```

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running
- Verify database credentials
- Ensure database exists

### Port Already in Use
- Change PORT in .env
- Kill process using the port

### File Upload Issues
- Check upload directory permissions
- Verify MAX_FILE_SIZE limit
- Ensure disk space is available

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please refer to the main project documentation.
