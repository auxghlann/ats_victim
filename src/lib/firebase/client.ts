import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  inMemoryPersistence,
  setPersistence,
  Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Returns the initialized client Firebase app, or null if credentials are not configured.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) {
    return null;
  }
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

/**
 * Returns the client Firebase Auth instance configured with inMemoryPersistence.
 * This ensures the client does not persist tokens in IndexedDB, as httpOnly session
 * cookies act as the authoritative single source of truth.
 */
export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;

  const auth = getAuth(app);
  // Configure in-memory persistence for httpOnly cookie architecture per Firebase docs
  setPersistence(auth, inMemoryPersistence).catch(() => {
    // Ignore persistence configuration errors on initial load
  });
  return auth;
}

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: "select_account" });
