-- Add missing columns to skills table to support AI bot features
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS description TEXT;

-- Update some sample skills to be primary (optional)
-- UPDATE skills SET is_primary = true WHERE level >= 85;
