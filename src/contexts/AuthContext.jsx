import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Emails permitidos para hasta 6 administradores
const ALLOWED_EMAILS = [
  'admin1@empresa.com',
  'admin2@empresa.com', 
  'admin3@empresa.com',
  'admin4@empresa.com',
  'admin5@empresa.com',
  'admin6@empresa.com'
];

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && ALLOWED_EMAILS.includes(user.email)) {
        setUser(user);
      } else if (user) {
        // Usuario no autorizado
        signOut(auth);
        setError('No tienes permisos para acceder a este sistema');
        setUser(null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      
      // Verificar que el email esté en la lista permitida
      if (!ALLOWED_EMAILS.includes(email)) {
        throw new Error('Email no autorizado');
      }

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  const value = {
    user,
    login,
    logout,
    error,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
