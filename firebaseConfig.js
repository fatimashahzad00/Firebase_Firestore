import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyAl6z3SnjEmvoaOUY3I38WwVm-ET4TmZEs",
  authDomain: "projects-56f17.firebaseapp.com",
  projectId: "projects-56f17",
  storageBucket: "projects-56f17.firebasestorage.app",
  messagingSenderId: "986856572039",
  appId: "1:986856572039:web:c60dbaf2e139cb1336a422"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(app);
console.log(db);

export{db, doc, getDocs, collection, addDoc, deleteDoc, updateDoc, serverTimestamp, query, where, onSnapshot}

