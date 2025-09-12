import { useRequireAuth } from '@/lib/use-require-auth';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Category, listCategories, Transaction, listTransactions, deleteTransaction } from '@/lib/api';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from '@/components/ui/toast';
import { ConfirmModal } from '@/components/ui/confirm-modal';

function FilterButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.filterBtn}>
      <Text style={styles.filterText}>{label}</Text>
    </TouchableOpacity>
  );
}

function formatCurrency(val: string | number) {
  const n = Number(val);
  const sign = n >= 0 ? '+' : '-';
  const abs = Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sign}$${abs}`;
}

function TxnRow({ item, categoryName, isIncome, onPress, onDelete }: { item: Transaction; categoryName?: string; isIncome: boolean; onPress: () => void; onDelete: () => void }) {
  return (
    <TouchableOpacity style={styles.txnCard} onPress={onPress}>
      <View style={styles.txnIcon}><Text style={{ color: '#22c55e' }}>{isIncome ? '+' : '-'}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txnTitle}>{categoryName || '—'}</Text>
        <Text style={styles.txnSub}>{new Date(item.occurred_on).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>{formatCurrency(item.amount)}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function Transactions() {
  useRequireAuth();
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ category_id?: string; start_date?: string; end_date?: string }>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, { name: c.name, kind: c.kind }] as const)), [categories]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, txns] = await Promise.all([listCategories(), listTransactions(filters)]);
      setCategories(cats);
      setItems(txns);
    } catch (e: any) {
      toast.show(e?.message || 'Failed to load transactions', { type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  const resetFilters = () => setFilters({});

  const startDelete = (id: string) => setConfirmId(id);

  const performDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteTransaction(confirmId);
      setConfirmId(null);
      toast.show('Transaction deleted', { type: 'success' });
      fetchAll();
    } catch (e: any) {
      toast.show(e?.message || 'Delete failed', { type: 'error' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/transaction/new')}>
          <Text style={{ color: '#0B1110', fontWeight: '700', fontSize: 18 }}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <FilterButton
          label={filters.category_id ? categoryMap[filters.category_id]?.name || 'Category' : 'Category'}
          onPress={() => {
            if (categories.length === 0) return;
            const idx = filters.category_id ? categories.findIndex((c) => c.id === filters.category_id) : -1;
            const next = categories[(idx + 1) % categories.length];
            setFilters((f) => ({ ...f, category_id: next?.id }));
          }}
        />
        <FilterButton
          label={filters.start_date || filters.end_date ? 'Date Range' : 'Date Range'}
          onPress={() => {
            if (filters.start_date) {
              setFilters((f) => ({ ...f, start_date: undefined, end_date: undefined }));
            } else {
              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 30);
              const fmt = (d: Date) => d.toISOString().slice(0, 10);
              setFilters((f) => ({ ...f, start_date: fmt(start), end_date: fmt(end) }));
            }
          }}
        />
        {Object.keys(filters).length > 0 && (
          <TouchableOpacity onPress={resetFilters} style={[styles.filterBtn, { backgroundColor: '#262A28' }]}>
            <Text style={styles.filterText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ marginTop: 16 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAll} tintColor="#22c55e" />}>
        <View style={{ gap: 12, paddingBottom: 40 }}>
          {items.map((t) => (
            <TxnRow
              key={t.id}
              item={t}
              categoryName={categoryMap[t.category_id]?.name}
              isIncome={categoryMap[t.category_id]?.kind === 'income'}
              onPress={() => router.push(`/transaction/${t.id}`)}
              onDelete={() => startDelete(t.id)}
            />
          ))}
          {items.length === 0 && !loading && <Text style={{ color: '#6b7280' }}>No transactions.</Text>}
        </View>
      </ScrollView>

      <ConfirmModal
        visible={!!confirmId}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmId(null)}
        onConfirm={performDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  addBtn: { backgroundColor: '#22c55e', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  filterBtn: { backgroundColor: '#1F2624', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 },
  filterText: { color: '#E6F0EC' },
  txnCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1F2624', borderRadius: 16, padding: 14 },
  txnIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#262A28', alignItems: 'center', justifyContent: 'center' },
  txnTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  txnSub: { color: '#A8B0AE', marginTop: 2 },
  amount: { fontSize: 16, fontWeight: '700' },
  income: { color: '#22c55e' },
  expense: { color: '#ef4444' },
});

