import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const BackendAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token by getting user profile
      authApi.userApi?.getProfile?.()
        .then(response => {
          if (response.success) {
            setUser(response.user);
          }
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    uid: user?.id,
    signUp: async (email, password, displayName) => {
      const response = await authApi.register(email, password, displayName);
      if (response.success) {
        setUser(response.user);
      }
      return response;
    },
    signIn: async (email, password) => {
      const response = await authApi.login(email, password);
      if (response.success) {
        setUser(response.user);
      }
      return response;
    },
    signInWithGoogle: async () => {
      // Google OAuth would need to be implemented on backend
      return { success: false, error: 'Google OAuth not implemented yet' };
    },
    signOut: async () => {
      await authApi.logout();
      setUser(null);
      return { success: true };
    },
    getCurrentUser: () => user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useBackendAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useBackendAuth must be used within BackendAuthProvider');
  }
  return context;
};

export default BackendAuthProvider;
