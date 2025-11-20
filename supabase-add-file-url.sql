-- Add file_url column to certificates table
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Migrate existing file URLs from credential_url to file_url
-- This moves Supabase/Firebase storage URLs to the new file_url column
UPDATE certificates 
SET file_url = credential_url 
WHERE credential_url LIKE '%supabase.co%' OR credential_url LIKE '%firebasestorage%';

-- Clear credential_url if it was moved to file_url
-- This ensures fileUrl !== credentialUrl check works correctly
UPDATE certificates 
SET credential_url = NULL 
WHERE (credential_url LIKE '%supabase.co%' OR credential_url LIKE '%firebasestorage%') 
  AND file_url IS NOT NULL;
