-- Guestbook Table
CREATE TABLE IF NOT EXISTS guestbook_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE guestbook_messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Everyone can read messages
CREATE POLICY "Guestbook messages are public" 
ON guestbook_messages FOR SELECT 
USING (true);

-- 2. Authenticated users can insert their own messages
CREATE POLICY "Users can insert their own messages" 
ON guestbook_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Users can delete their own messages (optional)
CREATE POLICY "Users can delete their own messages" 
ON guestbook_messages FOR DELETE 
USING (auth.uid() = user_id);
