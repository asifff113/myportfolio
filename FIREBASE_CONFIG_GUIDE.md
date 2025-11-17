# Firebase Configuration Guide

## Quick Start (Development Mode)

The portfolio app is currently running with **mock data** because Firebase is not configured. This is perfect for testing the UI and functionality!

## Setting Up Firebase (Optional for Production)

When you're ready to deploy or want to use real data with admin features, follow these steps:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "my-portfolio")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)

### 2. Register Your Web App

1. In your Firebase project, click the **Web** icon (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Portfolio Website")
3. Firebase will show you a configuration object - **copy these values**

### 3. Enable Firebase Services

#### Enable Authentication
1. Go to **Authentication** in the left sidebar
2. Click "Get started"
3. Enable **Email/Password** as a sign-in method
4. Create your first admin user (you'll use this to login to `/admin`)

#### Enable Firestore Database
1. Go to **Firestore Database** in the left sidebar
2. Click "Create database"
3. Start in **test mode** for now (we'll secure it later)
4. Choose a location close to your users

#### Enable Storage
1. Go to **Storage** in the left sidebar
2. Click "Get started"
3. Start in **test mode** for now
4. Use the same location as your database

### 4. Configure Environment Variables

1. **Create a file named `.env.local`** in the root of your project
2. Copy and paste this template:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. **Replace the values** with your actual Firebase config values from step 2

### 5. Restart the Development Server

After creating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
pnpm dev
```

You should now see: `✅ Firebase initialized successfully` in your terminal!

### 6. Access the Admin Panel

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Sign in with the email/password you created in Firebase Authentication
3. You'll be redirected to `/admin` where you can manage your portfolio content

## Troubleshooting

### "Firebase not initialized" warnings
- Make sure `.env.local` exists and has all required variables
- Restart your dev server after creating/editing `.env.local`
- Double-check that all environment variables start with `NEXT_PUBLIC_`

### Can't see changes in the admin panel
- Make sure you're signed in (check the "Admin" link in the navbar)
- Check your browser console for errors
- Verify Firestore and Storage are enabled in Firebase Console

### Authentication errors
- Verify Email/Password is enabled in Firebase Authentication
- Make sure you created a user account in Firebase Console
- Check that `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct

## Security Rules (Production)

Before deploying, update your Firebase Security Rules:

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Current Status

- ✅ App is running with mock data (no Firebase needed)
- ✅ All UI components are functional
- ✅ You can test navigation and features
- ⚠️ Admin panel requires Firebase configuration
- ⚠️ File uploads require Firebase Storage
- ⚠️ Data persistence requires Firestore

---

**Need help?** Check the [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) file for more detailed instructions.

