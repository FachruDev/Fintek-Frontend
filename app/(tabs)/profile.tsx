import { useRequireAuth } from '@/lib/use-require-auth';
import { useAuth } from '@/lib/use-auth';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Routes } from '@/lib/routes';
import { useAppTheme } from '@/lib/theme';

export default function Profile() {
  useRequireAuth();
  const { user, logout } = useAuth();
  const { mode, setMode, palette } = useAppTheme();
  const name = user?.name || 'User';
  const email = user?.email || '';
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.pageTitle, { color: palette.text }]}>Profile</Text>
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <View style={[styles.avatarOuter, { backgroundColor: palette.surface }]}>
          <View style={[styles.avatarInner, { backgroundColor: palette.surface2 }]}>
            <Text style={[styles.avatarText, { color: palette.brand }]}>{initial}</Text>
          </View>
        </View>
        <Text style={[styles.name, { color: palette.text }]}>{name}</Text>
        {email ? <Text style={[styles.email, { color: palette.muted }]}>{email}</Text> : null}
      </View>

      <Text style={[styles.sectionTitle, { color: palette.text }]}>Account</Text>
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Row label="Personal Information" onPress={() => {}} color={palette} />
        <Divider color={palette.border} />
        <Row label="Settings" onPress={() => {}} color={palette} />
        <Divider color={palette.border} />
        <Row label="Preferences" onPress={() => {}} color={palette} />
      </View>

      <Text style={[styles.sectionTitle, { color: palette.text }]}>Appearance</Text>
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.rowText, { color: palette.text }]}>Theme</Text>
          <View style={[styles.themeToggle, { backgroundColor: palette.surface2 }] }>
            <TouchableOpacity onPress={() => setMode('dark')}>
              <View style={[styles.themePill, { backgroundColor: palette.surface2 }, mode !== 'light' && { backgroundColor: palette.brand }]}>
                <Text style={[styles.themeLabel, { color: palette.text }, mode !== 'light' && { color: '#0B1110' }]}>Dark</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('light')}>
              <View style={[styles.themePill, { backgroundColor: palette.surface2 }, mode === 'light' && { backgroundColor: palette.brand }]}>
                <Text style={[styles.themeLabel, { color: palette.text }, mode === 'light' && { color: '#0B1110' }]}>Light</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: palette.text }]}>Support</Text>
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Row label="Help Center" onPress={() => {}} color={palette} />
        <Divider color={palette.border} />
        <Row label="Contact Us" onPress={() => {}} color={palette} />
      </View>

      <TouchableOpacity style={[styles.primaryBtn, { alignSelf: 'center', marginTop: 24, backgroundColor: palette.brand }]} onPress={() => { logout(); router.replace(Routes.onboarding); }}>
        <Text style={styles.primaryText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={{ height: 1, backgroundColor: color, marginHorizontal: -14 }} />;
}

function Row({ label, onPress, color }: { label: string; onPress?: () => void; color: any }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <Text style={[styles.rowText, { color: color.text }]}>{label}</Text>
      <Text style={{ color: color.muted }}>{'>'}</Text>
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
