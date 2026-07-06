// src/firebaseAdmin.js
// Auth and Storage are only needed by the /admin CMS, split out of
// firebase.js so the public bundle doesn't pay for them.
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { app } from "./firebase";

export const auth = getAuth(app);
export const storage = getStorage(app);
