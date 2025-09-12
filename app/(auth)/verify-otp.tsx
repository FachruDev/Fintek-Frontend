import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { requestOtp, verifyOtp, signIn } from '@/lib/auth';
import { useRedirectIfAuthenticated } from '@/lib/use-redirect-if-auth';
import { Routes } from '@/lib/routes';
import { useAppTheme } from '@/lib/theme';

export default function VerifyOtpScreen() {
  useRedirectIfAuthenticated();
  const { palette } = useAppTheme();
  const { email: emailParam, password: passwordParam } = useLocalSearchParams<{ email?: string; password?: string }>();
  const [email] = useState((emailParam as string) || '');
  const password = (passwordParam as string) || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onVerify = async () => {
    setError(null);
    try {
      await verifyOtp(email.trim(), code.trim());
      if (password) {
        await signIn(email.trim(), password);
        router.replace(Routes.home);
      } else {
        router.replace(Routes.home);
      }
    } catch (e: any) {
      setError(e.message || 'Invalid or expired code');
    }
  };

  const onResend = async () => {
    setError(null);
    try {
      await requestOtp(email.trim());
      setCooldown(120);
    } catch (e: any) {
      setError(e.message || 'Failed to resend code');
    }
  };

  const boxes = Array.from({ length: 6 }).map((_, i) => code[i] || '');

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.back, { color: palette.muted }]}>{'<'} </Text>
      </TouchableOpacity>
      <Text style={[styles.header, { color: palette.text }]}>Enter Code</Text>

      <View style={{ alignItems: 'center', marginTop: 32 }}>
        <View style={[styles.iconCircle, { backgroundColor: palette.surface2 }]}>
          <Text style={{ fontSize: 28 }}>??</Text>
        </View>
        <Text style={[styles.title, { color: palette.text }]}>Verification Code</Text>
        <Text style={[styles.sub, { color: palette.muted }]}>We have sent a verification code to your email address.</Text>
      </View>

      <TextInput
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0 }}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <View style={styles.codeRow}>
        {boxes.map((ch, idx) => (
          <TouchableOpacity key={idx} onPress={() => inputRef.current?.focus()}>
            <View style={[styles.codeBox, { backgroundColor: palette.surface }]}>
              <Text style={[styles.codeText, { color: palette.text }]}>{ch}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: palette.brand }]} onPress={onVerify} disabled={code.length !== 6}>
        <Text style={styles.primaryText}>Verify</Text>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: palette.muted }}>
          Didn&#39;t receive the code?{' '}
          <Text onPress={cooldown === 0 ? onResend : undefined} style={{ color: cooldown === 0 ? palette.tint : '#6b7280' }}>
            {cooldown === 0 ? 'Resend' : `Resend in ${cooldown}s`}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  back: { fontSize: 24, paddingVertical: 4 },
  header: { fontSize: 22, fontWeight: '800', marginTop: 8, textAlign: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginTop: 16 },
  sub: { textAlign: 'center', marginTop: 8 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 28 },
  codeBox: { width: 48, height: 56, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  codeText: { fontSize: 20, fontWeight: '700' },
  primaryBtn: { marginTop: 24, paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  primaryText: { color: '#0B1110', fontSize: 18, fontWeight: '700' },
  error: { color: '#ef4444', marginTop: 8, textAlign: 'center' },
});
