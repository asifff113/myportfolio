-- Storage policies for portfolio bucket
-- Run this in Supabase SQL Editor after creating the 'portfolio' bucket

-- Allow public read access to all files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

-- Allow authenticated admins to upload files
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' 
  AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
);

-- Allow authenticated admins to update files
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio'
  AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
);

-- Allow authenticated admins to delete files
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio'
  AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
);
