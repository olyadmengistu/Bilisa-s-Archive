# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Choose a name (e.g., "bilisa-archive")
5. Set a strong database password
6. Choose a region closest to you
7. Click "Create new project"
8. Wait for the project to be ready (2-3 minutes)

## 2. Get Your Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - Project URL (VITE_SUPABASE_URL)
   - anon/public key (VITE_SUPABASE_ANON_KEY)

## 3. Create the Database Table

1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL script:

```sql
-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  grade TEXT,
  subject TEXT,
  unit TEXT,
  pdfData TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see their own notes
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own notes
CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own notes
CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own notes
CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid()::text = user_id);

-- Enable real-time for notes table
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

## 4. Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Install Dependencies

Run the following command in your project directory:

```bash
npm install @supabase/supabase-js
```

## 6. Update Your Application

Update your `src/main.jsx` to use the Supabase AuthProvider instead of Firebase:

```jsx
import { SupabaseAuthProvider } from './supabase/AuthProvider';
// Replace Firebase AuthProvider with SupabaseAuthProvider
```

Update your `src/App.jsx` to import from the new location:

```jsx
import { useSupabaseAuth as useAuth } from './supabase/AuthProvider';
import { NoteService } from './supabase/db';
```

## 7. Enable Google Authentication (Optional)

1. Go to Authentication → Providers in Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set the redirect URL to your app's URL

## 8. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up a new user
3. Create a test note
4. Check the Supabase dashboard to verify data is stored
5. Test in a different browser to verify cross-browser sync

## Migration from Firebase

If you want to migrate existing data from Firebase to Supabase, a migration script can be created. Let me know if you need this.
