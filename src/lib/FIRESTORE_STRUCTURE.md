# Firestore Database Structure

This document outlines the Firestore collections and document structure for the portfolio application.

## Collections Overview

```
portfolio-db/
├── personalInfo (singleton collection)
│   └── main (document)
├── skillCategories (collection)
│   └── {categoryId} (documents)
├── education (collection)
│   └── {educationId} (documents)
├── experience (collection)
│   └── {experienceId} (documents)
├── projects (collection)
│   └── {projectId} (documents)
├── achievements (collection)
│   └── {achievementId} (documents)
├── certificates (collection)
│   └── {certificateId} (documents)
├── gallery (collection)
│   └── {galleryItemId} (documents)
├── hobbies (collection)
│   └── {hobbyId} (documents)
├── futureGoals (collection)
│   └── {goalId} (documents)
├── testimonials (collection)
│   └── {testimonialId} (documents)
├── blogPosts (collection)
│   └── {postId} (documents)
└── contactInfo (singleton collection)
    └── main (document)
```

## Collection Details

### 1. personalInfo (Singleton)

Single document containing personal information.

**Document ID:** `main`

**Fields:**
- `name` (string)
- `headline` (string)
- `shortBio` (string)
- `longBio` (string)
- `profileImageUrl` (string)
- `resumeUrl` (string, optional)
- `location` (string)
- `email` (string)
- `phone` (string, optional)
- `currentStatus` (string, optional)
- `socialLinks` (array of objects)
  - `platform` (string)
  - `url` (string)
  - `username` (string, optional)
- `updatedAt` (timestamp)

---

### 2. skillCategories

Collection of skill categories with nested skills.

**Document Structure:**
- `name` (string)
- `description` (string, optional)
- `order` (number, for sorting)
- `color` (string, optional)
- `skills` (array of objects)
  - `name` (string)
  - `level` (number, 0-100)
  - `yearsOfExperience` (number, optional)
  - `description` (string, optional)

**Query:** Order by `order` field

---

### 3. education

Collection of education items.

**Document Structure:**
- `institution` (string)
- `degree` (string)
- `field` (string, optional)
- `startDate` (timestamp or string)
- `endDate` (timestamp or string, optional)
- `isCurrent` (boolean, optional)
- `description` (string, optional)
- `grade` (string, optional)
- `location` (string, optional)
- `logoUrl` (string, optional)
- `order` (number)

**Query:** Order by `order` or `startDate` (descending)

---

### 4. experience

Collection of work experience items.

**Document Structure:**
- `role` (string)
- `company` (string)
- `companyUrl` (string, optional)
- `location` (string)
- `startDate` (timestamp or string)
- `endDate` (timestamp or string, optional)
- `isCurrent` (boolean)
- `description` (string)
- `technologies` (array of strings)
- `type` (string: "Full-time", "Part-time", "Internship", "Freelance")
- `logoUrl` (string, optional)
- `order` (number)

**Query:** Order by `order` or `startDate` (descending)

---

### 5. projects

Collection of project showcase items.

**Document Structure:**
- `title` (string)
- `slug` (string, unique)
- `summary` (string)
- `description` (string)
- `imageUrl` (string)
- `techStack` (array of strings)
- `githubUrl` (string, optional)
- `liveUrl` (string, optional)
- `type` (string)
- `featured` (boolean)
- `startDate` (timestamp or string, optional)
- `endDate` (timestamp or string, optional)
- `status` (string)
- `order` (number)
- `createdAt` (timestamp)

**Queries:**
- Featured projects: Where `featured == true`
- All projects: Order by `order` or `createdAt` (descending)

---

### 6. achievements

Collection of achievements and awards.

**Document Structure:**
- `title` (string)
- `organization` (string)
- `date` (timestamp or string)
- `description` (string, optional)
- `category` (string, optional)
- `iconUrl` (string, optional)
- `certificateUrl` (string, optional)
- `order` (number)

**Query:** Order by `date` (descending) or `order`

---

### 7. certificates

Collection of professional certificates.

**Document Structure:**
- `title` (string)
- `issuer` (string)
- `issuedDate` (timestamp or string)
- `expiryDate` (timestamp or string, optional)
- `fileUrl` (string) - URL to PDF/image
- `previewImageUrl` (string, optional)
- `credentialId` (string, optional)
- `credentialUrl` (string, optional)
- `description` (string, optional)
- `skills` (array of strings, optional)
- `order` (number)

**Query:** Order by `issuedDate` (descending) or `order`

---

### 8. gallery

Collection of gallery images.

**Document Structure:**
- `title` (string)
- `description` (string, optional)
- `imageUrl` (string)
- `category` (string, optional)
- `date` (timestamp or string, optional)
- `order` (number)

**Query:** Order by `order` or `date` (descending)

---

### 9. hobbies

Collection of hobbies and interests.

**Document Structure:**
- `title` (string)
- `description` (string)
- `icon` (string, optional)
- `imageUrl` (string, optional)
- `order` (number)

**Query:** Order by `order`

---

### 10. futureGoals

Collection of future goals and aspirations.

**Document Structure:**
- `title` (string)
- `description` (string)
- `timeframe` (string)
- `category` (string)
- `priority` (string)
- `status` (string)
- `order` (number)

**Query:** Order by `order` or `priority`

---

### 11. testimonials

Collection of testimonials and recommendations.

**Document Structure:**
- `name` (string)
- `role` (string)
- `company` (string, optional)
- `avatarUrl` (string, optional)
- `quote` (string)
- `rating` (number, 1-5, optional)
- `date` (timestamp or string, optional)
- `linkedInUrl` (string, optional)
- `order` (number)

**Query:** Order by `order` or `date` (descending)

---

### 12. blogPosts

Collection of blog posts (optional feature).

**Document Structure:**
- `title` (string)
- `slug` (string, unique)
- `excerpt` (string)
- `content` (string)
- `coverImageUrl` (string, optional)
- `author` (string, optional)
- `publishedDate` (timestamp or string)
- `updatedDate` (timestamp or string, optional)
- `tags` (array of strings)
- `readTime` (number)
- `published` (boolean)
- `views` (number, optional)
- `order` (number)

**Queries:**
- Published posts: Where `published == true`
- Order by `publishedDate` (descending)

---

### 13. contactInfo (Singleton)

Single document containing contact information.

**Document ID:** `main`

**Fields:**
- `email` (string)
- `phone` (string, optional)
- `location` (string)
- `availability` (string, optional)
- `preferredContactMethod` (string, optional)
- `responseTime` (string, optional)
- `socialLinks` (array of objects)
- `enableContactForm` (boolean)
- `formSuccessMessage` (string, optional)
- `formErrorMessage` (string, optional)

---

## Firebase Storage Structure

Files uploaded through the admin dashboard will be stored in Firebase Storage:

```
portfolio-storage/
├── profile/
│   └── profile-image.jpg
├── projects/
│   ├── project1-screenshot.jpg
│   ├── project2-screenshot.jpg
│   └── ...
├── certificates/
│   ├── cert1.pdf
│   ├── cert2.pdf
│   └── ...
├── gallery/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── blog/
│   ├── cover1.jpg
│   └── ...
└── resumes/
    └── resume.pdf
```

## Security Rules (Firestore)

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

## Security Rules (Storage)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only authenticated users can write
    match /{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## Indexes

Consider creating composite indexes for:

1. **projects**: `featured` (ascending) + `createdAt` (descending)
2. **blogPosts**: `published` (ascending) + `publishedDate` (descending)
3. **experience**: `order` (ascending) + `startDate` (descending)

Firestore will prompt you to create these indexes when needed.

## Best Practices

1. **Use order fields** for custom sorting instead of relying on document IDs
2. **Store URLs**, not file data directly in Firestore
3. **Use timestamps** for dates when possible (better for queries)
4. **Keep documents small** - max 1MB per document
5. **Denormalize data** when necessary for performance
6. **Use batch writes** for multiple updates in admin forms
7. **Add createdAt/updatedAt** timestamps for audit trails

