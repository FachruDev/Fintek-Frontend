import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Routes } from '@/lib/routes';
import { useAppTheme } from '@/lib/theme';

export default function Onboarding() {
  const { palette } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.center}>
        <View style={[styles.logoCircle, { backgroundColor: palette.surface2 }]}>
          <Text style={[styles.logo, { color: palette.brand }]}>F</Text>
        </View>
        <Text style={[styles.title, { color: palette.text }]}>FinTrack</Text>
        <Text style={[styles.subtitle, { color: palette.muted }]}>Your Personal Finance Companion</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: palette.brand }]} onPress={() => router.push(Routes.register)}>
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(Routes.login)}>
          <Text style={[styles.link, { color: palette.tint }]}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  center: { alignItems: 'center', marginTop: 48 },
  logoCircle: { width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 48 },
  title: { fontSize: 40, fontWeight: '800', marginTop: 24 },
  subtitle: { fontSize: 16, marginTop: 8 },
  actions: { gap: 16, marginBottom: 40 },
  primaryBtn: { paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  primaryText: { color: '#0B1110', fontSize: 18, fontWeight: '700' },
  link: { textAlign: 'center', marginTop: 8, fontSize: 14 },
});

