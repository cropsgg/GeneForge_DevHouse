import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

import { signUp } from './auth/auth';
import { AuthContext } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useContext(AuthContext) || { setUser: () => {} };
  const { isDark } = useTheme();

  const handleSignUp = async () => {
    // Reset previous errors
    setError(null);
    
    // Validate inputs
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Proceed with signup
    const { user, error } = await signUp(email, password);
    if (error) {
      setError(error.message);
      Alert.alert('Sign Up Error', error.message);
    } else {
      // eslint-disable-next-line no-console
      console.log('User signed up:', user);
      // In a real app, you would also save the username to the user profile
      setUser(user);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
    }
  };

  const navigateToSignIn = () => {
    router.push('/auth');
  };

  return (
    <LinearGradient
      colors={isDark ? ['#1F2937', '#111827'] : ['#F9FAFB', '#F3F4F6']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.innerContainer, isDark && styles.innerContainerDark]}>
          <Text style={[styles.title, isDark && styles.titleDark]}>Create Account</Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            Join GeneEdit AI today
          </Text>
          
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={[styles.input, isDark && styles.inputDark]}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            autoCapitalize="none"
          />
          
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
          
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={[styles.input, isDark && styles.inputDark]}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          />
          
          {error && <Text style={styles.error}>{error}</Text>}
          
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.signinContainer}>
            <Text style={[styles.signinText, isDark && styles.signinTextDark]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={navigateToSignIn}>
              <Text style={styles.signinLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
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
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  signinText: {
    color: '#4B5563',
    marginRight: 5,
  },
  signinTextDark: {
    color: '#9CA3AF',
  },
  signinLink: {
    color: '#6366F1',
    fontWeight: 'bold',
  },
});