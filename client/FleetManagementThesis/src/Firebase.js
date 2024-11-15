import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtZd5eYWlyZ8bJS3crweBRKhWKss-BcWk",
  authDomain: "thesis-demo-87a8e.firebaseapp.com",
  databaseURL:
    "https://thesis-demo-87a8e-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "thesis-demo-87a8e",
  storageBucket: "thesis-demo-87a8e.appspot.com",
  messagingSenderId: "742717130814",
  appId: "1:742717130814:web:de4d15a9a2396434d8a96f",
  measurementId: "G-FLPKNZ1WV3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

// Export Firebase services
export { app, auth, database, firestore, ref, onValue };
