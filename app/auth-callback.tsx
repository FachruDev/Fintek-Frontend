import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/use-auth';
import { router } from 'expo-router';
import { Routes } from '@/lib/routes';

function parseFragment(hash: string) {
  const res: Record<string, string> = {};
  const h = hash.startsWith('#') ? hash.slice(1) : hash;
  for (const part of h.split('&')) {
    const [k, v] = part.split('=');
    if (!k) continue;
    res[decodeURIComponent(k)] = decodeURIComponent(v || '');
  }
  return res;
}

export default function AuthCallback() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    if (typeof window === 'undefined') return {} as Record<string, string>;
    return parseFragment(window.location.hash || '');
  }, []);

  useEffect(() => {
    const idToken = params['id_token'] || '';
    const returnedState = params['state'] || '';

    const expectedState = typeof window !== 'undefined' ? window.sessionStorage.getItem('google_oauth_state') || '' : '';
    if (expectedState && returnedState && expectedState !== returnedState) {
      setError('State mismatch. Please try again.');
      return;
    }
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('google_oauth_state');
      window.sessionStorage.removeItem('google_oauth_nonce');
    }

    if (!idToken) {
      setError('Missing id_token');
      return;
    }

    (async () => {
      try {
        await loginWithGoogle(idToken);
        router.replace(Routes.home);
      } catch (e: any) {
        setError(e?.message || 'Login failed');
      }
    })();
  }, [loginWithGoogle, params]);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ActivityIndicator color="#22c55e" />
          <Text style={styles.text}>Signing you in…</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', alignItems: 'center', justifyContent: 'center' },
  text: { marginTop: 12, color: '#A8B0AE' },
  error: { color: '#ef4444' },
});

