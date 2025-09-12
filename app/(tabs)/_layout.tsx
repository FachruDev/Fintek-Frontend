import { Tabs } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'dark'];
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: palette.tint,
      tabBarInactiveTintColor: palette.tabIconDefault,
      tabBarStyle: { backgroundColor: palette.background, borderTopColor: palette.border },
    }}>
      <Tabs.Screen name="summary" options={{
        title: 'Summary',
        tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} />,
      }} />
      <Tabs.Screen name="transactions" options={{
        title: 'Transactions',
        tabBarIcon: ({ color }) => <IconSymbol name="list.bullet" size={24} color={color} />,
      }} />
      <Tabs.Screen name="categories" options={{
        title: 'Categories',
        tabBarIcon: ({ color }) => <IconSymbol name="tag.fill" size={24} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color }) => <IconSymbol name="person.fill" size={24} color={color} />,
      }} />
    </Tabs>
  );
}
