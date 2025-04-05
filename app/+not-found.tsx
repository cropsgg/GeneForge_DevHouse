import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from './context/ThemeContext';

export default function NotFoundScreen() {
  const { isDark } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Oops!',
          headerTitleStyle: {
            color: isDark ? '#F9FAFB' : '#111827',
          },
          headerStyle: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          },
        }}
      />
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.text, isDark && styles.textDark]}>This screen doesn't exist.</Text>
        <Link href="/" style={[styles.link, isDark && styles.linkDark]}>
          <Text style={[styles.linkText, isDark && styles.linkTextDark]}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  textDark: {
    color: '#F9FAFB',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  linkDark: {
    backgroundColor: '#374151',
  },
  linkText: {
    color: '#111827',
    fontFamily: 'Inter_500Medium',
  },
  linkTextDark: {
    color: '#F9FAFB',
  },
});
