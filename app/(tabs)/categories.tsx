import { useRequireAuth } from '@/lib/use-require-auth';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Category, deleteCategory, listCategories } from '@/lib/api';
import { useFocusEffect } from '@react-navigation/native';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/components/ui/toast';
import { useAppTheme } from '@/lib/theme';

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function CategoryRow({ item, onEdit, onDelete }: { item: Category; onEdit: () => void; onDelete: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}><Text style={{ color: '#22c55e' }}>{item.kind === 'income' ? '↑' : '↓'}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>{item.kind}</Text>
      </View>
      <TouchableOpacity onPress={onEdit}><Text style={styles.action}>✎</Text></TouchableOpacity>
      <TouchableOpacity onPress={onDelete}><Text style={styles.action}>🗑</Text></TouchableOpacity>
    </View>
  );
}

export default function Categories() {
  useRequireAuth();
  const { palette } = useAppTheme();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listCategories();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Failed to load categories', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const income = useMemo(() => items.filter((c) => c.kind === 'income'), [items]);
  const expense = useMemo(() => items.filter((c) => c.kind === 'expense'), [items]);

  const requestDelete = (id: string) => setConfirmId(id);

  const performDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteCategory(confirmId);
      setConfirmId(null);
      toast.show('Category deleted', { type: 'success' });
      fetchData();
    } catch (e: any) {
      console.error('Delete failed', e);
      toast.show(e?.message || 'Delete failed', { type: 'error' });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: palette.text }]}>Categories</Text>
        <TouchableOpacity style={[styles.newBtn, { backgroundColor: palette.brand }]} onPress={() => router.push('/category/new')}>
          <Text style={{ color: '#0B1110', fontWeight: '700' }}>+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={palette.tint} />}>
        <SectionHeader title="Income" />
        <View style={{ gap: 12 }}>
          {income.map((c) => (
            <CategoryRow key={c.id} item={c} onEdit={() => router.push(`/category/${c.id}`)} onDelete={() => requestDelete(c.id)} />
          ))}
          {income.length === 0 && <Text style={[styles.empty, { color: palette.muted }]}>No income categories.</Text>}
        </View>

        <SectionHeader title="Expense" />
        <View style={{ gap: 12, marginBottom: 40 }}>
          {expense.map((c) => (
            <CategoryRow key={c.id} item={c} onEdit={() => router.push(`/category/${c.id}`)} onDelete={() => requestDelete(c.id)} />
          ))}
          {expense.length === 0 && <Text style={[styles.empty, { color: palette.muted }]}>No expense categories.</Text>}
        </View>
      </ScrollView>
      <ConfirmModal
        visible={!!confirmId}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmId(null)}
        onConfirm={performDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  title: { fontSize: 24, fontWeight: '800' },
  newBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },
  sectionTitle: { color: '#22c55e', fontSize: 16, fontWeight: '800', marginTop: 24, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1F2624', borderRadius: 16, padding: 14 },
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#262A28', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cardSub: { color: '#A8B0AE', marginTop: 2, textTransform: 'capitalize' },
  action: { color: '#A8B0AE', fontSize: 16, paddingHorizontal: 8 },
  empty: { marginBottom: 8 },
});
