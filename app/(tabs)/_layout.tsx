import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  Database,
  Settings,
  ActivityIcon,
  BarChart2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react-native';
import React, { useEffect, useState, Profiler } from 'react';
import {
  Platform,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { ChatBot } from '../components/ChatBot';
import { useTheme } from '../context/ThemeContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDark } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Add logging to diagnose route issues
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('DEBUG: Tab Layout rendered, isDark =', isDark);
    // Log available tab routes
    try {
      const tabRoutes = ['index', 'predict', 'about', 'settings'];
      // eslint-disable-next-line no-console
      console.log('DEBUG: Available tab routes:', tabRoutes);
      // eslint-disable-next-line no-console
      console.log('DEBUG: Using colorScheme:', colorScheme);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('DEBUG: Error checking tab routes:', error);
    }
  }, [isDark, colorScheme]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? '#818CF8' : '#6366F1',
          tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
          tabBarStyle: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
            paddingBottom: 10,
            paddingTop: 10,
            height: 60,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="predict"
          options={{
            title: 'Predict',
            tabBarIcon: ({ color }) => <BarChart2 size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'Track',
            tabBarIcon: ({ color }) => <AlertCircle size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
          }}
        />

        {/* Comment out or remove any references to "profile" route */}
        {/* Tabs.Screen for ProfileScreen will go here if needed in the future */}
      </Tabs>

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={[styles.floatingButton, isDark && styles.floatingButtonDark]}
        onPress={handleOpenChat}
      >
        <MessageCircle size={24} color={isDark ? '#F9FAFB' : '#FFFFFF'} />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={isChatOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsChatOpen(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setIsChatOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
            <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                  AI Assistant
                </Text>
                <TouchableOpacity onPress={() => setIsChatOpen(false)}>
                  <Text style={[styles.closeButton, isDark && styles.closeButtonDark]}>✕</Text>
                </TouchableOpacity>
              </View>
              <ChatBot />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonDark: {
    backgroundColor: '#4F46E5',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingBottom: 100,
  },
  modalContent: {
    width: 300,
    height: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContentDark: {
    backgroundColor: '#111827',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  modalTitleDark: {
    color: '#F9FAFB',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    padding: 5,
  },
  closeButtonDark: {
    color: '#9CA3AF',
  },
});
