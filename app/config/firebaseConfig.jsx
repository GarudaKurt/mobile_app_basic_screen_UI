// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkQQUn9G-IpF43pe5XBmqwYmswYjFMYbE",
  authDomain: "anti-cheating-ai.firebaseapp.com",
  projectId: "anti-cheating-ai",
  storageBucket: "anti-cheating-ai.firebasestorage.app",
  messagingSenderId: "1010480110510",
  appId: "1:1010480110510:web:678b36babb807ed4cb063f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
