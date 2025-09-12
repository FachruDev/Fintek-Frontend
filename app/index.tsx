import { useAuth } from '@/lib/use-auth';
import { router, useRootNavigationState, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Routes } from '@/lib/routes';
import { getToken } from '@/lib/token-store';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const rootNavigationState = useRootNavigationState();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Check if navigation is ready
    if (rootNavigationState?.key && !rootNavigationState.stale) {
      setIsReady(true);
    }
  }, [rootNavigationState]);

  useEffect(() => {
    if (isReady && !loading && !hasNavigated.current) {
      // Don't redirect if we're already on a specific page
      const currentPath = segments.join('/');
      if (currentPath && currentPath !== '' && currentPath !== 'index') {
        return;
      }

      // Add small delay 
      setTimeout(() => {
        const token = getToken();
        if (user || token) {
          router.replace(Routes.home);
          hasNavigated.current = true;
        } else {
          router.replace(Routes.onboarding);
          hasNavigated.current = true;
        }
      }, 100);
    }
  }, [isReady, loading, user, segments]);

  return null;
}
