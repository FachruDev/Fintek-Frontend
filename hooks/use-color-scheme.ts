import { useAppTheme } from '@/lib/theme';

// Expose resolved color scheme from the app theme
export function useColorScheme() {
  const { colorScheme } = useAppTheme();
  return colorScheme;
}
