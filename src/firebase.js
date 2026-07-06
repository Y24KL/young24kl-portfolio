// src/firebase.js
// Only Firestore is initialized here since this module is imported by the
// public-facing Portfolio page — keep firebase/auth and firebase/storage
// out of the main bundle (see firebaseAdmin.js, used only by /admin).
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCJLnkOII7ELF0fruYAOuWKiAc73VlZp8",
  authDomain: "young24kl.firebaseapp.com",
  projectId: "young24kl",
  storageBucket: "young24kl.appspot.com",
  messagingSenderId: "611120607062",
  appId: "1:611120607062:web:a98ede455670c8bc9830f7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
