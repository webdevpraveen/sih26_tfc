# SIH 2026 | SRMU × Tech Fusion Club

> Smart India Hackathon 2026 — Internal Hackathon Portal  
> Organized by **Tech Fusion Club**, Shri Ramswaroop Memorial University

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone <repo-url>
cd sih26_tfc

# 2. Install dependencies
npm install

# 3. Setup Firebase (see below)
cp .env.example .env
# Fill in your Firebase config values

# 4. Run development server
npm run dev
```

## 🔧 Firebase Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project** → Name it `sih26-srmu` → Create
3. **Enable Authentication:**
   - Go to Build → Authentication → Get Started
   - Enable **Email/Password** provider
   - Go to Users tab → **Add User** → Enter YOUR admin email & password
4. **Create Firestore Database:**
   - Go to Build → Firestore Database → Create Database
   - Start in **test mode** (we'll add rules later)
5. **Get Web App Config:**
   - Go to Project Settings (⚙️) → General → Scroll down
   - Click **Add App** → Web (</>) → Register app
   - Copy the config object values to your `.env` file
6. **Add Firestore Security Rules:**
   - Go to Firestore → Rules → Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read
    match /{document=**} {
      allow read: if true;
    }
    // Only authenticated users can write
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## 📁 Project Structure

```
src/
├── components/     → Navbar, Footer, ProtectedRoute
├── config/         → Firebase initialization
├── contexts/       → Auth state management
├── data/           → Static SIH theme data
├── hooks/          → Firestore CRUD hooks
├── pages/          → Public pages + Admin panel
│   └── admin/      → Dashboard, Manage Notices/Teams/Timeline
└── index.css       → Global design system
```

## 🔐 Security

- Firebase Auth handles authentication (no passwords in code)
- Firebase API keys are project identifiers, NOT secrets
- Firestore Security Rules block unauthorized writes
- Even with full source code access, no one can login without YOUR credentials

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Add environment variables in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Deploy! 🎉

## 📋 Admin Panel

Access at `/admin/login` with your Firebase Auth credentials.

Features:
- 📢 **Manage Notices** — Add/Edit/Delete announcements with priority levels
- 👥 **Manage Teams** — Track registered teams with members and problem statements
- 📅 **Manage Timeline** — Update event dates and milestones

---

Built with ❤️ by Tech Fusion Club, SRMU
