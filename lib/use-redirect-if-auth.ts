import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from './use-auth';
import { Routes } from './routes';

// Redirect away from auth screens when already authenticated
export function useRedirectIfAuthenticated() {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && user) {
      router.replace(Routes.home);
    }
  }, [user, loading]);
}

