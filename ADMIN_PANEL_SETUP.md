# Admin Panel Setup Guide

## Current Status

The admin panel code has been fully migrated to Supabase, but you're encountering save failures because of Row Level Security (RLS) policies.

## Steps to Fix

### 1. Verify Admin User Exists

First, go to your Supabase dashboard and check if your admin record exists:

1. Go to https://enhgzroynmlgcnfiadbc.supabase.co
2. Navigate to **Table Editor** > **admins** table
3. Verify there's a record with email: `roosvermeulen4690@gmail.com`
4. If not, add it manually:
   ```sql
   INSERT INTO admins (email, role)
   VALUES ('roosvermeulen4690@gmail.com', 'super_admin');
   ```

### 2. Update RLS Policies

The current RLS policies might have syntax issues. Run the fix:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the contents of `supabase-rls-fix.sql`
3. Click **Run** to execute

### 3. Test the Admin Panel

1. Make sure dev server is running: `pnpm dev`
2. Go to http://localhost:3006/login
3. Log in with: roosvermeulen4690@gmail.com
4. Navigate to /admin/personal-info
5. Fill in the form and click "Save Changes"
6. Check browser console (F12) for any errors

## Troubleshooting

### If save still fails:

**Option A: Temporarily Disable RLS (for testing only)**
```sql
ALTER TABLE personal_info DISABLE ROW LEVEL SECURITY;
```

Try saving again. If it works, the issue is with RLS policies.

**Option B: Check Authentication**
```sql
-- In Supabase SQL Editor, check if auth is working:
SELECT auth.jwt();
SELECT auth.jwt() ->> 'email';
```

Run these while logged in to see if auth context is available.

**Option C: Grant Direct Permissions**
```sql
-- Grant all permissions to authenticated users (less secure)
GRANT ALL ON personal_info TO authenticated;
GRANT ALL ON skills TO authenticated;
GRANT ALL ON education TO authenticated;
GRANT ALL ON experience TO authenticated;
GRANT ALL ON projects TO authenticated;
GRANT ALL ON achievements TO authenticated;
GRANT ALL ON certificates TO authenticated;
GRANT ALL ON gallery TO authenticated;
GRANT ALL ON hobbies TO authenticated;
GRANT ALL ON future_goals TO authenticated;
GRANT ALL ON testimonials TO authenticated;
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON contact_info TO authenticated;
```

## What Each Admin Page Does

- **/admin/personal-info** - Edit name, bio, profile image, social links
- **/admin/skills** - Add/edit/delete skills grouped by category
- **/admin/education** - Manage education timeline
- **/admin/experience** - Manage work experience
- **/admin/projects** - Add/edit projects with images
- Other sections (achievements, certificates, etc.) - Similar CRUD operations

## Next Steps After Fixing

1. **Personal Info page** - Already has full UI, just needs RLS fix
2. **Other pages** - Need to verify each page's functionality
3. **Image uploads** - Test file uploads to Supabase Storage
4. **Public site** - Verify data displays correctly on main portfolio

## Files Already Fixed

✅ `src/lib/firebase-queries.ts` - Replaced with Supabase queries, added snake_case to camelCase transformations
✅ `src/lib/firebase-storage.ts` - Replaced with Supabase Storage functions  
✅ `src/hooks/useAuth.ts` - Migrated to Supabase auth
✅ `src/hooks/useAdmin.ts` - Updated to check Supabase admins table
✅ Database schema created with all tables
✅ Storage bucket created with policies
✅ Admin user created in Supabase Authentication

## Known Issues

1. **RLS Policies** - Need to verify they work correctly with Supabase auth
2. **Field mapping** - Personal info now transforms between camelCase and snake_case
3. **Other admin pages** - Haven't been tested yet

## Testing Checklist

- [ ] Can log in successfully
- [ ] Shield icon appears in navbar
- [ ] Can access /admin pages
- [ ] Can save personal info
- [ ] Can upload profile image
- [ ] Skills page works
- [ ] Education page works
- [ ] Experience page works
- [ ] Projects page works
- [ ] Data displays on public portfolio pages
