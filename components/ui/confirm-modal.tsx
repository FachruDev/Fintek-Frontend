import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/lib/theme';

export function ConfirmModal({
  visible,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { palette } = useAppTheme();
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: palette.background, borderColor: '#1F2624' }]}>
          <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
          <Text style={[styles.msg, { color: '#A8B0AE' }]}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={[styles.btnText, { color: '#E6F0EC' }]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.ok]} onPress={onConfirm}>
              <Text style={[styles.btnText, { color: '#0B1110' }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '86%', borderRadius: 16, padding: 16, borderWidth: 1 },
  title: { fontSize: 18, fontWeight: '800' },
  msg: { marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999 },
  cancel: { backgroundColor: '#1F2624' },
  ok: { backgroundColor: '#22c55e' },
  btnText: { fontWeight: '700' },
});
