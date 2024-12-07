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
  apiKey: "AIzaSyCf_yEMzkxTZTZvhxnIUfZl3rlqdWRE9Yo",
  authDomain: "iot-healthcare-72d91.firebaseapp.com",
  databaseURL: "https://iot-healthcare-72d91-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-healthcare-72d91",
  storageBucket: "iot-healthcare-72d91.firebasestorage.app",
  messagingSenderId: "471416816452",
  appId: "1:471416816452:web:8e49d9695f3b8755044d11"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
