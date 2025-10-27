# ⚡ Quick Start - Firebase Setup

## 🚨 Action Required!

To use Firebase authentication and secure your credentials, follow these steps:

---

## Step 1: Create `.env.local` File

In your project root (`C:\Users\DELL\Desktop\Hytel BootCamp\`), create a file named **`.env.local`** and paste this content:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyA7h3xBXLb434Jf0F1ZxcZnkrXoySIHWVc
VITE_FIREBASE_AUTH_DOMAIN=getfit-31e8c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=getfit-31e8c
VITE_FIREBASE_STORAGE_BUCKET=getfit-31e8c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=672703837611
VITE_FIREBASE_APP_ID=1:672703837611:web:914698ec2a808420baceee
VITE_FIREBASE_MEASUREMENT_ID=G-JCYL99LSGC
```

---

## Step 2: Install Firebase Dependencies

Run this command in your terminal:

```bash
pnpm install firebase
```

or if using npm:

```bash
npm install firebase
```

---

## Step 3: Restart Your Development Server

After creating `.env.local`, restart your dev server:

```bash
pnpm run dev
```

---

## ✅ What's Been Set Up

1. ✅ **Firebase Config** - Updated to use environment variables
2. ✅ **Authentication Context** - Ready to use with `useAuth()` hook
3. ✅ **Protected Routes** - Component for securing routes
4. ✅ **Auth, Firestore, Storage** - All initialized and exported
5. ✅ **`.gitignore`** - Already configured to protect `.env.local`

---

## 📖 Next Steps

See **`FIREBASE_SETUP.md`** for complete documentation including:
- How to set up Firestore security rules
- How to enable authentication methods
- How to use the `useAuth()` hook
- Database structure recommendations
- Security best practices

---

## 🎯 Ready to Use!

Once you've created `.env.local` and restarted your server, Firebase will be ready!

Your credentials are now:
- ✅ Stored in environment variables
- ✅ Protected from version control
- ✅ Working with fallback values for development

**Don't forget to set up security rules in Firebase Console before deploying to production!**

