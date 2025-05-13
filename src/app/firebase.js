// lib/firebase.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';  // Import Firestore functions

const firebaseConfig = {
    apiKey: "AIzaSyC0leZhye4-Keu_Io_SfV3oPpTNoFASOg8",
    authDomain: "company-35b12.firebaseapp.com",
    projectId: "company-35b12",
    storageBucket: "company-35b12.appspot.com",
    messagingSenderId: "115323742952",
    appId: "1:115323742952:web:5296b8e92b5a56076eb75d",
    databaseURL: "https://company-35b12-default-rtdb.firebaseio.com", // Optional if using RTDB
};

// Initialize Firebase only if not initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

// Export Firestore functions
export { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc };
