/**
 * Firebase Authentication Helper Functions
 */

import {
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Sign in with email and password
 */
export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<UserCredential> {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured. Please set up Firebase to use authentication.");
  }
  
  try {
    const userCredential = await firebaseSignIn(auth, email, password);
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    console.error("Sign in error:", authError.message);
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured.");
  }
  
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    const authError = error as AuthError;
    console.error("Sign out error:", authError.message);
    throw new Error("Failed to sign out. Please try again.");
  }
}

/**
 * Create a new user account (for initial admin setup)
 * Note: You should disable this after creating your admin account
 */
export async function createUserAccount(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured.");
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    console.error("Account creation error:", authError.message);
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured.");
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const authError = error as AuthError;
    console.error("Password reset error:", authError.message);
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChanged(callback: (user: User | null) => void) {
  if (!auth) {
    // Call callback with null user immediately if auth is not configured
    callback(null);
    // Return a no-op unsubscribe function
    return () => {};
  }
  
  return firebaseOnAuthStateChanged(auth, callback);
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  if (!auth) return null;
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (!auth) return false;
  return auth.currentUser !== null;
}

/**
 * Get user-friendly error messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    default:
      return "An error occurred. Please try again.";
  }
}

/**
 * Client-side route guard helper
 * Returns true if user is authenticated, false otherwise
 */
export function requireAuth(): boolean {
  if (typeof window === "undefined") return false;
  return isAuthenticated();
}

/**
 * Get auth token for API calls
 */
export async function getAuthToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

