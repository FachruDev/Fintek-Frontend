import { signIn } from '@/lib/auth';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@/lib/config';
import * as Google from 'expo-auth-session/providers/google';
import { router, useRootNavigationState } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/lib/use-auth';
import { useRedirectIfAuthenticated } from '@/lib/use-redirect-if-auth';
import { Routes } from '@/lib/routes';

export default function LoginScreen() {
  useRedirectIfAuthenticated();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const { loginWithGoogle } = useAuth();
  
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Check if navigation is ready
    if (rootNavigationState?.key && !rootNavigationState.stale) {
      setIsNavigationReady(true);
    }
  }, [rootNavigationState]);

  WebBrowser.maybeCompleteAuthSession();
  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: 'id_token',
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
  });

  // Web-only: full page redirect (no popup)
  const startGoogleRedirectWeb = useCallback(() => {
    if (Platform.OS !== 'web') return;
    if (!GOOGLE_WEB_CLIENT_ID) {
      setError('Missing GOOGLE_WEB_CLIENT_ID');
      return;
    }
    const origin = window.location.origin;
    const redirectUri = `${origin}/auth-callback`;
    const state = Math.random().toString(36).slice(2);
    const nonce = Math.random().toString(36).slice(2);
    try {
      window.sessionStorage.setItem('google_oauth_state', state);
      window.sessionStorage.setItem('google_oauth_nonce', nonce);
    } catch {}
    const params = new URLSearchParams({
      client_id: GOOGLE_WEB_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'id_token',
      scope: 'openid email profile',
      prompt: 'select_account',
      state,
      nonce,
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    // Full-page redirect
    window.location.assign(url);
  }, []);

  const safeNavigate = useCallback((path: string) => {
    if (!isMounted || !isNavigationReady) return;
    
    setTimeout(() => {
      try {
        router.replace(path as any);
      } catch (error) {
        console.error('Navigation error:', error);
        router.push(path as any);
      }
    }, 100);
  }, [isMounted, isNavigationReady]);

  useEffect(() => {
    const handleGoogleAuth = async () => {
      if (response?.type === 'success' && isMounted) {
        const idToken = (response.params as any)?.id_token;
        try {
          await loginWithGoogle(idToken);
          setTimeout(() => {
            safeNavigate(Routes.home);
          }, 1500);
        } catch (e: any) {
          setError(e.message || 'Google login failed');
        }
      }
    };

    if (response?.type === 'success' && isMounted) {
      handleGoogleAuth();
    }
  }, [response, isMounted, safeNavigate, loginWithGoogle]);

  const onLogin = () => {
    if (!password) {
      setError('Password is required');
      return;
    }
    setError(null);
    signIn(email, password)
      .then(() => {
        setTimeout(() => {
          safeNavigate(Routes.home);
        }, 500);
      })
      .catch((e) => {
        const msg = (e?.message || '').toLowerCase();
        if (msg.includes('forbidden')) {
          setTimeout(() => {
            const otpUrl = `${Routes.verifyOtp}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
            safeNavigate(otpUrl);
          }, 500);
        } else {
          setError(e.message || 'Login failed');
        }
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>{'<'} </Text>
      </TouchableOpacity>
      <Text style={styles.header}>Welcome Back!</Text>
      <Text style={styles.sub}>Log in to continue your financial journey.</Text>

      <View style={styles.fieldBox}>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#8A918E"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.fieldBox}>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#8A918E"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.primaryBtn} onPress={onLogin}>
        <Text style={styles.primaryText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: '#1F2624', marginTop: 10 }]}
        disabled={Platform.OS !== 'web' ? !request : false}
        onPress={() => {
          if (Platform.OS === 'web') startGoogleRedirectWeb();
          else promptAsync();
        }}
      >
        <Text style={[styles.primaryText, { color: '#E6F0EC' }]}>Sign in with Google</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <Text style={{ color: '#9AA4A0' }}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push(Routes.register)}>
          <Text style={{ color: '#22c55e', fontWeight: '700' }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 24 },
  back: { color: '#9AA4A0', fontSize: 24, paddingVertical: 4 },
  header: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginTop: 8 },
  sub: { color: '#A8B0AE', fontSize: 16, marginTop: 8, marginBottom: 24 },
  fieldBox: { backgroundColor: '#1F2624', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 14 },
  input: { color: '#E6F0EC', fontSize: 16, paddingVertical: 12 },
  primaryBtn: { marginTop: 12, backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  primaryText: { color: '#0B1110', fontSize: 18, fontWeight: '700' },
  error: { color: '#ef4444', marginTop: 8 },
});
