import { initializeApp } from "firebase/app";
import { ref, onValue, getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBtZd5eYWlyZ8bJS3crweBRKhWKss-BcWk",
  databaseURL:
    "https://thesis-demo-87a8e-default-rtdb.asia-southeast1.firebasedatabase.app/",
  authDomain: "thesis-demo-87a8e.firebaseapp.com",
  projectId: "thesis-demo-87a8e",
  storageBucket: "thesis-demo-87a8e.appspot.com",
  messagingSenderId: "742717130814",
  appId: "1:742717130814:web:de4d15a9a2396434d8a96f",
  measurementId: "G-FLPKNZ1WV3",
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);

// Initilaing Realtime Database
const database = getDatabase(app);

export { database, ref, onValue };
