import { useRequireAuth } from '@/lib/use-require-auth';
import { useAuth } from '@/lib/use-auth';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Routes } from '@/lib/routes';

export default function Profile() {
  useRequireAuth();
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>{user?.email}</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={() => { logout(); router.replace(Routes.onboarding); }}>
        <Text style={styles.primaryText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 12 },
  sub: { color: '#A8B0AE', marginTop: 8 },
  primaryBtn: { marginTop: 24, backgroundColor: '#22c55e', paddingVertical: 14, borderRadius: 999, alignItems: 'center', width: 160 },
  primaryText: { color: '#0B1110', fontSize: 16, fontWeight: '700' },
});
