// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLXsoaSuTZ4k3PnxetRZG1bqqsAzq4jLQ",
  authDomain: "web-application-217a2.firebaseapp.com",
  databaseURL: "https://web-application-217a2-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "web-application-217a2",
  storageBucket: "web-application-217a2.firebasestorage.app",
  messagingSenderId: "849618511625",
  appId: "1:849618511625:web:404e52f47062e7ea7ed5d8",
  measurementId: "G-XD66QFGFF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize authentication
const auth = getAuth(app);
// Initialize realtime database
const db = getDatabase(app);
// Export
export { auth, db };