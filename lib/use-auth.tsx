import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, me, signIn, signInWithGoogle, signOut, signUp } from './auth';
import { getToken } from './token-store';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const u = await me();
      setUser(u);
    } catch (e: any) {
      const token = getToken();
      if (!token) setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const u = await signIn(email, password);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setError(null);
    setLoading(true);
    try {
      const u = await signInWithGoogle(idToken);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    await signUp(name, email, password);
  };

  const logout = () => {
    signOut();
    setUser(null);
  };

  const value: AuthContextType = { user, loading, error, login, loginWithGoogle, register, refresh, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
