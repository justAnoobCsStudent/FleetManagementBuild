import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9mRWr6iPukag_UELFYwfxV__KAL9DJhc",
  authDomain: "test-66db7.firebaseapp.com",
  databaseURL:
    "https://test-66db7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-66db7",
  storageBucket: "test-66db7.firebasestorage.app",
  messagingSenderId: "807322925191",
  appId: "1:807322925191:web:5bb11b1727af19e3536022",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

// Export Firebase services
export { app, auth, database, firestore, ref, onValue };
