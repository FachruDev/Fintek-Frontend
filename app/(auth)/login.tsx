import { signIn } from '@/lib/auth';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@/lib/config';
import * as Google from 'expo-auth-session/providers/google';
import { router, useRootNavigationState } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/use-auth';
import { useRedirectIfAuthenticated } from '@/lib/use-redirect-if-auth';
import { Routes } from '@/lib/routes';
import { useAppTheme } from '@/lib/theme';

export default function LoginScreen() {
  useRedirectIfAuthenticated();
  const { palette } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
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
    setSubmitting(true);
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
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Back */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[styles.backBtn, { backgroundColor: palette.surface }]}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={22} color={palette.muted} />
      </TouchableOpacity>

      <View style={styles.centerWrap}>
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <Text style={[styles.header, { color: palette.text }]}>Welcome back</Text>
          <Text style={[styles.sub, { color: palette.muted }]}>Log in to continue your financial journey.</Text>

          {/* Email */}
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: palette.muted }]}>Email</Text>
          </View>
          <View
            style={[
              styles.fieldRow,
              { borderColor: emailFocused ? palette.tint : 'transparent', backgroundColor: palette.background },
            ]}
          >
            <Ionicons name="mail-outline" size={18} color={palette.muted} style={styles.leftIcon} />
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor="#8A918E"
              autoComplete="email"
              style={[styles.input, { color: palette.text }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              returnKeyType="next"
              selectionColor={palette.tint}
            />
          </View>

          {/* Password */}
          <View style={[styles.labelRow, { marginTop: 14 }]}>
            <Text style={[styles.label, { color: palette.muted }]}>Password</Text>
          </View>
          <View
            style={[
              styles.fieldRow,
              { borderColor: passwordFocused ? palette.tint : 'transparent', backgroundColor: palette.background },
            ]}
          >
            <Ionicons name="lock-closed-outline" size={18} color={palette.muted} style={styles.leftIcon} />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#8A918E"
              style={[styles.input, { color: palette.text }]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onSubmitEditing={onLogin}
              returnKeyType="done"
              selectionColor={palette.tint}
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} accessibilityRole="button">
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.muted} />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: '#FEE2E2' }]}> 
              <Ionicons name="alert-circle-outline" size={16} color="#B91C1C" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: palette.brand }]}
            onPress={onLogin}
            activeOpacity={0.9}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#0B1110" />
            ) : (
              <Text style={styles.primaryText}>Log in</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: palette.background }]} />
            <Text style={{ color: palette.muted, fontSize: 12, marginHorizontal: 10 }}>or continue with</Text>
            <View style={[styles.divider, { backgroundColor: palette.background }]} />
          </View>

          <TouchableOpacity
            style={[styles.ghostBtn, { backgroundColor: palette.background }]}
            disabled={Platform.OS !== 'web' ? !request || submitting : submitting}
            onPress={() => {
              if (Platform.OS === 'web') startGoogleRedirectWeb();
              else promptAsync();
            }}
            activeOpacity={0.9}
          >
            <Ionicons name="logo-google" size={18} color={palette.text} />
            <Text style={[styles.ghostText, { color: palette.text }]}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={{ color: palette.muted }}>Dont have an account? </Text>
          <TouchableOpacity onPress={() => router.push(Routes.register)}>
            <Text style={{ color: palette.tint, fontWeight: '700' }}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  header: { fontSize: 28, fontWeight: '800' },
  sub: { fontSize: 14, marginTop: 6, marginBottom: 18 },
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
  },
  leftIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    // Remove white outline on web when focused
    outlineStyle: 'none' as any,
    outlineWidth: 0 as any,
  },
  primaryBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  primaryText: { color: '#0B1110', fontSize: 16, fontWeight: '700' },
  ghostBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ghostText: { fontSize: 15, fontWeight: '600', marginLeft: 8 },
  dividerRow: {
    marginTop: 18,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, flex: 1, opacity: 0.5, borderRadius: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  errorText: { color: '#B91C1C', fontSize: 13, fontWeight: '600' },
});
