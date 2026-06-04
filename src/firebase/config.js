import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcvrLv-mkDg3N3zUQr-YEGhfLaYiNwNB4",
  authDomain: "bilisa-s-archive.firebaseapp.com",
  projectId: "bilisa-s-archive",
  storageBucket: "bilisa-s-archive.firebasestorage.app",
  messagingSenderId: "369696426390",
  appId: "1:369696426390:web:284c7bdc149b60766675b7",
  measurementId: "G-BYCJ8HCBL3"
};

// Initialize Firebase
console.log('Initializing Firebase with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app);
const analytics = getAnalytics(app);
console.log('Firebase analytics initialized:', analytics);

// Initialize Firebase services
export const auth = getAuth(app);
console.log('Firebase auth initialized:', auth);
export const db = getFirestore(app);
console.log('Firebase Firestore initialized:', db);
export const storage = getStorage(app);
console.log('Firebase Storage initialized:', storage);

export default app;
