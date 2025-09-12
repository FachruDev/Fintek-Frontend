import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/lib/use-auth';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ToastProvider } from '@/components/ui/toast';
import { AppThemeProvider } from '@/lib/theme';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppThemeProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <ToastProvider>
            <Stack>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
              <Stack.Screen name="transaction" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppThemeProvider>
  );
}
