import './polyfills';
import { useEffect, useContext, useState, useCallback } from 'react';
import React from 'react';
import { Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { SmartContractProvider } from './context/SmartContractContext';
import { ActivityIndicator, View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

function RootLayoutContent({ validateChildrenForTextNodes }: { validateChildrenForTextNodes?: (children: React.ReactNode) => void }) {
  useFrameworkReady();
  const { isDark } = useTheme();
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && fontsLoaded) {
      if (user === null) {
        router.replace('/auth'); // Redirect to AuthScreen if not logged in
      } else {
        router.replace('/(tabs)'); // Navigate to main app
      }
    }
  }, [user, isMounted, fontsLoaded, router]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#111827' : '#FFFFFF' }}>
        <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#111827'} />
      </View>
    );
  }

  const children = <Slot />;
  
  // Run validation if provided
  if (validateChildrenForTextNodes) {
    validateChildrenForTextNodes(children);
  }
  
  console.log('DEBUG: Rendering RootLayoutContent with isDark =', isDark);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </>
  );
}

export default function RootLayout() {
  console.log('DEBUG: Rendering RootLayout');
  
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Log font loading status
  console.log('DEBUG: Fonts loaded =', loaded, 'Font error =', error);

  // Log any children text nodes that might cause the text string error
  const validateChildrenForTextNodes = (children: React.ReactNode) => {
    console.log('DEBUG: Validating children for direct text nodes');
    // This is just for logging, not a fix
    React.Children.forEach(children, child => {
      if (typeof child === 'string') {
        console.log('DEBUG: Found direct text child:', child);
      }
    });
  };

  useEffect(() => {
    // Log available routes for debugging
    console.log('DEBUG: Available routes in layout:', 
      Object.keys(require.context('../app', true, /\.(js|jsx|ts|tsx)$/)
        .keys()
        .filter(key => !key.includes('_'))
        .map(key => key.replace(/^\.\//, '').replace(/\.(js|jsx|ts|tsx)$/, ''))));
  }, []);

  // Use onError callback to capture navigation errors
  const onNavigationError = useCallback((error: Error) => {
    console.log('DEBUG: Navigation error:', error.message);
  }, []);

  // Use the onReady callback to log the initial state
  const onNavigationReady = useCallback(() => {
    console.log('DEBUG: Navigation ready');
  }, []);

  // Show a splash screen until everything is ready
  useEffect(() => {
    if (loaded) {
      console.log('DEBUG: SplashScreen hiding');
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <SmartContractProvider network="testnet">
            <RootLayoutContent validateChildrenForTextNodes={validateChildrenForTextNodes} />
          </SmartContractProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
