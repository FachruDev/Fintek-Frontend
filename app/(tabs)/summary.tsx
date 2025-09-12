import { useRequireAuth } from '@/lib/use-require-auth';
import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function CategoryItem({ icon, name, amount, progress }: { icon: string; name: string; amount: string; progress: number }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardSub}>${amount}</Text>
      </View>
      <View style={styles.progressBg}>
        <View style={[styles.progressBar, { width: `${Math.min(100, Math.max(0, progress * 100))}%` }]} />
      </View>
    </View>
  );
}

export default function SummaryScreen() {
  useRequireAuth();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Summary</Text>
        <TouchableOpacity>
          <Text style={{ color: '#A8B0AE', fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.balanceCard}>
        <View>
          <Text style={styles.subtle}>This Month’s Balance</Text>
          <Text style={styles.balance}>$1,234.56</Text>
        </View>
        <Text style={{ color: '#A8B0AE', fontSize: 18 }}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={{ gap: 12 }}>
        <CategoryItem icon={'🍽️'} name="Food & Dining" amount={'250.00'} progress={0.45} />
        <CategoryItem icon={'🚗'} name="Transportation" amount={'150.00'} progress={0.25} />
        <CategoryItem icon={'🎬'} name="Entertainment" amount={'100.00'} progress={0.15} />
        <CategoryItem icon={'💡'} name="Utilities" amount={'80.00'} progress={0.1} />
        <CategoryItem icon={'🏠'} name="Other" amount={'50.00'} progress={0.1} />
      </View>

      <Text style={styles.sectionTitle}>Income vs. Expense</Text>
      <View style={styles.chartPlaceholder}>
        <Text style={{ color: '#A8B0AE' }}>Chart coming soon</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  header: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  subtle: { color: '#A8B0AE' },
  balanceCard: { marginTop: 16, backgroundColor: '#1F2624', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balance: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 24, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1F2624', borderRadius: 16, padding: 14 },
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#262A28', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cardSub: { color: '#A8B0AE', marginTop: 2 },
  progressBg: { width: 90, height: 8, borderRadius: 999, backgroundColor: '#26312E', overflow: 'hidden' },
  progressBar: { height: 8, backgroundColor: '#22c55e' },
  chartPlaceholder: { height: 160, backgroundColor: '#1F2624', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
