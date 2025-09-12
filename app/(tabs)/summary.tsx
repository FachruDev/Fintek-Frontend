import { useRequireAuth } from '@/lib/use-require-auth';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getMonthlySummary, MonthlySummary } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

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
  const toast = useToast();
  const now = new Date();
  const [ym, setYm] = useState<{ year: number; month: number }>({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [data, setData] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMonthlySummary(ym);
      setData(res);
    } catch (e: any) {
      toast.show(e?.message || 'Failed to load summary', { type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [ym, toast]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const totals = useMemo(() => {
    const income = Number(data?.total_income || 0);
    const expense = Number(data?.total_expense || 0);
    return { income, expense, max: Math.max(income, Math.abs(expense), 1) };
  }, [data]);

  const balanceFmt = useMemo(() => {
    const b = Number(data?.balance || 0);
    const prefix = b >= 0 ? '' : '-';
    const abs = Math.abs(b).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${prefix}$${abs}`;
  }, [data]);

  const grouped = useMemo(() => {
    const arr = data?.category_breakdown || [];
    const incomeTotal = arr.filter(a => a.kind === 'income').reduce((s, a) => s + Number(a.total), 0) || 1;
    const expenseTotal = arr.filter(a => a.kind === 'expense').reduce((s, a) => s + Number(a.total), 0) || 1;
    return {
      income: arr.filter(a => a.kind === 'income').map(a => ({
        name: a.name,
        amount: Number(a.total).toFixed(2),
        progress: Math.max(0, Math.min(1, Number(a.total) / incomeTotal)),
      })),
      expense: arr.filter(a => a.kind === 'expense').map(a => ({
        name: a.name,
        amount: Number(a.total).toFixed(2),
        progress: Math.max(0, Math.min(1, Number(a.total) / expenseTotal)),
      })),
    };
  }, [data]);

  const monthName = useMemo(() => new Date(ym.year, ym.month - 1, 1).toLocaleString(undefined, { month: 'long' }), [ym]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Summary</Text>
        <TouchableOpacity onPress={() => setYm(m => ({ year: m.month === 1 ? m.year - 1 : m.year, month: m.month === 1 ? 12 : m.month - 1 }))}>
          <Text style={{ color: '#A8B0AE', fontSize: 14 }}>{loading ? 'Loading…' : 'Prev'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.balanceCard}>
        <View>
          <Text style={styles.subtle}>{monthName} {ym.year} Balance</Text>
          <Text style={styles.balance}>{balanceFmt}</Text>
        </View>
        <View>
          <Text style={[styles.subtle, { textAlign: 'right' }]}>Income</Text>
          <Text style={[styles.amount, styles.income]}>+${totals.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          <Text style={[styles.subtle, { textAlign: 'right', marginTop: 6 }]}>Expense</Text>
          <Text style={[styles.amount, styles.expense]}>-${Math.abs(totals.expense).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={{ gap: 12 }}>
        {grouped.expense.map((c, idx) => (
          <CategoryItem key={`e-${idx}`} icon={'-'} name={c.name} amount={c.amount} progress={c.progress} />
        ))}
        {grouped.income.map((c, idx) => (
          <CategoryItem key={`i-${idx}`} icon={'+'} name={c.name} amount={c.amount} progress={c.progress} />
        ))}
        {(!data || (grouped.expense.length + grouped.income.length) === 0) && (
          <Text style={{ color: '#6b7280' }}>{loading ? 'Loading…' : 'No categories yet.'}</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Income vs. Expense</Text>
      <View style={styles.chartBox}>
        <View style={styles.barsRow}>
          <View style={[styles.bar, { height: Math.max(10, (totals.income / totals.max) * 120), backgroundColor: '#22c55e' }]} />
          <View style={[styles.bar, { height: Math.max(10, (Math.abs(totals.expense) / totals.max) * 120), backgroundColor: '#ef4444' }]} />
        </View>
        <View style={styles.barsLabels}>
          <Text style={[styles.subtle, { color: '#22c55e' }]}>Income</Text>
          <Text style={[styles.subtle, { color: '#ef4444' }]}>Expense</Text>
        </View>
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
  chartBox: { height: 180, backgroundColor: '#1F2624', borderRadius: 16, alignItems: 'center', justifyContent: 'center', padding: 16 },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 24, height: 140 },
  bar: { width: 36, borderRadius: 8 },
  barsLabels: { flexDirection: 'row', justifyContent: 'space-between', width: 140, marginTop: 8 },
  amount: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  income: { color: '#22c55e' },
  expense: { color: '#ef4444' },
});
