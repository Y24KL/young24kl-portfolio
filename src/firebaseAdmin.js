// src/firebaseAdmin.js
// Auth and Storage are only needed by the /admin CMS, split out of
// firebase.js so the public bundle doesn't pay for them.
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { app, useEmulators } from "./firebase";

export const auth = getAuth(app);
export const storage = getStorage(app);

if (useEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}
