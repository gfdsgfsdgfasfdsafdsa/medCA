import { initializeApp } from "firebase/app";
import {getAuth ,onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNf-chg8B2qMAtHAiL1KzLLEtraeZ6nVM",
  authDomain: "medca-4a0f2.firebaseapp.com",
  databaseURL: "https://medca-4a0f2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "medca-4a0f2",
  storageBucket: "medca-4a0f2.appspot.com",
  messagingSenderId: "97863082220",
  appId: "1:97863082220:web:c99d74ca220dfb9c78c5c9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth()
export {
    db,
    auth,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
}