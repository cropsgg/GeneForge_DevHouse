// Polyfills for React Native
import { Buffer } from 'buffer';
import 'react-native-url-polyfill/auto';

// DIAGNOSTIC LOGGING: Check ErrorUtils availability at initial load
// eslint-disable-next-line no-console
console.log(
  '[REANIMATED DEBUG] Initial load - ErrorUtils available:',
  typeof global !== 'undefined' &&
    typeof (global as any).ErrorUtils !== 'undefined' &&
    typeof (global as any).ErrorUtils?.setGlobalHandler !== 'undefined'
);

// DIAGNOSTIC LOGGING: Log loaded modules related to Reanimated
// eslint-disable-next-line no-console
console.log(
  '[REANIMATED DEBUG] Modules loaded:',
  Object.keys(require.cache || {})
    .filter(path => path?.includes('reanimated'))
    .map(path => path.split('/').slice(-2).join('/'))
);

// TypeScript declarations for global objects
declare global {
  namespace NodeJS {
    interface Global {
      ErrorUtils?: {
        setGlobalHandler: (callback: Function) => void;
        getGlobalHandler: () => Function;
      };
    }
  }
}

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

// DIAGNOSTIC LOGGING: Intercept ErrorUtils.setGlobalHandler calls
if (typeof global !== 'undefined') {
  const globalAny = global as any;

  // Store original implementation if it exists
  const originalErrorUtils = globalAny.ErrorUtils;
  const originalSetGlobalHandler = originalErrorUtils?.setGlobalHandler;

  // Create or modify ErrorUtils
  if (!globalAny.ErrorUtils) {
    // eslint-disable-next-line no-console
    console.log('[REANIMATED DEBUG] ErrorUtils not found - creating proxy');
    globalAny.ErrorUtils = {
      setGlobalHandler(handler: Function) {
        // eslint-disable-next-line no-console
        console.log(
          '[REANIMATED DEBUG] setGlobalHandler called with missing ErrorUtils by:',
          new Error().stack?.split('\n').slice(1, 4).join('\n')
        );
        return undefined;
      },
      getGlobalHandler: () => {
        // eslint-disable-next-line no-console
        console.log('[REANIMATED DEBUG] getGlobalHandler called with missing ErrorUtils');
        return () => {};
      },
    };
  } else if (originalErrorUtils && originalSetGlobalHandler) {
    // Wrap existing implementation to log calls
    // eslint-disable-next-line no-console
    console.log('[REANIMATED DEBUG] Wrapping existing ErrorUtils.setGlobalHandler');
    globalAny.ErrorUtils.setGlobalHandler = function (handler: Function) {
      // eslint-disable-next-line no-console
      console.log(
        '[REANIMATED DEBUG] Original setGlobalHandler called by:',
        new Error().stack?.split('\n').slice(1, 4).join('\n')
      );
      return originalSetGlobalHandler(handler);
    };
  } else if (globalAny.ErrorUtils && !globalAny.ErrorUtils.setGlobalHandler) {
    // ErrorUtils exists but setGlobalHandler doesn't
    // eslint-disable-next-line no-console
    console.log('[REANIMATED DEBUG] ErrorUtils exists but missing setGlobalHandler - adding it');
    globalAny.ErrorUtils.setGlobalHandler = function (handler: Function) {
      // eslint-disable-next-line no-console
      console.log(
        '[REANIMATED DEBUG] Added setGlobalHandler called by:',
        new Error().stack?.split('\n').slice(1, 4).join('\n')
      );
      return undefined;
    };
  }

  // Also intercept global.console.error to see if errors are related
  const originalConsoleError = console.error;
  console.error = function (...args: any[]) {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('Reanimated') || args[0].includes('setGlobalHandler'))
    ) {
      // eslint-disable-next-line no-console
      console.log('[REANIMATED DEBUG] Related error detected:', args[0]);
    }
    return originalConsoleError.apply(this, args);
  };
}
