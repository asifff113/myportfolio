-- Portfolio Database Schema for Supabase
-- Run this in Supabase SQL Editor to create all tables

-- Personal Info Table
CREATE TABLE IF NOT EXISTS personal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  headline TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  long_bio TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  current_status TEXT,
  profile_image_url TEXT,
  resume_url TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  grade TEXT,
  achievements TEXT[],
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  responsibilities TEXT[],
  technologies TEXT[],
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  category TEXT,
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_url TEXT,
  image_url TEXT,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hobbies Table
CREATE TABLE IF NOT EXISTS hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Future Goals Table
CREATE TABLE IF NOT EXISTS future_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_date TEXT,
  category TEXT,
  status TEXT DEFAULT 'planned',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags TEXT[],
  category TEXT,
  reading_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Info Table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  availability TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hobbies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON future_goals FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON contact_info FOR SELECT USING (true);

-- Create policies for admin write access
CREATE POLICY "Admin full access" ON personal_info FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON skills FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON education FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON experience FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON projects FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON achievements FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON certificates FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON gallery FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON hobbies FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON future_goals FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON testimonials FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON blog_posts FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin full access" ON contact_info FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
CREATE POLICY "Admin read access" ON admins FOR SELECT USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
