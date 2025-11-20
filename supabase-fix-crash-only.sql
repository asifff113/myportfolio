-- FIX THE DATABASE CRASH (Infinite Recursion)
-- Run this in Supabase SQL Editor

-- 1. Drop the bad policy that causes the crash
DROP POLICY IF EXISTS "Admin read access" ON admins;

-- 2. Create the safe policy
-- This allows the app to check if you are an admin without crashing
DROP POLICY IF EXISTS "Users can read own admin record" ON admins;
CREATE POLICY "Users can read own admin record" 
ON admins FOR SELECT 
USING (
  email = auth.jwt() ->> 'email'
);

-- Note: Your email 'howeverok45@gmail.com' is ALREADY in the table.
-- You don't need to insert it again.
-- Just running this script will make the admin features start working.
