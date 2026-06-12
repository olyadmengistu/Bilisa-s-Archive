# Permanent Storage Deployment Guide

This guide will help you deploy your Bilisa Archive application with permanent cloud storage using Vercel Postgres.

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Your code should be pushed to GitHub
3. **Node.js** - Version 16 or higher installed locally

## Step 1: Set Up Vercel Postgres Database

### 1.1 Create Vercel Project
1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy"

### 1.2 Add Postgres Database
1. Go to your Vercel project dashboard
2. Click "Storage" tab in the left sidebar
3. Click "Create Database"
4. Select "Postgres" and choose a region (closest to your users)
5. Click "Create"

### 1.3 Get Database Credentials
1. After creating the database, click on it
2. Go to the ".env.local" tab
3. Copy all the environment variables (you'll need these for deployment)

## Step 2: Configure Environment Variables

### 2.1 In Vercel Dashboard
1. Go to your project settings
2. Click "Environment Variables"
3. Add the following variables from your Postgres database:
   - `POSTGRES_URL`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`
   - `POSTGRES_PRISMA_URL` (if available)

### 2.2 Local Development (Optional)
Create a `.env.local` file in your project root:
```bash
POSTGRES_URL=your_postgres_url_here
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_PRISMA_URL=your_postgres_prisma_url
```

## Step 3: Initialize Database Tables

### 3.1 Deploy the Table Creation Script
1. Push your code to GitHub (if not already done)
2. Vercel will automatically deploy
3. After deployment, visit: `https://your-app.vercel.app/api/create-table`
4. This will create the necessary database tables

### 3.2 Verify Tables Created
1. Go to Vercel Postgres dashboard
2. Click on your database
3. Go to "Tables" tab
4. You should see `users` and `notes` tables

## Step 4: Test the Application

### 4.1 Create Test Account
1. Visit your deployed app
2. Click "Sign Up" (if available) or use the login form
3. Create a new account with email and password

### 4.2 Test Note Creation
1. Log in to your account
2. Click "Add New Note"
3. Fill in the form and save
4. Verify the note appears in "My Notes"

### 4.3 Test Cross-Device Access
1. Open your app in a different browser or device
2. Log in with the same credentials
3. Verify your notes appear (this confirms permanent cloud storage)

## Step 5: Git Push and Deploy

### 5.1 Commit Your Changes
```bash
git add .
git commit -m "Add permanent storage with Vercel Postgres"
```

### 5.2 Push to GitHub
```bash
git push origin main
```

### 5.3 Automatic Deployment
- Vercel will automatically detect the push and deploy
- Monitor the deployment in your Vercel dashboard
- Once deployed, your app will have permanent cloud storage

## Architecture Overview

### Components
- **Frontend**: React app with Vite
- **Backend**: Vercel Serverless Functions (API routes)
- **Database**: Vercel Postgres (PostgreSQL)
- **Authentication**: Custom JWT-based auth (stored in localStorage)

### Data Flow
1. User logs in → API validates credentials → Returns user ID
2. User creates note → Frontend calls API → API saves to Postgres
3. User views notes → Frontend calls API → API fetches from Postgres
4. Data persists across devices and sessions

### API Endpoints
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/notes` - Get all user's notes
- `POST /api/notes` - Create new note
- `PUT /api/notes?id=xxx` - Update note
- `DELETE /api/notes?id=xxx` - Delete note
- `GET /api/notes?search=true&keywords=xxx` - Search notes
- `POST /api/create-table` - Initialize database tables

## Troubleshooting

### Database Connection Issues
- Verify environment variables are set correctly in Vercel
- Check that Postgres database is running
- Ensure the database region is accessible

### API Errors
- Check Vercel function logs in the dashboard
- Verify API routes are properly deployed
- Ensure CORS headers are set correctly

### Authentication Issues
- Clear browser localStorage and try again
- Verify user credentials are correct
- Check that user exists in the database

### Notes Not Saving
- Check browser console for errors
- Verify API endpoint is responding
- Ensure database tables exist
- Check Vercel function logs

## Security Notes

### Password Security
- Passwords are hashed using SHA-256 before storage
- In production, consider using bcrypt or Argon2 for better security
- Never store plain-text passwords

### API Security
- User ID is passed via headers (X-User-Id)
- In production, implement proper JWT tokens
- Add rate limiting to prevent abuse
- Implement proper CORS policies

### Database Security
- Vercel Postgres provides automatic backups
- Regular backups are recommended
- Consider implementing row-level security

## Scaling Considerations

### Performance
- Current implementation uses polling (5-second intervals)
- Consider implementing WebSockets for real-time updates
- Add database indexes for frequently queried fields
- Implement caching for frequently accessed data

### Storage Limits
- Vercel Postgres free tier: 256MB storage
- Paid tiers available for more storage
- PDF files stored as base64 (consider using Vercel Blob for large files)

### User Limits
- Free tier: 60 hours of serverless function execution per month
- Paid tiers available for higher limits
- Monitor usage in Vercel dashboard

## Next Steps

### Immediate
1. Deploy to Vercel following this guide
2. Test all functionality
3. Verify cross-device sync works

### Future Enhancements
1. Implement proper JWT authentication
2. Add WebSocket support for real-time updates
3. Implement file upload to Vercel Blob for PDFs
4. Add email verification for signup
5. Implement password reset functionality
6. Add data export/import features

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify database connection in Vercel Postgres dashboard
4. Ensure all environment variables are set correctly

Your notes are now permanently stored in the cloud and accessible from any device!
