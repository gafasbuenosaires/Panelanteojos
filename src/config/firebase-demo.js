// MODO DEMO - Firebase configuration para pruebas
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración DEMO - Reemplazar con credenciales reales
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project-id",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

// NOTA: Para usar en producción:
// 1. Crear proyecto en Firebase Console
// 2. Habilitar Authentication y Firestore
// 3. Reemplazar esta configuración con las credenciales reales
// 4. Configurar reglas de seguridad en Firestore
