// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlR3I8bb5WCk9tLkSLXq_903LO_GmcFos",
  authDomain: "recipefinder-4bf74.firebaseapp.com",
  databaseURL: "https://recipefinder-4bf74-default-rtdb.firebaseio.com",
  projectId: "recipefinder-4bf74",
  storageBucket: "recipefinder-4bf74.appspot.com",
  messagingSenderId: "748268639671",
  appId: "1:748268639671:web:392fa0ca7e3473820dc432",
  measurementId: "G-RGHD7GELMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);