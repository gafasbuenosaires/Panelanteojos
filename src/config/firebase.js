// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyD6BAUUl88zq4WtUDyHOlWD7pxjpZtR70o",
  authDomain: "panel-anteojos.firebaseapp.com",
  projectId: "panel-anteojos",
  storageBucket: "panel-anteojos.firebasestorage.app",
  messagingSenderId: "795138195199",
  appId: "1:795138195199:web:111964af328456db3996ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
