// firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics"; // If you need analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0ewRCRF-ALGVBLJSsDOgRX9XubQKVRC0",
  authDomain: "andhagovi-9b109.firebaseapp.com",
  databaseURL: "https://andhagovi-9b109-default-rtdb.firebaseio.com",
  projectId: "andhagovi-9b109",
  storageBucket: "andhagovi-9b109.appspot.com",
  messagingSenderId: "716051900133",
  appId: "1:716051900133:web:e3de8f6a4c34aa8113160c",
  measurementId: "G-29JSPH52NB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app); // If you need analytics

export { auth, database, analytics };
