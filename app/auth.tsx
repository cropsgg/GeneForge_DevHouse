import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signUp, signIn } from './auth/auth';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useContext(AuthContext) || { setUser: () => {} };
  const { isDark } = useTheme();

  const handleSignUp = async () => {
    const { user, error } = await signUp(email, password);
    if (error) {
      setError(error.message);
      Alert.alert('Sign Up Error', error.message);
    } else {
      console.log('User signed up:', user);
      setUser(user);
      router.push('/');
    }
  };

  const handleSignIn = async () => {
    const { user, error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      Alert.alert('Sign In Error', error.message);
    } else {
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

  return (
    <LinearGradient
      colors={isDark ? ['#1F2937', '#111827'] : ['#F9FAFB', '#F3F4F6']}
      style={styles.container}
    >
      <View style={[styles.innerContainer, isDark && styles.innerContainerDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Welcome to GeneEdit AI</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, isDark && styles.inputDark]}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
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
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, isDark && styles.dividerDark]} />
          <Text style={[styles.dividerText, isDark && styles.dividerTextDark]}>OR</Text>
          <View style={[styles.divider, isDark && styles.dividerDark]} />
        </View>
        
        <TouchableOpacity 
          style={[styles.getStartedButton, isDark && styles.getStartedButtonDark]} 
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  titleDark: {
    color: '#F9FAFB',
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