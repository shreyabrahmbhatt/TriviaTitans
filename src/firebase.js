// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC0yUfchubjPRvk9CsWSvqkGL3mtOASWY",
  authDomain: "project-e2507.firebaseapp.com",
  projectId: "project-e2507",
  storageBucket: "project-e2507.appspot.com",
  messagingSenderId: "904689382956",
  appId: "1:904689382956:web:e4a3729f6c06e063a68389"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);