// firebase.js
// Use modern ES Module imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// !!! REPLACE WITH YOUR OWN SECURE FIREBASE CONFIG !!!
const firebaseConfig = {
  apiKey: "AIzaSyCmZyuCECvOS75LRFU35TNeaen60c35-UE",
  authDomain: "disaster-arcade.firebaseapp.com",
  projectId: "disaster-arcade",
  storageBucket: "disaster-arcade.firebasestorage.app",
  messagingSenderId: "693729201781",
  appId: "1:693729201781:web:bd7ae8710a8766ada5b23c",
  measurementId: "G-Z1T06YW2F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to save game score
async function saveScore(userId = 'anon', payload = {}) {
  try {
    const docRef = await addDoc(collection(db, "scores"), {
      userId,
      ...payload,
      timestamp: new Date()
    });
    console.log("Score saved with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Expose the function to the global scope so app.js can use it
window.saveScore = saveScore;