// src/firebase.js
// Only Firestore is initialized here since this module is imported by the
// public-facing Portfolio page — keep firebase/auth and firebase/storage
// out of the main bundle (see firebaseAdmin.js, used only by /admin).
//
// The web config below is a public client identifier, not a secret: access is
// enforced by firestore.rules / storage.rules. Values can be overridden with
// VITE_FIREBASE_* variables (see .env.example).
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const env = import.meta.env;

export const useEmulators = env.VITE_USE_FIREBASE_EMULATORS === "true";

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBCJLnkOII7ELF0fruYAOuWKiAc73VlZp8",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "young24kl.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "young24kl",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "young24kl.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "611120607062",
  appId: env.VITE_FIREBASE_APP_ID || "1:611120607062:web:a98ede455670c8bc9830f7",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

if (useEmulators) {
  connectFirestoreEmulator(db, "127.0.0.1", 8085);
}
