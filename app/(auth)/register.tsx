import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiRegister } from '@/lib/api';
import { useRedirectIfAuthenticated } from '@/lib/use-redirect-if-auth';
import { Routes } from '@/lib/routes';
import { useAppTheme } from '@/lib/theme';

export default function RegisterScreen() {
  useRedirectIfAuthenticated();
  const { palette } = useAppTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<{ name: boolean; email: boolean; password: boolean }>({ name: false, email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRegister = () => {
    setError(null);
    setSubmitting(true);
    apiRegister({ name, email, password })
      .then(() => router.replace({ pathname: Routes.verifyOtp, params: { email, password } }))
      .catch((e) => setError(e.message || 'Register failed'))
      .finally(() => setSubmitting(false));
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
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
          <Text style={[styles.header, { color: palette.text }]}>Create account</Text>
          <Text style={[styles.sub, { color: palette.muted }]}>Join us to manage your finances smarter.</Text>

          {/* Name */}
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: palette.muted }]}>Full name</Text>
          </View>
          <View style={[styles.fieldRow, { borderColor: focused.name ? palette.tint : 'transparent', backgroundColor: palette.background }]}>
            <Ionicons name="person-outline" size={18} color={palette.muted} style={styles.leftIcon} />
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#8A918E"
              style={[styles.input, { color: palette.text }]}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused((s) => ({ ...s, name: true }))}
              onBlur={() => setFocused((s) => ({ ...s, name: false }))}
              returnKeyType="next"
              selectionColor={palette.tint}
            />
          </View>

          {/* Email */}
          <View style={[styles.labelRow, { marginTop: 14 }]}>
            <Text style={[styles.label, { color: palette.muted }]}>Email</Text>
          </View>
          <View style={[styles.fieldRow, { borderColor: focused.email ? palette.tint : 'transparent', backgroundColor: palette.background }]}>
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
              onFocus={() => setFocused((s) => ({ ...s, email: true }))}
              onBlur={() => setFocused((s) => ({ ...s, email: false }))}
              returnKeyType="next"
              selectionColor={palette.tint}
            />
          </View>

          {/* Password */}
          <View style={[styles.labelRow, { marginTop: 14 }]}>
            <Text style={[styles.label, { color: palette.muted }]}>Password</Text>
          </View>
          <View style={[styles.fieldRow, { borderColor: focused.password ? palette.tint : 'transparent', backgroundColor: palette.background }]}>
            <Ionicons name="lock-closed-outline" size={18} color={palette.muted} style={styles.leftIcon} />
            <TextInput
              placeholder="Create a strong password"
              placeholderTextColor="#8A918E"
              style={[styles.input, { color: palette.text }]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused((s) => ({ ...s, password: true }))}
              onBlur={() => setFocused((s) => ({ ...s, password: false }))}
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
            onPress={onRegister}
            activeOpacity={0.9}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#0B1110" /> : <Text style={styles.primaryText}>Create account</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={{ color: palette.muted }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push(Routes.login)}>
            <Text style={{ color: palette.tint, fontWeight: '700' }}>Sign in</Text>
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
