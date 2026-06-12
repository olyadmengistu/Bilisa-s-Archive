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
