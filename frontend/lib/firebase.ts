import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC-aOAUZq2eTZTaIdZa0RXLaqOdN4Bflbg",
  authDomain: "msh-f8a88.firebaseapp.com",
  projectId: "msh-f8a88",
  storageBucket: "msh-f8a88.firebasestorage.app",
  messagingSenderId: "559260445759",
  appId: "1:559260445759:web:25af9f81a3630675b01c8a",
  measurementId: "G-TPQ98RBSSF"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics conditionally (only in browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics };
