# Firebase Backend Integration Guide

This guide will walk you through setting up a robust Firebase backend for your Bilisa Archive application, enabling cross-device synchronization, secure authentication, and long-term data persistence.

## Prerequisites

- Node.js 16+ installed
- Firebase account (free tier is sufficient)
- Your existing Bilisa Archive React application

## Phase 1: Firebase Console Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `bilisa-archive`
4. Accept Firebase terms (you can decline Google Analytics if preferred)
5. Click **"Create project"**
6. Wait for project creation (1-2 minutes)

### Step 2: Enable Authentication

1. In Firebase Console, navigate to **Build → Authentication**
2. Click **"Get Started"**
3. Select **"Email/Password"** sign-in method
4. Enable it and click **"Save"**
5. Optionally enable other providers (Google, etc.) if desired

### Step 3: Set up Firestore Database

1. Navigate to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose a location (select closest to your users, e.g., `us-central`)
4. Select **"Start in production mode"** (we'll set up security rules)
5. Click **"Create"**

### Step 4: Configure Firestore Security Rules

1. In Firestore Database, click the **"Rules"** tab
2. Replace the existing rules with the content from `firestore.rules` in your project
3. Click **"Publish"**

**Security Rules Summary:**
- Users can only read/write their own notes
- All operations require authentication
- Data is isolated by user ID

### Step 5: Get Firebase Configuration

1. Navigate to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Web"** (</> icon)
4. Register app: enter name `bilisa-archive-web`
5. **Don't** check "Firebase Hosting" (you're using Vercel)
6. Click **"Register app"**
7. Copy the `firebaseConfig` object values

### Step 6: Create Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration values:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

**Important:** Never commit `.env` to git (it's already in `.gitignore`)

## Phase 2: Install Dependencies

Run the following command in your project directory:

```bash
npm install firebase
```

## Phase 3: Firestore Indexes Setup

For optimal query performance, you may need to create Firestore indexes. Firebase will prompt you when you run complex queries. To set up indexes manually:

1. Navigate to **Firestore Database → Indexes** tab
2. Click **"Add index"**
3. Create composite indexes for common query patterns:
   - Collection: `notes`
   - Fields: `userId` (ascending), `updatedAt` (descending)
   - Fields: `userId` (ascending), `grade` (ascending), `updatedAt` (descending)
   - Fields: `userId` (ascending), `subject` (ascending), `updatedAt` (descending)
   - Fields: `userId` (ascending), `unit` (ascending), `updatedAt` (descending)

## Phase 4: Test the Integration

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Test Authentication Flow

1. Open http://localhost:5173
2. You should see the Login screen
3. Click **"Create one"** to register a new account
4. Enter email and password (min 6 characters)
5. After registration, you'll see the Migration Prompt

### Step 3: Test Data Migration

1. If you have existing notes in IndexedDB, click **"Migrate to Firebase"**
2. Watch the migration progress
3. After migration, you'll see "Cloud Synced" badge in the header
4. Your notes are now stored in Firebase

### Step 4: Test Cross-Device Sync

1. Open your app in a different browser or device
2. Login with the same credentials
3. Your notes should appear automatically
4. Add a new note on one device
5. Refresh on the other device - the new note should appear

### Step 5: Test Offline Support

1. Disconnect your internet
2. Try to view your notes (they should load from cache)
3. Add a new note while offline
4. Reconnect to internet
5. The note should sync automatically to Firebase

## Phase 5: Deploy to Vercel

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add all the Firebase config variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Step 2: Deploy

```bash
npm run build
vercel --prod
```

Or push to git and let Vercel auto-deploy.

## Phase 6: Security Best Practices

### 1. Enable Email Verification (Optional)

In Firebase Console → Authentication → Sign-in method → Email/Password:
- Enable **"Email verification"** to require users to verify their email

### 2. Set Up Password Reset

The app already includes password reset functionality. Ensure your email templates are configured in Firebase Console → Authentication → Templates.

### 3. Monitor Usage

Regularly check:
- Firebase Console → Authentication → Users
- Firebase Console → Firestore Database → Usage
- Firebase Console → Project Settings → Usage and billing

### 4. Backup Strategy

Firebase automatically backs up your data, but for extra safety:
- Export data regularly using Firebase Console → Firestore → Export
- Consider setting up automated backups via Cloud Functions

## Phase 7: Advanced Features (Optional)

### 1. Real-time Sync

The app already uses Firestore's real-time capabilities. Notes sync automatically across devices.

### 2. Cloud Storage for Large Files

For PDFs larger than 1MB, consider using Firebase Storage instead of storing base64 in Firestore:

1. Enable Firebase Storage in Console
2. Update `firebaseService.js` to upload files to Storage
3. Store file URLs in Firestore documents

### 3. Analytics

Enable Firebase Analytics to track:
- User engagement
- Note creation patterns
- Popular subjects/grades

## Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Solution:** Check your `.env` file values match Firebase Console exactly.

### Issue: "Missing or insufficient permissions"

**Solution:** Ensure Firestore security rules are published and you're logged in.

### Issue: Migration fails

**Solution:** Check browser console for errors. Ensure you're logged in before migrating.

### Issue: Notes not syncing across devices

**Solution:** 
- Check internet connection
- Ensure both devices are logged into the same Firebase account
- Check Firestore usage limits (free tier has generous limits)

### Issue: Offline mode not working

**Solution:** 
- Ensure IndexedDB is enabled in your browser
- Check browser console for persistence errors
- Try in incognito mode to rule out extension conflicts

## Data Retention & Long-term Storage

Firebase Firestore provides:
- **Automatic backups** with 30-day retention
- **Point-in-time recovery** for paid plans
- **99.99% uptime** SLA
- **Unlimited storage** (with pricing based on reads/writes)

For 5+ year data retention:
1. Regularly export data from Firestore
2. Store exports in secure cloud storage (Google Cloud Storage, AWS S3)
3. Consider upgrading to Blaze plan for better backup options

## Cost Estimation (Free Tier)

The Firebase Spark (free) tier includes:
- **Authentication:** Unlimited
- **Firestore:** 50K reads/day, 20K writes/day, 20K deletes/day
- **Storage:** 5GB
- **Network:** 1GB/month

For a single user with ~100 notes:
- Daily reads: ~10-20
- Daily writes: ~1-5
- Storage: ~10-50MB
- **Well within free tier limits**

## Summary

Your Bilisa Archive now has:
✅ Secure email/password authentication
✅ Cloud-based note storage with Firestore
✅ Cross-device synchronization
✅ Offline support with automatic sync
✅ User data isolation via security rules
✅ Migration path from local IndexedDB
✅ Long-term data persistence

Your notes are now safe, synchronized, and accessible from anywhere for years to come!
