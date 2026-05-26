import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCXDJrFmn-pzbqys91tj4Fruqn4tl58p9Y",
  authDomain: "wildsaura-1ef8a.firebaseapp.com",
  databaseURL: "https://wildsaura-1ef8a-default-rtdb.firebaseio.com",
  projectId: "wildsaura-1ef8a",
  storageBucket: "wildsaura-1ef8a.firebasestorage.app",
  messagingSenderId: "690017200836",
  appId: "1:690017200836:web:e2c24713868a943b6ff791",
  measurementId: "G-VM7GYYJMCC"
};

// Prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
