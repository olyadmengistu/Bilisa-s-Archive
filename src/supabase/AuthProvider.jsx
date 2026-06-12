import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseAuthService } from './auth';

const AuthContext = createContext(null);

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = supabaseAuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signUp: supabaseAuthService.signUp,
    signIn: supabaseAuthService.signIn,
    signInWithGoogle: supabaseAuthService.signInWithGoogle,
    signOut: supabaseAuthService.signOut,
    getCurrentUser: supabaseAuthService.getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  }
  return context;
};

export default SupabaseAuthProvider;
