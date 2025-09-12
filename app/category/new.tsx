import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { createCategory } from '@/lib/api';
import { useRequireAuth } from '@/lib/use-require-auth';
import { useToast } from '@/components/ui/toast';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];

export default function NewCategory() {
  useRequireAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<'income' | 'expense' | ''>('');
  const [color, setColor] = useState<string>('#22c55e');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim() || !kind) {
      setError('Name and type are required');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await createCategory({ name: name.trim(), kind, color });
      toast.show('Category created', { type: 'success' });
      router.back();
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>{'<'} </Text>
      </TouchableOpacity>
      <Text style={styles.title}>New Category</Text>

      <Text style={styles.label}>Category Name</Text>
      <View style={styles.fieldBox}>
        <TextInput
          placeholder="e.g., Groceries"
          placeholderTextColor="#8A918E"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <Text style={styles.label}>Type</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity onPress={() => setKind('income')} style={[styles.choice, kind === 'income' && styles.choiceActive]}>
          <Text style={[styles.choiceText, kind === 'income' && styles.choiceTextActive]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setKind('expense')} style={[styles.choice, kind === 'expense' && styles.choiceActive]}>
          <Text style={[styles.choiceText, kind === 'expense' && styles.choiceTextActive]}>Expense</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
        {COLORS.map((c) => (
          <TouchableOpacity key={c} onPress={() => setColor(c)}>
            <View style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={[styles.primaryBtn, saving && { opacity: 0.7 }]} disabled={saving} onPress={save}>
        <Text style={styles.primaryText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1513', padding: 20 },
  back: { color: '#9AA4A0', fontSize: 24, paddingVertical: 4 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginVertical: 12 },
  label: { color: '#A8B0AE', marginTop: 14, marginBottom: 8 },
  fieldBox: { backgroundColor: '#1F2624', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6 },
  input: { color: '#E6F0EC', fontSize: 16, paddingVertical: 12 },
  choice: { backgroundColor: '#1F2624', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999 },
  choiceActive: { backgroundColor: '#22c55e' },
  choiceText: { color: '#E6F0EC' },
  choiceTextActive: { color: '#0B1110', fontWeight: '700' },
  colorDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
  colorDotActive: { borderColor: '#22c55e' },
  primaryBtn: { marginTop: 28, backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  primaryText: { color: '#0B1110', fontSize: 18, fontWeight: '700' },
  error: { color: '#ef4444', marginTop: 12 },
});
