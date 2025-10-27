# 🔥 Firebase Setup Guide for GetFit

## Overview
Your GetFit app is now configured to use Firebase for:
- **Authentication** (Email/Password & Google Sign-in)
- **Firestore Database** (User data, workouts, nutrition logs)
- **Cloud Storage** (Profile pictures, workout images)
- **Analytics** (User behavior tracking)

---

## 📋 Setup Instructions

### 1. Create Environment Variables File

Create a file named `.env.local` in your project root with your Firebase credentials:

```bash
# Firebase Configuration
# DO NOT commit this file to version control
VITE_FIREBASE_API_KEY=AIzaSyA7h3xBXLb434Jf0F1ZxcZnkrXoySIHWVc
VITE_FIREBASE_AUTH_DOMAIN=getfit-31e8c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=getfit-31e8c
VITE_FIREBASE_STORAGE_BUCKET=getfit-31e8c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=672703837611
VITE_FIREBASE_APP_ID=1:672703837611:web:914698ec2a808420baceee
VITE_FIREBASE_MEASUREMENT_ID=G-JCYL99LSGC
```

**Note**: The `.env.local` file is already in `.gitignore` and won't be committed to version control.

---

## 🔐 Firebase Security Rules

### Firestore Rules
Set these rules in your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workouts collection
    match /workouts/{workoutId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Nutrition logs
    match /nutrition/{nutritionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Activity logs
    match /activities/{activityId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Public challenges (readable by all, writable by authenticated users)
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.creatorId;
    }
  }
}
```

### Storage Rules
Set these rules in Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile pictures
    match /users/{userId}/profile/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workout images
    match /workouts/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔑 Authentication Setup

### Enable Authentication Methods in Firebase Console

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Enable **Google** (optional but recommended)

---

## 📚 Using Authentication in Your App

### Wrap Your App with AuthProvider

Update `src/main.tsx`:

\`\`\`typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';
import './styles/pages.css';
import './styles/social-settings.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
\`\`\`

### Use Protected Routes

Update `src/App.tsx` to protect your routes:

\`\`\`typescript
import ProtectedRoute from './components/auth/ProtectedRoute';

// ... in your Routes:
<Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/workouts" element={<Workouts />} />
  // ... other protected routes
</Route>
\`\`\`

### Use Authentication in Components

\`\`\`typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { currentUser, login, logout, signup } = useAuth();
  
  // Use currentUser to check authentication state
  // Use login, logout, signup for auth actions
}
\`\`\`

---

## 🛠️ Available Authentication Methods

```typescript
const {
  currentUser,        // Current logged-in user
  loading,            // Loading state
  signup,             // (email, password, displayName) => Promise<void>
  login,              // (email, password) => Promise<void>
  logout,             // () => Promise<void>
  resetPassword,      // (email) => Promise<void>
  signInWithGoogle,   // () => Promise<void>
  updateUserProfile   // (displayName, photoURL) => Promise<void>
} = useAuth();
```

---

## 📊 Firestore Database Structure

Recommended collections:

```
users/
  {userId}/
    - email
    - displayName
    - photoURL
    - createdAt
    - goals (array)
    - stats (object)

workouts/
  {workoutId}/
    - userId
    - title
    - category
    - duration
    - calories
    - completedAt
    
nutrition/
  {nutritionId}/
    - userId
    - mealType
    - name
    - calories
    - date

activities/
  {activityId}/
    - userId
    - type
    - distance
    - duration
    - date

challenges/
  {challengeId}/
    - name
    - description
    - creatorId
    - participants (array)
    - startDate
    - endDate
```

---

## 🔒 Security Best Practices

1. ✅ **Environment variables are already set up** - Don't commit `.env.local`
2. ✅ **`.gitignore` is configured** - Your credentials are safe
3. ⚠️ **Set up Firestore security rules** - Protect user data
4. ⚠️ **Set up Storage security rules** - Control file access
5. 💡 **Enable Firebase App Check** (optional) - Extra security layer
6. 💡 **Set up rate limiting** - Prevent abuse

---

## 🚀 Next Steps

1. Create `.env.local` file with your credentials
2. Set up Firestore security rules
3. Set up Storage security rules
4. Wrap your app with `AuthProvider`
5. Update login/register pages to use `useAuth()`
6. Test authentication flow
7. Deploy your security rules to production

---

## 📖 Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Security](https://firebase.google.com/docs/storage/security)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## ⚠️ Important Notes

- **Never commit your `.env.local` file**
- **Always use environment variables in production**
- **Set up proper security rules before deploying**
- **Test authentication flow thoroughly**
- **Monitor Firebase usage in the console**

Your Firebase is now ready to use! 🎉

