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

const firebaseConfig = {
  apiKey: "AIzaSyBjhAuT0ozWZRXIEYXg3x97f6vAHJaKU5c",
  authDomain: "ucb-smart-irrigation.firebaseapp.com",
  databaseURL: "https://ucb-smart-irrigation-default-rtdb.firebaseio.com",
  projectId: "ucb-smart-irrigation",
  storageBucket: "ucb-smart-irrigation.firebasestorage.app",
  messagingSenderId: "644840671203",
  appId: "1:644840671203:web:c53dcecef7fa4d9e1682d6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
