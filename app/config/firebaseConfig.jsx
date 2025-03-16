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
  apiKey: "AIzaSyBbtSIieSDMrlBf6kOOoyGQ1u2zKUjAaDk",
  authDomain: "smart-irrigation-79b37.firebaseapp.com",
  databaseURL: "https://smart-irrigation-79b37-default-rtdb.firebaseio.com",
  projectId: "smart-irrigation-79b37",
  storageBucket: "smart-irrigation-79b37.firebasestorage.app",
  messagingSenderId: "951804167298",
  appId: "1:951804167298:web:2f436c32a8cda7256da09b"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
