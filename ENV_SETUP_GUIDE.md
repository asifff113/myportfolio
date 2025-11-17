# 🔐 Environment Variables Setup

## Quick Setup (2 Minutes)

### **Step 1: Create .env.local File**

In your project root folder (where `package.json` is), create a new file named:

```
.env.local
```

### **Step 2: Copy Template**

Open `env.template` and copy its entire content, OR copy this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **Step 3: Paste into .env.local**

Paste the content into your new `.env.local` file.

### **Step 4: Get Your Firebase Keys**

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Click the **⚙️ gear icon** (top left) → **"Project settings"**
4. Scroll down to **"Your apps"** section
5. You should see your web app
6. Look for the **`firebaseConfig`** object

It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_example_key_abc123",
  authDomain: "my-portfolio-abc123.firebaseapp.com",
  projectId: "my-portfolio-abc123",
  storageBucket: "my-portfolio-abc123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

### **Step 5: Replace Values in .env.local**

Replace each placeholder with your actual values:

**Example .env.local:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC_example_key_abc123
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-portfolio-abc123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-portfolio-abc123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-portfolio-abc123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

⚠️ **IMPORTANT:** Make sure there are NO quotes around the values!

❌ **Wrong:** `NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC..."`  
✅ **Correct:** `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...`

### **Step 6: Save the File**

Save `.env.local` in your project root.

### **Step 7: Restart Dev Server**

Stop your dev server (`Ctrl+C`) and restart:

```bash
pnpm dev
```

---

## 🧪 Test It Works

1. Open: `http://localhost:3000`
2. You should see your portfolio (no errors in console)
3. Go to: `http://localhost:3000/login`
4. Try logging in with your Firebase credentials

---

## ✅ Verification Checklist

- [ ] File is named exactly `.env.local` (with the dot at the start)
- [ ] File is in the project root folder (same level as `package.json`)
- [ ] All 6 variables are present
- [ ] All placeholders are replaced with actual values
- [ ] No quotes around values
- [ ] No spaces before or after `=`
- [ ] Dev server was restarted after creating the file

---

## 🆘 Troubleshooting

### "Firebase is not configured"
- Check file is named `.env.local` (not `env.local` or `.env.local.txt`)
- Verify it's in the project root (not inside `src/` folder)
- Restart dev server

### "Invalid API key"
- Double-check you copied the complete API key
- Make sure no extra spaces or line breaks
- Verify the key is from the correct Firebase project

### "Auth domain not found"
- Make sure format is: `your-project.firebaseapp.com`
- Should end with `.firebaseapp.com`
- No `https://` at the beginning

---

## 📁 File Location

```
myportfolio/
├── .env.local          ← Create this file HERE
├── .gitignore
├── package.json
├── src/
│   └── ...
└── ...
```

---

## 🔒 Security

✅ `.env.local` is already in `.gitignore`  
✅ Will NOT be committed to Git  
✅ Safe to store locally  
❌ NEVER share this file publicly  
❌ NEVER commit to GitHub  

---

## 🚀 For Vercel Deployment

When deploying to Vercel, you'll add these same variables in:

**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add each one individually (same names, same values).

---

## 💡 Quick Copy Template

Just replace the values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

**Need help? Check that your Firebase project has:**
- ✅ Authentication enabled (Email/Password)
- ✅ Firestore Database created
- ✅ Storage enabled
- ✅ Web app registered

See `FIREBASE_QUICK_START.md` for Firebase setup help.

