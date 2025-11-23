-- Add file upload support to achievements table
-- Run this in Supabase SQL Editor

-- Add file_url column to store the uploaded file path
ALTER TABLE achievements
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Add file_type column to store the type of file (image or pdf)
ALTER TABLE achievements
ADD COLUMN IF NOT EXISTS file_type TEXT CHECK (file_type IN ('image', 'pdf'));

-- Add comment for documentation
COMMENT ON COLUMN achievements.file_url IS 'URL/path to uploaded image or PDF file';
COMMENT ON COLUMN achievements.file_type IS 'Type of uploaded file: image or pdf';
