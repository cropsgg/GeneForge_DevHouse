// Polyfills for React Native
import { Buffer } from 'buffer';
import 'react-native-url-polyfill/auto';

// Add Buffer to global scope
if (typeof global !== 'undefined') {
  // @ts-ignore
  global.Buffer = Buffer;
}

// Make sure process is available
if (typeof global.process === 'undefined') {
  // @ts-ignore
  global.process = { env: {} };
} 