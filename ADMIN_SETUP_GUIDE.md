# Admin Panel Setup Guide

Your admin panel is built and ready, but requires Firebase configuration to function properly.

## Current Status ✅

- ✅ Admin authentication working
- ✅ Admin route protection implemented
- ✅ Admin UI components built
- ❌ Firebase Storage not configured (image uploads won't work)
- ❌ Firestore security rules not set (data updates won't work)

## Quick Fix: Enable Firebase Services

### Step 1: Update Storage Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **"Storage"** in the left menu
4. Click the **"Rules"** tab

5. Replace the existing rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow everyone to read files (for public portfolio)
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only authenticated admins can upload/delete files
    match /{allPaths=**} {
      allow write: if request.auth != null && 
                   exists(/databases/(default)/documents/admins/$(request.auth.token.email));
    }
  }
}
```

6. Click **"Publish"**

### Step 2: Update Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Replace the existing rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    // Public read access to all portfolio content
    match /{document=**} {
      allow read: if true;
    }
    
    // Admins collection - only admins can read/write
    match /admins/{email} {
      allow read, write: if isAdmin();
    }
    
    // All other collections - admins only can write
    match /{collection}/{document} {
      allow write: if isAdmin();
    }
  }
}
```

3. Click **"Publish"**

## Testing Your Admin Panel

1. **Log in** at: `http://localhost:3006/login`
2. **Navigate to Personal Info**: Click "Personal Info" in the sidebar
3. **Try uploading a profile image**: Click the upload button
4. **Fill out the form** and click "Save"
5. **Check other sections**: Projects, Skills, etc.

## What Each Admin Page Does

| Page | Functionality |
|------|--------------|
| **Personal Info** | Update name, bio, profile image, social links |
| **Skills** | Add/edit skill categories and individual skills |
| **Education** | Manage education history |
| **Experience** | Add work experience entries |
| **Projects** | Create/edit project portfolio items |
| **Achievements** | List accomplishments and awards |
| **Certificates** | Upload and manage certificates |
| **Gallery** | Manage photo gallery |
| **Hobbies** | Add personal interests |
| **Goals** | Set and track future goals |
| **Testimonials** | Manage client/colleague testimonials |
| **Blog** | Create and publish blog posts |
| **Contact** | Update contact information |

## Troubleshooting

### "Permission Denied" Errors

- Make sure you've published the Firestore and Storage rules
- Verify your email is in the `admins` collection
- Clear browser cache and reload

### Images Not Uploading

- Verify Firebase Storage is enabled
- Check Storage rules are published
- File size must be under 5MB for images
- Allowed formats: JPEG, PNG, GIF, WebP

### Data Not Saving

- Check Firestore rules are published
- Open browser console (F12) to see detailed error messages
- Verify Firebase is initialized (look for "✅ Firebase initialized successfully" in console)

## Security Notes

🔒 **Production Security**: Before deploying to production:
1. Your Firestore rules already restrict writes to admins only
2. Storage rules prevent non-admins from uploading
3. Consider adding rate limiting
4. Monitor Firebase usage in the console

## Next Steps

After setting up Firebase:
1. ✅ Set up Storage and Firestore rules
2. 📝 Fill in your personal information
3. 🎨 Upload a profile picture
4. 💼 Add your projects and experience
5. 📱 Test on mobile devices
6. 🚀 Deploy to production

Need help? Check the Firebase Console for detailed error messages or review the browser console logs.
