import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getUserId, setUserId } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (stored in localStorage)
    const storedUserId = getUserId();
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserId && storedUserData) {
      try {
        setUser(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('userId');
      }
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email, password, displayName) => {
    const result = await authAPI.signup(email, password, displayName);
    if (result.success) {
      setUser(result.user);
      setUserId(result.user.id);
      localStorage.setItem('userData', JSON.stringify(result.user));
    }
    return result;
  };

  const signIn = async (email, password) => {
    const result = await authAPI.login(email, password);
    if (result.success) {
      setUser(result.user);
      setUserId(result.user.id);
      localStorage.setItem('userData', JSON.stringify(result.user));
    }
    return result;
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    return { success: true };
  };

  const getCurrentUser = () => {
    return user;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
