import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Routes } from '@/lib/routes';

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>💸</Text>
        </View>
        <Text style={styles.title}>FinTrack</Text>
        <Text style={styles.subtitle}>Your Personal Finance Companion</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push(Routes.register)}>
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(Routes.login)}>
          <Text style={styles.link}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 24, justifyContent: 'space-between' },
  center: { alignItems: 'center', marginTop: 48 },
  logoCircle: { width: 112, height: 112, borderRadius: 56, backgroundColor: '#262A28', alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 48 },
  title: { color: '#FFFFFF', fontSize: 40, fontWeight: '800', marginTop: 24 },
  subtitle: { color: '#A8B0AE', fontSize: 16, marginTop: 8 },
  actions: { gap: 16, marginBottom: 40 },
  primaryBtn: { backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  primaryText: { color: '#0B1110', fontSize: 18, fontWeight: '700' },
  link: { color: '#22c55e', textAlign: 'center', marginTop: 8, fontSize: 14 },
});
