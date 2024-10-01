import { initializeApp} from "firebase/app"
import { ref, onValue, getDatabase} from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyBzw7SaK2OrMH4CDeOFxfhFm1AaeAetjNY",
    authDomain: "fleeting-management-183e9.firebaseapp.com",
    databaseURL: "https://fleeting-management-183e9-default-rtdb.firebaseio.com",
    projectId: "fleeting-management-183e9",
    storageBucket: "fleeting-management-183e9.appspot.com",
    messagingSenderId: "870293032353",
    appId: "1:870293032353:web:a991fbdb7fb63b9ad40fe0",
    measurementId: "G-MVFF55613G"
  };

// Initializing Firebase
const app = initializeApp(firebaseConfig);

// Initilaing Realtime Database 
const database = getDatabase(app);

export {database, ref, onValue};