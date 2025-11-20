-- UPGRADE GUESTBOOK
-- 1. Allow anonymous posts (make user_id nullable)
-- 2. Add moderation (is_hidden column)

-- Modify table structure
ALTER TABLE guestbook_messages 
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE guestbook_messages 
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- Update Policies for Anonymous Access

-- Allow anyone (anon) to insert messages
DROP POLICY IF EXISTS "Users can insert their own messages" ON guestbook_messages;
CREATE POLICY "Anyone can insert messages" 
ON guestbook_messages FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read ONLY visible messages
DROP POLICY IF EXISTS "Guestbook messages are public" ON guestbook_messages;
CREATE POLICY "Public can view visible messages" 
ON guestbook_messages FOR SELECT 
USING (is_hidden = false);

-- Allow Admins to see ALL messages (including hidden ones)
CREATE POLICY "Admins can view all messages" 
ON guestbook_messages FOR SELECT 
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);

-- Allow Admins to update messages (to hide/show them)
CREATE POLICY "Admins can update messages" 
ON guestbook_messages FOR UPDATE 
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
