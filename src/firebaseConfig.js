// src/firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";   // <-- Firestore added

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6CYMFdn7ZQGe0tzKFCj6lbe9BX5rFVKw",
  authDomain: "dog-slideshow.firebaseapp.com",
  projectId: "dog-slideshow",
  storageBucket: "dog-slideshow.firebasestorage.app", 
  messagingSenderId: "793322066556",
  appId: "1:793322066556:web:08d209280f1217b01e2ff9",
  measurementId: "G-JXZQTB40YY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional analytics (safe in browsers only)
try {
  getAnalytics(app);
} catch (err) {
  // Analytics may fail on non-browser environments → safe to ignore
}

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

// Export everything needed across your app
export { app, auth, googleProvider, db };
