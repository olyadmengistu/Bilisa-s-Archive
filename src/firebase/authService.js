import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';

export class AuthService {
  // Register new user
  static async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Login user
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Logout user
  static async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Send password reset email
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Get user-friendly error messages
  static getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
      'auth/invalid-credential': 'Invalid email or password.'
    };
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }
}

export default AuthService;
