# Firebase Setup Guide

This guide will help you set up Firebase for your portfolio application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter a project name (e.g., "my-portfolio")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Portfolio Web App")
3. (Optional) Check "Also set up Firebase Hosting" if you want to use Firebase Hosting
4. Click **"Register app"**
5. Copy the Firebase configuration object - you'll need these values for `.env.local`

## Step 3: Set Up Firebase Authentication

1. In the Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

### Create Your Admin Account

You have two options:

**Option A: Using Firebase Console (Recommended)**
1. Go to **Authentication > Users** tab
2. Click **"Add user"**
3. Enter your email and password
4. Click **"Add user"**

**Option B: Using the App (One-time setup)**
1. Temporarily create a signup page or use the browser console
2. Use the `createUserAccount` function from `src/lib/auth.ts`
3. After creating your account, remove or secure the signup functionality

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to **Build > Firestore Database**
2. Click **"Create database"**
3. Choose a location (select the closest to your users)
4. Start in **"Production mode"** (we'll add rules next)
5. Click **"Enable"**

### Set Firestore Security Rules

1. Go to **Firestore Database > Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to all collections
    match /{collection}/{document=**} {
      allow read: if true;
    }
    
    // Only authenticated users can write
    match /{collection}/{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Set Up Firebase Storage

1. In the Firebase Console, go to **Build > Storage**
2. Click **"Get started"**
3. Start in **"Production mode"**
4. Choose the same location as your Firestore
5. Click **"Done"**

### Set Storage Security Rules

1. Go to **Storage > Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only authenticated users can upload/delete files
    match /{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.example`
3. Fill in the values from your Firebase config (from Step 2):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit `.env.local` to Git! It's already in `.gitignore`.

## Step 7: Test Your Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Check the browser console:
   - You should see: `✅ Firebase initialized successfully`
   - If you see warnings about missing config, double-check your `.env.local` file

4. Try logging in:
   - Navigate to `/login`
   - Use the admin credentials you created in Step 3
   - If successful, you should be redirected to `/admin`

## Step 8: Initialize Firestore Collections (Optional)

You can manually add some initial data to test:

1. Go to **Firestore Database** in Firebase Console
2. Click **"Start collection"**
3. Create these collections with the following structure:

### Personal Info Collection
- Collection ID: `personalInfo`
- Document ID: `main`
- Fields:
  - `name` (string): "Your Name"
  - `headline` (string): "Your Headline"
  - `email` (string): "your@email.com"
  - Add other fields as needed (see `content-types.ts`)

### Skills Collection
- Collection ID: `skillCategories`
- Add documents with auto-generated IDs
- Fields:
  - `name` (string): "Frontend Development"
  - `order` (number): 1
  - `skills` (array): [...]

**Note:** The app will fall back to mock data if Firestore is empty, so this step is optional for initial development.

## Troubleshooting

### "Firebase not configured" warning
- Check that all environment variables are set in `.env.local`
- Make sure variable names start with `NEXT_PUBLIC_`
- Restart the dev server after changing `.env.local`

### "Permission denied" errors
- Check Firestore security rules
- Make sure you're authenticated when trying to write data
- Verify your auth token is valid

### Upload fails
- Check Storage security rules
- Verify file size limits (5MB for images, 10MB for PDFs)
- Check file type restrictions

### Authentication errors
- Verify Email/Password is enabled in Firebase Console
- Check that the user exists in Authentication > Users
- Try resetting the password

## Production Deployment

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add all your `NEXT_PUBLIC_FIREBASE_*` variables
4. Redeploy your application

## Security Best Practices

1. **Never expose your Firebase Admin SDK credentials** (not needed for this client-side app)
2. **Use environment variables** for all Firebase config
3. **Implement proper security rules** as your app grows
4. **Enable App Check** for additional security (optional, advanced)
5. **Monitor usage** in Firebase Console to detect unusual activity
6. **Set up billing alerts** to avoid unexpected charges

## Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## Need Help?

If you encounter issues:

1. Check the browser console for error messages
2. Review Firebase Console for quota/permission issues
3. Verify all configuration steps were completed
4. Check that `.env.local` matches your Firebase project settings

---

**Your Firebase setup is now complete!** 🎉

You can now use the admin dashboard to manage your portfolio content, and all data will be stored in Firebase.

