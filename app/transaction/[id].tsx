import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Category, listCategories, listTransactions, updateTransaction, deleteTransaction } from '@/lib/api';
import { useRequireAuth } from '@/lib/use-require-auth';
import { useToast } from '@/components/ui/toast';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export default function EditTransaction() {
  useRequireAuth();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [cats, txns] = await Promise.all([listCategories(), listTransactions()]);
        setCategories(cats);
        const tx = txns.find((t) => t.id === id);
        if (tx) {
          setCategoryId(tx.category_id);
          setAmount(String(tx.amount));
          setDate(tx.occurred_on);
          setDescription(tx.description || '');
        }
      } catch (e) {}
    })();
  }, [id]);

  const selectedCategory = useMemo(() => categories.find((c) => c.id === categoryId), [categories, categoryId]);

  const cycleCategory = () => {
    if (categories.length === 0) return;
    const idx = categoryId ? categories.findIndex((c) => c.id === categoryId) : -1;
    const next = categories[(idx + 1) % categories.length];
    setCategoryId(next.id);
  };

  const save = async () => {
    if (!id) return;
    if (!categoryId || !amount || !date) {
      setError('Category, amount, and date are required');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateTransaction(String(id), { category_id: categoryId, amount, occurred_on: date, description });
      toast.show('Transaction updated', { type: 'success' });
      router.back();
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const performDelete = async () => {
    if (!id) return;
    try {
      await deleteTransaction(String(id));
      toast.show('Transaction deleted', { type: 'success' });
      router.back();
    } catch (e: any) {
      toast.show(e?.message || 'Delete failed', { type: 'error' });
    } finally {
      setConfirm(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>{'<'} </Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit Transaction</Text>

      <Text style={styles.label}>Category</Text>
      <TouchableOpacity style={styles.fieldBox} onPress={cycleCategory}>
        <Text style={styles.input}>{selectedCategory?.name || 'Select Category'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Amount</Text>
      <View style={styles.fieldBox}>
        <TextInput
          placeholder="Amount"
          placeholderTextColor="#8A918E"
          style={styles.input}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <Text style={styles.label}>Date</Text>
      <View style={styles.fieldBox}>
        <TextInput
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#8A918E"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />
      </View>

      <Text style={styles.label}>Description</Text>
      <View style={[styles.fieldBox, { height: 120 }] }>
        <TextInput
          placeholder="Description"
          placeholderTextColor="#8A918E"
          style={[styles.input, { height: 120 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 28 }}>
        <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }, saving && { opacity: 0.7 }]} disabled={saving} onPress={save}>
          <Text style={styles.primaryText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => setConfirm(true)}>
          <Text style={[styles.primaryText, { color: '#E6F0EC' }]}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={confirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirm(false)}
        onConfirm={performDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 20 },
  back: { color: '#9AA4A0', fontSize: 24, paddingVertical: 4 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginVertical: 12 },
  label: { color: '#A8B0AE', marginTop: 14, marginBottom: 8 },
  fieldBox: { backgroundColor: '#1F2624', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  input: { color: '#E6F0EC', fontSize: 16, paddingVertical: 2 },
  primaryBtn: { backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  deleteBtn: { backgroundColor: '#1F2624', paddingVertical: 16, borderRadius: 999, alignItems: 'center', paddingHorizontal: 18 },
  primaryText: { color: '#0B1110', fontSize: 18, fontWeight: '700' },
  error: { color: '#ef4444', marginTop: 12 },
});

