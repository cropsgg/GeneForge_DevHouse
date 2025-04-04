import { Tabs } from 'expo-router';
import { Chrome as Home, Database, Info, Settings } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#94A3B8',
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'transparent',
            position: 'absolute',
            borderTopWidth: 0,
          },
          android: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E2E8F0',
          },
          default: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E2E8F0',
          },
        }),
        tabBarBackground: Platform.OS === 'ios' ? () => (
          <BlurView
            tint={isDark ? 'dark' : 'light'}
            intensity={95}
            style={StyleSheet.absoluteFill}
          />
        ) : undefined,
        headerStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'Inter_600SemiBold',
          color: isDark ? '#F9FAFB' : '#111827',
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="predict"
        options={{
          title: 'Predict',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Database size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}