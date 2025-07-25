import React, { createContext, useContext, useState } from 'react';

// MODO DEMO - Para pruebas sin Firebase
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProviderDemo = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Emails de demo para probar
  const DEMO_EMAILS = [
    'admin1@opticontrol.com',
    'admin2@opticontrol.com', 
    'admin3@opticontrol.com',
    'admin4@opticontrol.com',
    'admin5@opticontrol.com',
    'admin6@opticontrol.com'
  ];

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      // Simular delay de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar email demo
      if (!DEMO_EMAILS.includes(email)) {
        throw new Error('Email no autorizado');
      }

      // Verificar contraseña demo (cualquier contraseña funciona en demo)
      if (!password || password.length < 3) {
        throw new Error('Contraseña muy corta');
      }

      // Simular usuario logueado
      setUser({ 
        email, 
        uid: 'demo-uid',
        displayName: 'Usuario Demo'
      });
      
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
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
      {children}
    </AuthContext.Provider>
  );
};
