-- FIX INFINITE RECURSION ERROR
-- This script removes the recursive policy that is crashing the database

-- 1. Drop the problematic policy on the 'admins' table
-- This policy was causing the "infinite recursion" error because it tried to read the admins table to check if you could read the admins table.
DROP POLICY IF EXISTS "Admin read access" ON admins;

-- 2. Ensure we have a safe policy instead
-- This allows users to read ONLY their own admin record, which is safe and non-recursive.
DROP POLICY IF EXISTS "Users can read own admin record" ON admins; -- Drop duplicate if exists

CREATE POLICY "Users can read own admin record" 
ON admins FOR SELECT 
USING (
  email = auth.jwt() ->> 'email'
);

-- 3. Verify Admin Write Access (Optional but good practice)
-- We don't need a policy for admins to write to admins table for now, 
-- but if we did, we'd need to be careful. 
-- For now, we just fix the read access which is blocking everything else.
