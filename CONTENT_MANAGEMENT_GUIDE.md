# Portfolio Content Management Guide

## 🎯 Overview

Your portfolio has a complete **Admin Dashboard** where you can upload files, images, and manage all your content without touching any code!

## 📸 What You Can Upload

1. **Profile Picture** - Your main photo (JPEG, PNG, WebP, GIF up to 5MB)
2. **Project Images** - Screenshots of your projects (up to 5MB each)
3. **Certificates** - PDF or image files of your certificates (up to 10MB each)
4. **Gallery Images** - Personal photos for your gallery (up to 5MB each)
5. **Resume/CV** - PDF document (up to 10MB)
6. **Achievement Images** - Photos of awards/achievements

---

## 🚀 Complete Setup Process

### Step 1: Set Up Firebase (One-Time Setup)

#### 1.1 Go to Firebase Console
Visit: https://console.firebase.google.com/

#### 1.2 Create a New Project
1. Click **"Add project"**
2. Enter project name: `my-portfolio` (or any name you like)
3. Disable Google Analytics (optional, not needed)
4. Click **"Create project"**

#### 1.3 Add a Web App
1. In your project dashboard, click the **Web icon** (`</>`)
2. Register app with nickname: **"Portfolio Website"**
3. Click **"Register app"**
4. **IMPORTANT**: Copy the Firebase configuration - you'll need these values!

```javascript
// It will look like this:
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "my-portfolio-xxxxx.firebaseapp.com",
  projectId: "my-portfolio-xxxxx",
  storageBucket: "my-portfolio-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

#### 1.4 Enable Authentication
1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable** it and click **"Save"**

#### 1.5 Create Your Admin Account
1. Still in Authentication, go to the **"Users"** tab
2. Click **"Add user"**
3. Enter your email: `your-email@example.com`
4. Enter a strong password (you'll use this to login)
5. Click **"Add user"**

**📝 SAVE THESE CREDENTIALS - You'll need them to login!**

#### 1.6 Enable Firestore Database
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select a location (choose closest to your users)
5. Click **"Enable"**

#### 1.7 Enable Storage
1. In the left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Click **"Next"** then **"Done"**

---

### Step 2: Configure Your Local Environment

#### 2.1 Create `.env.local` File
In your project root folder (where `package.json` is), create a file named `.env.local`

#### 2.2 Add Firebase Configuration
Paste this into `.env.local` and replace with YOUR values from Step 1.3:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-portfolio-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-portfolio-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-portfolio-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx
```

#### 2.3 Restart Your Dev Server
1. Stop the current server (Press `Ctrl + C` in terminal)
2. Start it again: `pnpm dev`
3. You should see: **✅ Firebase initialized successfully**

---

## 🎨 Managing Your Portfolio Content

### Step 3: Login to Admin Panel

1. Open your browser: http://localhost:3000/login
2. Enter the email and password you created in Step 1.5
3. Click **"Sign In"**
4. You'll be redirected to the Admin Dashboard!

### Step 4: Update Your Personal Information

1. In the Admin Dashboard, click **"Personal Info"**
2. Fill in your details:
   - **Name**: Your full name
   - **Headline**: Your professional title (e.g., "Full Stack Developer")
   - **Short Bio**: 1-2 sentence summary
   - **Full Bio**: Detailed about yourself
   - **Location**: Your city/country
   - **Email**: Contact email
   - **Phone**: Contact number
   - **Current Status**: What you're doing now

3. **Upload Profile Picture**:
   - Click the profile picture upload button
   - Select an image (JPEG, PNG, WebP, or GIF)
   - Max size: 5MB
   - It will automatically upload to Firebase Storage!

4. **Add Social Links**:
   - GitHub URL
   - LinkedIn URL
   - Twitter URL
   - etc.

5. Click **"Save Changes"**

### Step 5: Add Projects

1. Click **"Projects"** in the Admin sidebar
2. Click **"Add New Project"**
3. Fill in project details:
   - **Title**: Project name
   - **Description**: Short summary
   - **Full Description**: Detailed explanation
   - **Technologies**: React, Node.js, etc. (comma-separated)
   - **GitHub URL**: Link to repository
   - **Live Demo URL**: Link to deployed app
   - **Status**: Completed, In Progress, or Planned

4. **Upload Project Image**:
   - Click the image upload button
   - Select a screenshot of your project
   - Max size: 5MB
   - It uploads automatically!

5. Click **"Save Project"**

### Step 6: Upload Certificates

1. Click **"Certificates"** in the Admin sidebar
2. Click **"Add Certificate"**
3. Fill in details:
   - **Title**: Certificate name (e.g., "AWS Certified Developer")
   - **Issuer**: Who issued it (e.g., "Amazon Web Services")
   - **Issue Date**: When you received it
   - **Credential ID**: Certificate number (if any)
   - **Credential URL**: Link to verify online

4. **Upload Certificate File**:
   - Click the upload button
   - Select PDF or image file
   - Max size: 10MB for PDFs, 5MB for images
   - Supports: PDF, JPEG, PNG, WebP

5. Click **"Save Certificate"**

### Step 7: Add Gallery Images

1. Click **"Gallery"** in the Admin sidebar
2. Click **"Upload Images"**
3. Select multiple images at once
4. Add captions and categories for each
5. Images upload automatically to Firebase Storage!

### Step 8: Add Other Content

Similarly, you can add:
- **Skills**: Technical and soft skills with proficiency levels
- **Education**: Schools, degrees, and dates
- **Experience**: Work history and responsibilities
- **Achievements**: Awards, recognition, milestones
- **Hobbies**: Personal interests with icons
- **Future Goals**: Your aspirations with timeframes
- **Blog Posts**: Write articles with rich text
- **Testimonials**: Client/colleague feedback

---

## 📂 How File Uploads Work

### Upload Process:
1. You select a file in the admin form
2. File is validated (type and size)
3. File is uploaded to **Firebase Storage** with progress indicator
4. Firebase returns a secure download URL
5. URL is saved to **Firestore Database** with your content
6. File appears immediately on your public portfolio!

### File Storage Structure:
```
Firebase Storage/
├── profile/           # Profile pictures
├── projects/          # Project screenshots
├── certificates/      # Certificate PDFs and images
├── gallery/           # Gallery images
├── achievements/      # Achievement photos
├── resumes/          # CV/Resume files
└── blog/             # Blog post images
```

### Supported File Types:
- **Images**: JPEG, JPG, PNG, GIF, WebP (max 5MB)
- **Documents**: PDF (max 10MB)

---

## 🔄 Editing & Deleting Content

### To Edit:
1. Go to the relevant admin section
2. Click **"Edit"** button next to the item
3. Update the information
4. Upload a new file if needed (old file is automatically deleted)
5. Click **"Save Changes"**

### To Delete:
1. Click **"Delete"** button next to the item
2. Confirm deletion
3. The item and its files are removed from Firebase

---

## 🔒 Security & Privacy

### Current Setup (Development):
- ✅ Public can READ your portfolio content
- ✅ Only YOU (authenticated) can WRITE/EDIT/DELETE
- ✅ Files are stored securely in Firebase Storage

### Before Deploying (Production):
You'll need to update Firebase Security Rules (instructions in `FIREBASE_CONFIG_GUIDE.md`)

---

## 🚀 Deployment

Once you're happy with your portfolio:

1. **Build for production**:
   ```bash
   pnpm build
   ```

2. **Deploy to Vercel** (recommended):
   ```bash
   pnpm vercel
   ```
   - Add your Firebase environment variables in Vercel dashboard
   - Vercel will automatically deploy your site!

3. **Your portfolio is live!** 🎉
   - Public can view your portfolio
   - You can still login to `/admin` to update content anytime
   - All changes reflect immediately

---

## 📊 Admin Dashboard Features

### Currently Implemented:
- ✅ Personal Info Management (with profile picture upload)
- ✅ Projects Management (with image uploads)
- ✅ Authentication & Login
- ✅ Protected Routes

### Coming Soon (you can request these):
- Skills Management
- Education Management
- Experience Management
- Certificates Management (with PDF/image upload)
- Gallery Management (bulk image upload)
- Achievements Management
- Blog Posts Management
- Testimonials Management
- Settings & Configuration

---

## 🆘 Troubleshooting

### "Firebase not initialized" error:
- Check that `.env.local` exists in project root
- Verify all environment variables are correct
- Restart dev server after creating `.env.local`

### File upload fails:
- Check file size (Images: 5MB, PDFs: 10MB)
- Verify Firebase Storage is enabled
- Check file type is supported
- Look at browser console for specific error

### Can't login:
- Verify email/password is correct
- Check that user exists in Firebase Authentication
- Make sure Email/Password sign-in is enabled in Firebase

### Changes don't appear on public site:
- Refresh the page
- Check if data was saved in Firebase Console > Firestore
- Clear browser cache

---

## 💡 Tips

1. **Optimize Images**: Use compressed images for faster loading
2. **Consistent Naming**: Use clear names for files
3. **Regular Backups**: Firebase automatically backs up, but you can export data
4. **Test First**: Make changes in development before deploying
5. **Mobile Preview**: Test your portfolio on mobile devices

---

## 🎯 Quick Reference

| What You Want | Where to Go | What You Can Upload |
|---------------|-------------|---------------------|
| Profile Picture | Admin > Personal Info | 1 image (5MB) |
| Projects | Admin > Projects | Multiple projects with images |
| Certificates | Admin > Certificates | PDFs or images (10MB) |
| Gallery | Admin > Gallery | Multiple images (5MB each) |
| Resume/CV | Admin > Personal Info | 1 PDF (10MB) |
| Skills | Admin > Skills | No files, just text |
| Education | Admin > Education | No files, just text |
| Experience | Admin > Experience | No files, just text |

---

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Review `FIREBASE_CONFIG_GUIDE.md` for setup details
4. Check Firebase Console for service status

**Your portfolio is ready to be filled with your amazing content!** 🚀

