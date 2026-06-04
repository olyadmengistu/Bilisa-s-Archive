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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
