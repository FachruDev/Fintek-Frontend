import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme';

type ToastType = 'success' | 'error' | 'info';

type ShowArgs = {
  type?: ToastType;
  duration?: number; // ms
};

type ToastContextType = {
  show: (message: string, opts?: ShowArgs) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<ToastType>('info');
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hide = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start(() => {
      setVisible(false);
    });
  }, [opacity]);

  const show = useCallback((msg: string, opts?: ShowArgs) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    setType(opts?.type || 'info');
    setVisible(true);
    Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start();
    const dur = opts?.duration ?? 2000;
    timerRef.current = setTimeout(hide, dur);
  }, [hide, opacity]);

  const value = useMemo(() => ({ show }), [show]);

  const { palette } = useAppTheme();
  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible && (
        <Animated.View pointerEvents="none" style={[styles.container, { opacity }]}> 
          <View style={[styles.toast, { backgroundColor: palette.background, borderColor: palette.tabIconDefault }, type === 'success' && { borderColor: '#22c55e' }, type === 'error' && { borderColor: '#ef4444' }]}>
            <Text style={[styles.text, { color: palette.text }]}>{message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
  toast: { maxWidth: '90%', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1 },
  text: {},
});
