// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA7h3xBXLb434Jf0F1ZxcZnkrXoySIHWVc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "getfit-31e8c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "getfit-31e8c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "getfit-31e8c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "672703837611",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:672703837611:web:914698ec2a808420baceee",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JCYL99LSGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
