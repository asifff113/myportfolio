# New Features Implementation Plan

## 1. Digital Guestbook 📖
**Goal:** Allow visitors to sign in with GitHub and leave a message.
**Tech:** Supabase Auth + Firestore/Supabase DB.
**Tasks:**
- [ ] Create `guestbook_messages` table in Supabase.
- [ ] Create `GuestbookSection` component.
- [ ] Implement "Sign in with GitHub" button.
- [ ] Implement message form and list.
- [ ] Add RLS policies (anyone can read, authenticated can create).

## 2. Project Deep Dive Modals 🔍
**Goal:** Show detailed info for projects in a modal.
**Tech:** Framer Motion AnimatePresence.
**Tasks:**
- [ ] Update `projects` table schema to include `problem`, `solution`, `challenges`.
- [ ] Create `ProjectModal` component.
- [ ] Update `ProjectsSection` to handle modal state.
- [ ] Add "View Case Study" button to project cards.

## 3. Live GitHub Activity Graph 🟩
**Goal:** Show real contribution graph.
**Tech:** `react-activity-calendar` or custom SVG.
**Tasks:**
- [ ] Create `GitHubGraph` component.
- [ ] Fetch data from GitHub API (or use a proxy/scraper).
- [ ] Style it to match the neon/futuristic theme.

## 4. Dynamic OG Images 🖼️
**Goal:** Custom social share images.
**Tech:** `@vercel/og`.
**Tasks:**
- [ ] Add `opengraph-image.tsx` to `app/`.
- [ ] Design the image template (Title, Tech Stack, Name).

## 5. Internationalization (i18n) 🌍
**Goal:** Language switcher.
**Tech:** `next-intl` or simple context-based solution.
**Tasks:**
- [ ] Set up dictionary files (`en.json`, `es.json`).
- [ ] Create `LanguageContext`.
- [ ] Replace hardcoded text with translation keys.
