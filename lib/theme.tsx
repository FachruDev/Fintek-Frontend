import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, useColorScheme as _useSystemColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colorScheme: 'light' | 'dark';
  palette: typeof Colors.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme_mode';

function readStoredMode(): ThemeMode | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try { return (window.localStorage.getItem(STORAGE_KEY) as ThemeMode) || null; } catch {}
  }
  return null;
}

function writeStoredMode(mode: ThemeMode) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try { window.localStorage.setItem(STORAGE_KEY, mode); } catch {}
  }
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = _useSystemColorScheme() === 'dark' ? 'dark' : 'light';
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode() || 'system');

  useEffect(() => { writeStoredMode(mode); }, [mode]);

  const colorScheme = mode === 'system' ? system : mode;
  const palette = useMemo(() => Colors[colorScheme], [colorScheme]);

  const setMode = (m: ThemeMode) => setModeState(m);

  const value = useMemo(() => ({ mode, setMode, colorScheme, palette }), [mode, colorScheme, palette]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within AppThemeProvider');
  return ctx;
}

