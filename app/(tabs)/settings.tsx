import { useRouter } from 'expo-router';
import { Bell, Moon, ChartBar, Shield, Mail, Key } from 'lucide-react-native';
import { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Button } from 'react-native';

import { signOut } from '../auth/auth';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useContext(AuthContext) || { user: null };
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Logout Error:', error);
    } else {
      router.push('/auth');
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.title, isDark && styles.textDark]}>Settings</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          Manage your app preferences and account settings
        </Text>
      </View>

      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Profile</Text>
          {user ? (
            <View style={[styles.settingCard, isDark && styles.settingCardDark]}>
              <View style={styles.settingHeader}>
                <Mail size={20} color={isDark ? '#6366F1' : '#4F46E5'} />
                <Text style={[styles.settingText, isDark && styles.textDark]}>{user.email}</Text>
              </View>
              <Button
                title="Logout"
                onPress={handleLogout}
                color={isDark ? '#6366F1' : '#4F46E5'}
              />
            </View>
          ) : (
            <View style={[styles.settingCard, isDark && styles.settingCardDark]}>
              <Text style={[styles.errorText, isDark && styles.textDark]}>
                No user is signed in
              </Text>
            </View>
          )}
        </View>

        {/* Existing Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Preferences</Text>

          <View style={[styles.settingCard, isDark && styles.settingCardDark]}>
            <View style={styles.settingHeader}>
              <Bell size={20} color={isDark ? '#6366F1' : '#4F46E5'} />
              <Text style={[styles.settingText, isDark && styles.textDark]}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
              thumbColor={notifications ? '#6366F1' : '#F3F4F6'}
            />
          </View>

          <View style={[styles.settingCard, isDark && styles.settingCardDark]}>
            <View style={styles.settingHeader}>
              <Moon size={20} color={isDark ? '#6366F1' : '#4F46E5'} />
              <Text style={[styles.settingText, isDark && styles.textDark]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
              thumbColor={isDark ? '#6366F1' : '#F3F4F6'}
            />
          </View>

          <View style={[styles.settingCard, isDark && styles.settingCardDark]}>
            <View style={styles.settingHeader}>
              <ChartBar size={20} color={isDark ? '#6366F1' : '#4F46E5'} />
              <Text style={[styles.settingText, isDark && styles.textDark]}>Analytics</Text>
            </View>
            <Switch
              value={analytics}
              onValueChange={setAnalytics}
              trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
              thumbColor={analytics ? '#6366F1' : '#F3F4F6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Account</Text>

          <TouchableOpacity style={[styles.settingCard, isDark && styles.settingCardDark]}>
            <View style={styles.settingHeader}>
              <Mail size={20} color={isDark ? '#6366F1' : '#4F46E5'} />
              <Text style={[styles.settingText, isDark && styles.textDark]}>Email Preferences</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingCard, isDark && styles.settingCardDark]}>
            <View style={styles.settingHeader}>
              <Key size={20} color={isDark ? '#6366F1' : '#4F46E5'} />
              <Text style={[styles.settingText, isDark && styles.textDark]}>Change Password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingCard, isDark && styles.settingCardDark]}>
            <View style={styles.settingHeader}>
              <Shield size={20} color={isDark ? '#6366F1' : '#4F46E5'} />
              <Text style={[styles.settingText, isDark && styles.textDark]}>Privacy Settings</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>App Information</Text>
          <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
            <Text style={[styles.infoText, isDark && styles.infoTextDark]}>Version: 1.0.0</Text>
            <Text style={[styles.infoText, isDark && styles.infoTextDark]}>Build: 2025.1.1</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#F9FAFB',
  },
  headerDark: {
    backgroundColor: '#1F2937',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingCardDark: {
    backgroundColor: '#1F2937',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
    marginLeft: 12,
  },
  textDark: {
    color: '#F9FAFB',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  infoCardDark: {
    backgroundColor: '#1F2937',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  infoTextDark: {
    color: '#9CA3AF',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});
