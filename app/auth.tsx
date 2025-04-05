import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { signIn } from './auth/auth';
import { AuthContext } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useContext(AuthContext) || { setUser: () => {} };
  const { isDark } = useTheme();

  const handleSignIn = async () => {
    const { user, error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      Alert.alert('Sign In Error', error.message);
    } else {
      // eslint-disable-next-line no-console
      console.log('User signed in:', user);
      setUser(user);
      router.push('/');
    }
  };

  const handleGetStarted = () => {
    // Set a guest user to bypass authentication
    setUser({ id: 'guest', email: 'guest@example.com', role: 'guest' });
    router.push('/');
  };

  const navigateToSignUp = () => {
    router.push('/signup');
  };

  return (
    <LinearGradient
      colors={isDark ? ['#1F2937', '#111827'] : ['#F9FAFB', '#F3F4F6']}
      style={styles.container}
    >
      <View style={[styles.innerContainer, isDark && styles.innerContainerDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Welcome Back</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          Sign in to your GeneEdit AI account
        </Text>
        
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, isDark && styles.inputDark]}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, isDark && styles.inputDark]}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, isDark && styles.signupTextDark]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, isDark && styles.dividerDark]} />
          <Text style={[styles.dividerText, isDark && styles.dividerTextDark]}>OR</Text>
          <View style={[styles.divider, isDark && styles.dividerDark]} />
        </View>

        <TouchableOpacity
          style={[styles.getStartedButton, isDark && styles.getStartedButtonDark]}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Continue as Guest</Text>
        </TouchableOpacity>
        <Text style={[styles.disclaimer, isDark && styles.disclaimerDark]}>
          No account required. Some features may be limited.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
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
  innerContainerDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#111827',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B5563',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  input: {
    height: 50,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    color: '#F9FAFB',
  },
  error: {
    color: '#EF4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  signupText: {
    color: '#4B5563',
    marginRight: 5,
  },
  signupTextDark: {
    color: '#9CA3AF',
  },
  signupLink: {
    color: '#6366F1',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerDark: {
    backgroundColor: '#4B5563',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  dividerTextDark: {
    color: '#9CA3AF',
  },
  getStartedButton: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  getStartedButtonDark: {
    backgroundColor: '#065F46',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
    marginTop: 5,
  },
  disclaimerDark: {
    color: '#9CA3AF',
  },
});
