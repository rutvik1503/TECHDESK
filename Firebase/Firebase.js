// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAEX38pjXaZFl8vG1dB5LBDKLnmNBb0_Q",
  authDomain: "techdesk-df699.firebaseapp.com",
  projectId: "techdesk-df699",
  storageBucket: "techdesk-df699.firebasestorage.app",
  messagingSenderId: "723846439625",
  appId: "1:723846439625:web:e3f0b5450cdbd1b9882318",
  measurementId: "G-1M9M6BMFHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)