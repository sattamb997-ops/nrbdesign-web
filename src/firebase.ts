import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "youthful-abbey-4hnbb",
  appId: "1:639847838438:web:584e36ddd9d22b8b61c127",
  apiKey: "AIzaSyCXpWfVVlwHHiRdSxSs_1MaZ2JDjgrTJHg",
  authDomain: "youthful-abbey-4hnbb.firebaseapp.com",
  storageBucket: "youthful-abbey-4hnbb.firebasestorage.app",
  messagingSenderId: "639847838438",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-serenespacesstud-1963c482-3630-4029-b66f-fceae810c427");

export { db, collection, addDoc, serverTimestamp };
