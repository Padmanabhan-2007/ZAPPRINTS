import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBBfvsivUw8yPMD8h9oc-KQutPgrxxjXbM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zapprints.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zapprints",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zapprints.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "332984418818",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:332984418818:web:d68497b098244a44f3dd1b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PQ5GQPS6TC"
};

// Fail clearly if variables are missing in production
const isProduction = import.meta.env.PROD;
const isPlaceholder = firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY";
if (isProduction && isPlaceholder) {
  throw new Error("Firebase Web Client environment variables missing in production!");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default auth;
