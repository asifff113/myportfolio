-- FIX ADMIN EMAIL AND RECURSION BUG
-- Run this script in Supabase SQL Editor

-- 1. FIX THE CRASH (Infinite Recursion)
-- This removes the bad policy causing the "infinite recursion" error
DROP POLICY IF EXISTS "Admin read access" ON admins;

-- 2. ADD THE NEW EMAIL (Keep the old one too)
-- Replace 'YOUR_NEW_EMAIL@gmail.com' with the other email you want to be an admin
INSERT INTO admins (email, role) 
VALUES ('YOUR_NEW_EMAIL@gmail.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- 4. ENSURE SAFE ACCESS
-- This allows you to see your own admin status without crashing the database
DROP POLICY IF EXISTS "Users can read own admin record" ON admins;
CREATE POLICY "Users can read own admin record" 
ON admins FOR SELECT 
USING (
  email = auth.jwt() ->> 'email'
);
