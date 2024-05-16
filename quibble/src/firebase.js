// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "quibble-blog.firebaseapp.com",
  projectId: "quibble-blog",
  storageBucket: "quibble-blog.appspot.com",
  messagingSenderId: "406536294807",
  appId: "1:406536294807:web:a97680e3d22828e81134d2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
