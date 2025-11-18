-- Fix RLS Policies to work correctly with Supabase Auth
-- Run this in Supabase SQL Editor

-- First, disable RLS on admins table to prevent recursion
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admin full access" ON personal_info;
DROP POLICY IF EXISTS "Admin full access" ON skills;
DROP POLICY IF EXISTS "Admin full access" ON education;
DROP POLICY IF EXISTS "Admin full access" ON experience;
DROP POLICY IF EXISTS "Admin full access" ON projects;
DROP POLICY IF EXISTS "Admin full access" ON achievements;
DROP POLICY IF EXISTS "Admin full access" ON certificates;
DROP POLICY IF EXISTS "Admin full access" ON gallery;
DROP POLICY IF EXISTS "Admin full access" ON hobbies;
DROP POLICY IF EXISTS "Admin full access" ON future_goals;
DROP POLICY IF EXISTS "Admin full access" ON testimonials;
DROP POLICY IF EXISTS "Admin full access" ON blog_posts;
DROP POLICY IF EXISTS "Admin full access" ON contact_info;

-- Create new admin policies using auth.email()
CREATE POLICY "Admin full access" ON personal_info FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON skills FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON education FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON experience FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON projects FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON achievements FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON certificates FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON gallery FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON hobbies FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON future_goals FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON testimonials FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON blog_posts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Admin full access" ON contact_info FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);
