# 🚀 GetFit App - Deployment Guide

## Prerequisites

1. **Firebase CLI installed**
   ```bash
   npm install -g firebase-tools
   ```

2. **Logged into Firebase**
   ```bash
   firebase login
   ```

3. **Firebase project created** (already done: getfit-31e8c)

## 📦 Deployment Steps

### 1. Initialize Firebase (if not already done)
```bash
firebase init
```
- Select: Hosting, Firestore
- Choose existing project: getfit-31e8c
- Public directory: apps/web
- Configure as single-page app: Yes
- Don't overwrite index.html: No

### 2. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 3. Deploy the Web App
```bash
firebase deploy --only hosting
```

### 4. Deploy Everything
```bash
firebase deploy
```

## 🌐 Your Live URLs

After deployment:
- **Hosting URL**: https://getfit-31e8c.web.app
- **Firebase Console**: https://console.firebase.google.com/project/getfit-31e8c

## 📋 What Gets Deployed

- `apps/web/index.html` - Main application
- `apps/web/manifest.json` - PWA manifest
- `apps/web/sw.js` - Service Worker
- `apps/web/public/*` - Logo and assets
- Firestore security rules

## ✅ Post-Deployment Checklist

1. ✅ Test the live URL
2. ✅ Verify PWA install prompt works
3. ✅ Test authentication (login/register)
4. ✅ Test all features:
   - Dashboard
   - Workouts
   - Nutrition tracking
   - Health tracking
   - Social features
   - Settings

## 🔧 Update Deployment

To update the app after making changes:

```bash
# Quick deploy
firebase deploy --only hosting

# Or full deploy (including rules)
firebase deploy
```

## 📱 PWA Installation

Once deployed, users can:
1. Visit the URL in their browser
2. Click "Install App" button (appears on supported browsers)
3. Add to home screen on mobile devices

## 🔒 Security

All Firebase credentials are already configured in:
- `apps/web/index.html` (inline Firebase config)
- Firestore security rules in `firestore.rules`

## 🆘 Troubleshooting

### Issue: 404 on refresh
**Solution**: Already configured with rewrites in firebase.json

### Issue: Assets not loading
**Solution**: Check that public folder contains all files

### Issue: Authentication not working
**Solution**: Verify Firebase config credentials in index.html

## 📊 Firebase Console

Monitor your app:
- **Authentication**: Track users and sign-ins
- **Firestore**: View database collections
- **Hosting**: Check deployment history
- **Analytics**: View app usage

---

**Project ID**: getfit-31e8c  
**Region**: us-central  
**Version**: 1.0.0

