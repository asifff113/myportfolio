"use client";

/**
 * Custom React Hook for Firebase Authentication
 * Provides authentication state and methods throughout the app
 */

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getCurrentUser,
} from "@/lib/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * useAuth Hook
 * 
 * Usage:
 * ```tsx
 * const { user, loading, error, login, logout } = useAuth();
 * 
 * if (loading) return <Spinner />;
 * if (user) return <Dashboard />;
 * return <Login />;
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setAuthState((prev) => ({
        ...prev,
        user,
        loading: false,
      }));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(email, password);
      // User state will be updated by onAuthStateChanged listener
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signOut();
      // User state will be updated by onAuthStateChanged listener
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign out";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // Clear error
  const clearError = (): void => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    clearError,
  };
}

/**
 * Simple hook to just check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user } = useAuth();
  return user !== null;
}

/**
 * Hook to get current user or null
 */
export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}

