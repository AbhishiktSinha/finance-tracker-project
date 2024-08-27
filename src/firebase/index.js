// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBzes0uYMfpe4jpNfCdP3B8Mg3hU0lKws",
  authDomain: "finance-tracker-may.firebaseapp.com",
  projectId: "finance-tracker-may",
  storageBucket: "finance-tracker-may.appspot.com",
  messagingSenderId: "495885249699",
  appId: "1:495885249699:web:702042a6ad8f27bdd12316",
  measurementId: "G-SC5DS495DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
    db,
    auth,
    provider,    
}