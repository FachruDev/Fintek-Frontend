import { useRequireAuth } from '@/lib/use-require-auth';
import { useAuth } from '@/lib/use-auth';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Routes } from '@/lib/routes';

export default function Profile() {
  useRequireAuth();
  const { user, logout } = useAuth();
  const name = user?.name || 'User';
  const email = user?.email || '';
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.pageTitle}>Profile</Text>
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>
        <Text style={styles.name}>{name}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.card}>
        <Row label="Personal Information" onPress={() => {}} />
        <Divider />
        <Row label="Settings" onPress={() => {}} />
        <Divider />
        <Row label="Preferences" onPress={() => {}} />
      </View>

      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.rowText}>Theme</Text>
          <View style={styles.themeToggle}>
            <View style={[styles.themePill, { backgroundColor: '#22c55e' }]}>
              <Text style={[styles.themeLabel, { color: '#0B1110' }]}>Dark</Text>
            </View>
            <View style={styles.themePill}><Text style={styles.themeLabel}>Light</Text></View>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.card}>
        <Row label="Help Center" onPress={() => {}} />
        <Divider />
        <Row label="Contact Us" onPress={() => {}} />
      </View>

      <TouchableOpacity style={[styles.primaryBtn, { alignSelf: 'center', marginTop: 24 }]} onPress={() => { logout(); router.replace(Routes.onboarding); }}>
        <Text style={styles.primaryText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#26312E', marginHorizontal: -14 }} />;
}

function Row({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Text style={{ color: '#A8B0AE' }}>{'>'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 20 },
  pageTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 8 },
  name: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 12 },
  email: { color: '#A8B0AE', marginTop: 4 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 24, marginBottom: 12 },
  card: { backgroundColor: '#1F2624', borderRadius: 16, padding: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  rowText: { color: '#E6F0EC', fontSize: 16 },
  themeToggle: { flexDirection: 'row', backgroundColor: '#1B201E', borderRadius: 14, padding: 4, gap: 6 },
  themePill: { backgroundColor: '#262A28', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 },
  themeLabel: { color: '#E6F0EC', fontWeight: '700' },
  avatarOuter: { width: 116, height: 116, borderRadius: 58, backgroundColor: '#1F2624', alignItems: 'center', justifyContent: 'center' },
  avatarInner: { width: 104, height: 104, borderRadius: 52, backgroundColor: '#262A28', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#22c55e', fontSize: 48, fontWeight: '800' },
  primaryBtn: { marginTop: 24, backgroundColor: '#22c55e', paddingVertical: 14, borderRadius: 999, alignItems: 'center', width: 160 },
  primaryText: { color: '#0B1110', fontSize: 16, fontWeight: '700' },
});
