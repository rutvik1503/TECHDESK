// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqS7waEpMNgsg4g-6SR-3EJ7Dq_duVMOE",
  authDomain: "fir-practice-41c9a.firebaseapp.com",
  projectId: "fir-practice-41c9a",
  storageBucket: "fir-practice-41c9a.firebasestorage.app",
  messagingSenderId: "635840162995",
  appId: "1:635840162995:web:0ddc09d59e54dd9b1b14c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)