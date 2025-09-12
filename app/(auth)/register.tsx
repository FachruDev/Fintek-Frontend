import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
  const [error, setError] = useState<string | null>(null);

  const onRegister = () => {
    setError(null);
    apiRegister({ name, email, password })
      .then(() => router.replace({ pathname: Routes.verifyOtp, params: { email, password } }))
      .catch((e) => setError(e.message || 'Register failed'));
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.back, { color: palette.muted }]}>{'<'} </Text>
      </TouchableOpacity>
      <Text style={[styles.header, { color: palette.text }]}>Sign Up</Text>

      <View style={[styles.fieldBox, { backgroundColor: palette.surface }]}>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#8A918E"
          style={[styles.input, { color: palette.text }]}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={[styles.fieldBox, { backgroundColor: palette.surface }]}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#8A918E"
          style={[styles.input, { color: palette.text }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.fieldBox, { backgroundColor: palette.surface }]}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#8A918E"
          style={[styles.input, { color: palette.text }]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: palette.brand }]} onPress={onRegister}>
        <Text style={styles.primaryText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <Text style={{ color: palette.muted }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push(Routes.login)}>
          <Text style={{ color: palette.tint, fontWeight: '700' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  back: { fontSize: 24, paddingVertical: 4 },
  header: { fontSize: 32, fontWeight: '800', marginVertical: 16, textAlign: 'center' },
  fieldBox: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 14 },
  input: { fontSize: 16, paddingVertical: 12 },
  primaryBtn: { marginTop: 24, paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  primaryText: { color: '#0B1110', fontSize: 18, fontWeight: '700' },
  error: { color: '#ef4444', marginTop: 8 },
});
