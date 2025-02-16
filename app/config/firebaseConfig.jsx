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
  apiKey: "AIzaSyB36LsMDfa7VNTvs_VXoKX7Gf6keunZTGM",
  authDomain: "ucmn-ee.firebaseapp.com",
  databaseURL: "https://ucmn-ee-default-rtdb.firebaseio.com",
  projectId: "ucmn-ee",
  storageBucket: "ucmn-ee.firebasestorage.app",
  messagingSenderId: "237293148697",
  appId: "1:237293148697:web:52d34ddacc1f09c20a6888"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
