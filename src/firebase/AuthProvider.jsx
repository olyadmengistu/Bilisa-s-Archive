// DEPRECATED: This file is no longer used. The app now uses SimpleAuthProvider.
// This file is kept for reference but should not be imported.
// If you're seeing React Error #321, make sure this file is not being imported anywhere.

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authService } from './auth';
// import { firestoreService } from './firestore';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Enable offline persistence
//     firestoreService.enableOfflinePersistence();

//     // Listen to auth state changes
//     const unsubscribe = authService.onAuthStateChanged((user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const value = {
//     user,
//     loading,
//     signUp: authService.signUp,
//     signIn: authService.signIn,
//     signInWithGoogle: authService.signInWithGoogle,
//     signOut: authService.signOut,
//     getCurrentUser: authService.getCurrentUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthProvider;
