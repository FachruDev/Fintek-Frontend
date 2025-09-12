import { useEffect } from 'react';
import { useAuth } from './use-auth';
import { router } from 'expo-router';
import { getToken } from './token-store';

export function useRequireAuth() {
  const { user, loading } = useAuth();
  useEffect(() => {
    // Avoid redirecting if a token exists (auth is likely hydrating)
    if (!loading && !user) {
      const token = getToken();
      if (!token) router.replace('/(auth)/login');
    }
  }, [user, loading]);
}
