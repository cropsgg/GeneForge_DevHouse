import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Linking } from 'react-native';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext';
import { Wallet } from 'lucide-react-native';

const WalletConnect = () => {
  const { 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet, 
    account, 
    balance,
    isPetraInstalled 
  } = useWallet();
  const { isDark } = useTheme();

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
  };

  // Button to install Petra
  const installPetraButton = () => {
    if (Platform.OS !== 'web') {
      return (
        <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
          Please use a mobile wallet app to connect.
        </Text>
      );
    }

    // Handle opening the Petra website
    const openPetraWebsite = () => {
      if (Platform.OS === 'web') {
        // Only use window.open on web platforms
        // @ts-ignore
        window.open('https://petra.app/', '_blank');
      } else {
        // Use Linking for mobile platforms
        Linking.openURL('https://petra.app/');
      }
    };

    return (
      <View style={styles.walletInfoContainer}>
        <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
          Petra wallet is not installed
        </Text>
        <TouchableOpacity 
          style={[styles.installButton, isDark && styles.installButtonDark]}
          onPress={openPetraWebsite}
        >
          <Text style={styles.installButtonText}>Install Petra</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Connected wallet info view
  const connectedWalletInfo = () => (
    <View style={[styles.walletInfoContainer, isDark && styles.walletInfoContainerDark]}>
      <View style={styles.addressContainer}>
        <Wallet size={16} color={isDark ? '#818CF8' : '#6366F1'} />
        <Text style={[styles.addressText, isDark && styles.addressTextDark]}>
          {formatAddress(account?.address || '')}
        </Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={[styles.balanceLabel, isDark && styles.balanceLabelDark]}>Balance:</Text>
        <Text style={[styles.balanceValue, isDark && styles.balanceValueDark]}>
          {balance} APT
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.disconnectButton, isDark && styles.disconnectButtonDark]} 
        onPress={disconnectWallet}
      >
        <Text style={styles.disconnectButtonText}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );

  // Connect button
  const connectButton = () => (
    <TouchableOpacity 
      style={[styles.connectButton, isDark && styles.connectButtonDark]} 
      onPress={connectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          <Wallet size={16} color="#FFFFFF" style={styles.walletIcon} />
          <Text style={styles.connectButtonText}>Connect Wallet</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!isPetraInstalled ? (
        installPetraButton()
      ) : isConnected ? (
        connectedWalletInfo()
      ) : (
        connectButton()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  walletInfoContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  walletInfoContainerDark: {
    backgroundColor: '#1F2937',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
    marginLeft: 6,
  },
  addressTextDark: {
    color: '#F9FAFB',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginRight: 4,
  },
  balanceLabelDark: {
    color: '#9CA3AF',
  },
  balanceValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#6366F1',
  },
  balanceValueDark: {
    color: '#818CF8',
  },
  connectButton: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonDark: {
    backgroundColor: '#4F46E5',
  },
  walletIcon: {
    marginRight: 8,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  disconnectButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  disconnectButtonDark: {
    backgroundColor: '#B91C1C',
  },
  disconnectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoTextDark: {
    color: '#9CA3AF',
  },
  installButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  installButtonDark: {
    backgroundColor: '#059669',
  },
  installButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
})

export default WalletConnect; 