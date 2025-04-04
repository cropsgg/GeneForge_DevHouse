import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { AptosClient, Types } from 'aptos';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';

// Define types for wallet context
type AccountInfo = {
  address: string;
  publicKey: string | null;
  authKey: string | null;
  chainId?: number;
};

type WalletContextType = {
  account: AccountInfo | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<Types.HexEncodedBytes>;
  network: string;
  chainId: number;
  balance: string;
  isPetraInstalled: boolean;
};

// Create context with default values
export const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnected: false,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  signAndSubmitTransaction: async () => '',
  network: 'testnet',
  chainId: 2, // testnet
  balance: '0',
  isPetraInstalled: false,
});

// Networks and nodes configuration
const NETWORKS = {
  mainnet: 'https://fullnode.mainnet.aptoslabs.com',
  testnet: 'https://fullnode.testnet.aptoslabs.com',
  devnet: 'https://fullnode.devnet.aptoslabs.com',
};

interface WalletProviderProps {
  children: ReactNode;
}

// Add these helper functions at the top of the file, after imports
// Check if Petra wallet is available
const isPetraAvailable = async (): Promise<boolean> => {
  console.log('DEBUG: Checking Petra availability');
  if (Platform.OS === 'web') {
    // @ts-ignore - window.aptos is injected by Petra wallet
    return !!window.aptos;
  }
  // For mobile, we'll assume it's not available in Expo Go
  console.log('DEBUG: On mobile, assuming Petra is not available');
  return false;
};

// Petra wallet interface for unified access
const petra = {
  connect: async () => {
    console.log('DEBUG: petra.connect called');
    if (Platform.OS === 'web') {
      try {
        // @ts-ignore - window.aptos is injected by Petra wallet
        const response = await window.aptos.connect();
        console.log('DEBUG: Web Petra connection response:', response);
        
        const accountInfo: AccountInfo = {
          address: response.address,
          publicKey: response.publicKey || null,
          authKey: null,
          chainId: response.chainId,
        };
        
        return accountInfo;
      } catch (error) {
        console.log('DEBUG: Error in petra.connect for web:', error);
        throw error;
      }
    } else {
      // Mobile implementation - this is a placeholder
      console.log('DEBUG: Using mock account for mobile');
      const mockAccount: AccountInfo = {
        address: "0x9404087f7a71e400241bf69bfc40982a22abc142bbfd9282cbd096354169d1bc",
        publicKey: null,
        authKey: null,
        chainId: 2,
      };
      return mockAccount;
    }
  },
  
  disconnect: async () => {
    console.log('DEBUG: petra.disconnect called');
    if (Platform.OS === 'web') {
      try {
        // @ts-ignore - window.aptos is injected by Petra wallet
        await window.aptos.disconnect();
        console.log('DEBUG: Web Petra disconnected successfully');
      } catch (error) {
        console.log('DEBUG: Error in petra.disconnect for web:', error);
        throw error;
      }
    }
    // For mobile, no actual disconnection needed for mock account
    return true;
  }
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isPetraInstalled, setIsPetraInstalled] = useState<boolean>(false);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('testnet');
  const [chainId, setChainId] = useState<number>(2); // testnet
  const [balance, setBalance] = useState<string>('0');
  const { isDark } = useTheme();

  // Initialize client for blockchain interactions
  const client = new AptosClient(NETWORKS[network as keyof typeof NETWORKS]);

  // Check if Petra is installed on web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // For web browsers, check if window.aptos exists
      const checkPetraInstalled = async () => {
        try {
          //@ts-ignore - window.aptos is injected by Petra wallet
          const isInstalled = window.aptos !== undefined;
          setIsPetraInstalled(isInstalled);
        } catch (error) {
          console.error("Error checking for Petra wallet:", error);
          setIsPetraInstalled(false);
        }
      };
      
      checkPetraInstalled();
    } else {
      // For mobile, we'll use alternative methods
      setIsPetraInstalled(true);
    }
  }, []);

  // Restore connection from storage on app startup
  useEffect(() => {
    const restoreConnection = async () => {
      try {
        const savedAccount = await AsyncStorage.getItem('walletAccount');
        if (savedAccount) {
          const parsedAccount = JSON.parse(savedAccount);
          setAccount(parsedAccount);
          setIsConnected(true);
          fetchBalance(parsedAccount.address);
        }
      } catch (error) {
        console.error("Failed to restore wallet connection:", error);
      }
    };

    restoreConnection();
  }, []);

  // Fetch account balance
  const fetchBalance = async (address: string | undefined) => {
    console.log('DEBUG: fetchBalance called with address:', address);
    if (!address) {
      console.log('DEBUG: No address provided to fetchBalance');
      return '0';
    }
    
    try {
      console.log('DEBUG: Creating Aptos client');
      const client = new AptosClient(NETWORKS[network as keyof typeof NETWORKS]);
      console.log('DEBUG: Using NODE_URL:', NETWORKS[network as keyof typeof NETWORKS]);
      
      console.log('DEBUG: Requesting account resources');
      const resources = await client.getAccountResources(address);
      console.log('DEBUG: Resources received, count:', resources.length);
      
      const accountResource = resources.find((r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
      console.log('DEBUG: Account resource found:', !!accountResource);
      
      if (!accountResource) {
        return '0';
      }
      
      // @ts-ignore
      const coin = accountResource.data.coin.value;
      const balance = (parseInt(coin) / 100000000).toFixed(4);
      console.log('DEBUG: Calculated balance:', balance);
      return balance;
    } catch (error) {
      console.log('DEBUG: Error in fetchBalance:', error);
      console.error('Error fetching balance:', error);
      // Return a default value instead of throwing
      return 'N/A';
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    console.log('DEBUG: Starting wallet connection process');
    console.log('DEBUG: Platform.OS =', Platform.OS);
    
    try {
      console.log('DEBUG: Checking if Petra is installed');
      const installed = await isPetraAvailable();
      setIsPetraInstalled(installed);
      console.log('DEBUG: Petra installed =', installed);

      if (!installed) {
        console.log('DEBUG: Petra not installed, aborting connection');
        setIsConnecting(false);
        return;
      }

      console.log('DEBUG: Attempting to connect wallet');
      // Attempt connection and catch any errors
      let wallAddress;
      try {
        wallAddress = await petra.connect();
        console.log('DEBUG: Connection successful, address =', wallAddress);
      } catch (error) {
        console.log('DEBUG: Connection error:', error);
        setIsConnecting(false);
        return;
      }

      setAccount(wallAddress);
      setIsConnected(true);
      
      // Fetch balance with better error handling
      try {
        console.log('DEBUG: Fetching balance for address', wallAddress?.address);
        const balanceResult = await fetchBalance(wallAddress?.address);
        console.log('DEBUG: Balance result =', balanceResult);
        setBalance(balanceResult);
      } catch (error) {
        console.log('DEBUG: Error fetching balance:', error);
        // Continue even if balance fetch fails
        setBalance('Error');
      }
    } catch (error) {
      console.log('DEBUG: Critical wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web implementation
        //@ts-ignore
        if (window.aptos) {
          //@ts-ignore
          await window.aptos.disconnect();
        }
      }
      
      // Clear state and storage
      setAccount(null);
      setIsConnected(false);
      setBalance('0');
      await AsyncStorage.removeItem('walletAccount');
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  // Sign and submit transaction
  const signAndSubmitTransaction = async (payload: Types.TransactionPayload): Promise<Types.HexEncodedBytes> => {
    if (!account) {
      throw new Error("Wallet not connected");
    }
    
    try {
      if (Platform.OS === 'web') {
        // Web implementation
        //@ts-ignore
        const response = await window.aptos.signAndSubmitTransaction(payload);
        return response.hash;
      } else {
        // Mobile implementation would go here
        throw new Error("Mobile transaction signing not implemented");
      }
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  };

  // Context value
  const contextValue: WalletContextType = {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    signAndSubmitTransaction,
    network,
    chainId,
    balance,
    isPetraInstalled
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook for using the wallet context
export const useWallet = () => useContext(WalletContext); 