import { useRequireAuth } from '@/lib/use-require-auth';
import { View, Text, StyleSheet } from 'react-native';

export default function Transactions() {
  useRequireAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <Text style={styles.sub}>Coming soon…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 12 },
  sub: { color: '#A8B0AE', marginTop: 8 },
});

