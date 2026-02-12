import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqxK-TNqur-Yluel0HTJqRfl2y1jcxiuI",
  authDomain: "beats-by-rkade-request-line.firebaseapp.com",
  projectId: "beats-by-rkade-request-line",
  storageBucket: "beats-by-rkade-request-line.firebasestorage.app",
  messagingSenderId: "73848981349",
  appId: "1:73848981349:web:d8f70e3b234df3a44d038c",
  measurementId: "G-C3YWP0XH5V",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
