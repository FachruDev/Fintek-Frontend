import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { apiRegister } from '@/lib/api';
import { useRedirectIfAuthenticated } from '@/lib/use-redirect-if-auth';
import { Routes } from '@/lib/routes';

export default function RegisterScreen() {
  useRedirectIfAuthenticated();
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
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>{'<'} </Text>
      </TouchableOpacity>
      <Text style={styles.header}>Sign Up</Text>

      <View style={styles.fieldBox}>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#8A918E"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.fieldBox}>
        <TextInput
          placeholder="Email"
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
          placeholder="Password"
          placeholderTextColor="#8A918E"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.primaryBtn} onPress={onRegister}>
        <Text style={styles.primaryText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <Text style={{ color: '#9AA4A0' }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push(Routes.login)}>
          <Text style={{ color: '#22c55e', fontWeight: '700' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 24 },
  back: { color: '#9AA4A0', fontSize: 24, paddingVertical: 4 },
  header: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginVertical: 16, textAlign: 'center' },
  fieldBox: { backgroundColor: '#1F2624', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 14 },
  input: { color: '#E6F0EC', fontSize: 16, paddingVertical: 12 },
  primaryBtn: { marginTop: 24, backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  primaryText: { color: '#0B1110', fontSize: 18, fontWeight: '700' },
  error: { color: '#ef4444', marginTop: 8 },
});
