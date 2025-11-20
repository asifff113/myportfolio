-- 1. Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3. Allow authenticated users to read admins table (needed for the policies to work)
DROP POLICY IF EXISTS "Allow authenticated read" ON admins;
CREATE POLICY "Allow authenticated read" ON admins FOR SELECT TO authenticated USING (true);

-- 4. Insert the admin user (Replace with your email if different)
INSERT INTO admins (email, role)
VALUES ('roosvermeulen4690@gmail.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- 5. Fix Storage Policies (Drop and Recreate to be safe)
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio' 
  AND (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
    OR
    -- Fallback: Allow if admins table is empty (bootstrapping)
    NOT EXISTS (SELECT 1 FROM public.admins)
  )
);

CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio'
  AND (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
    OR
    NOT EXISTS (SELECT 1 FROM public.admins)
  )
);

CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio'
  AND (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
    OR
    NOT EXISTS (SELECT 1 FROM public.admins)
  )
);

-- 6. Fix Database Policies
-- Grant access to all authenticated users if they are in admins table OR if admins table is empty
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email'
  ) OR NOT EXISTS (
    SELECT 1 FROM admins
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply policies using the helper function
DROP POLICY IF EXISTS "Admin full access" ON projects;
CREATE POLICY "Admin full access" ON projects FOR ALL TO authenticated USING (is_admin());

-- Repeat for other tables if needed, but projects is the one failing now.
-- Let's do it for all tables to be safe.
DROP POLICY IF EXISTS "Admin full access" ON personal_info;
CREATE POLICY "Admin full access" ON personal_info FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON skills;
CREATE POLICY "Admin full access" ON skills FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON education;
CREATE POLICY "Admin full access" ON education FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON experience;
CREATE POLICY "Admin full access" ON experience FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON achievements;
CREATE POLICY "Admin full access" ON achievements FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON certificates;
CREATE POLICY "Admin full access" ON certificates FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON gallery;
CREATE POLICY "Admin full access" ON gallery FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON hobbies;
CREATE POLICY "Admin full access" ON hobbies FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON future_goals;
CREATE POLICY "Admin full access" ON future_goals FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON testimonials;
CREATE POLICY "Admin full access" ON testimonials FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON blog_posts;
CREATE POLICY "Admin full access" ON blog_posts FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin full access" ON contact_info;
CREATE POLICY "Admin full access" ON contact_info FOR ALL TO authenticated USING (is_admin());
