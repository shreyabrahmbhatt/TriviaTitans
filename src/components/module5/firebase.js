// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCmpzH8nrsTBOD9keEVP9AZjOZkyqRH5pM",
    authDomain: "serverlessprojectchat.firebaseapp.com",
    projectId: "serverlessprojectchat",
    storageBucket: "serverlessprojectchat.appspot.com",
    messagingSenderId: "46118584356",
    appId: "1:46118584356:web:5172cf699d8edc9f3a18b1",
    measurementId: "G-NJM4DPV6D9"
}

// Initialize Firebase
const app1 = initializeApp(firebaseConfig, "app1");
const analytics = getAnalytics(app1);
export const db = getFirestore(app1);


