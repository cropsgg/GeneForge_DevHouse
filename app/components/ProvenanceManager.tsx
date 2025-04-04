import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { useSmartContract } from '../context/SmartContractContext';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext';
import { Database, Upload, RefreshCw, List, ArrowDownCircle, ArrowUpCircle } from 'lucide-react-native';

type Asset = {
  id: string;
  name: string;
  description: string;
  createdAt: number;
};

const ProvenanceManager = () => {
  const { isDark } = useTheme();
  const { isConnected, account } = useWallet();
  const { 
    registerAsset, 
    transferAsset, 
    getAssetHistory, 
    isLoading, 
    lastTransactionHash, 
    error
  } = useSmartContract();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetHistory, setAssetHistory] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetDescription, setNewAssetDescription] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Mock assets for demonstration
  useEffect(() => {
    if (isConnected) {
      setIsLoadingAssets(true);
      // In a real app, we would fetch assets from the blockchain
      setTimeout(() => {
        const mockAssets: Asset[] = [
          {
            id: '0x123',
            name: 'Gene Sequence A',
            description: 'CRISPR modified gene sequence for disease resistance',
            createdAt: Date.now() - 86400000 * 3,
          },
          {
            id: '0x456',
            name: 'Protein Structure B',
            description: 'Novel protein structure with enhanced stability',
            createdAt: Date.now() - 86400000 * 2,
          },
        ];
        setAssets(mockAssets);
        setIsLoadingAssets(false);
      }, 1000);
    } else {
      setAssets([]);
    }
  }, [isConnected]);

  const fetchAssetHistory = async (assetId: string) => {
    if (!assetId) return;
    
    try {
      const history = await getAssetHistory(assetId);
      setAssetHistory(history);
      setSelectedAsset(assetId);
    } catch (err) {
      console.error('Error fetching asset history:', err);
      Alert.alert('Error', 'Failed to fetch asset history');
    }
  };

  const handleRegisterAsset = async () => {
    if (!newAssetName.trim()) {
      Alert.alert('Input Error', 'Please enter an asset name');
      return;
    }

    try {
      const assetId = `0x${Math.random().toString(16).substr(2, 12)}`;
      const metadata = {
        name: newAssetName,
        description: newAssetDescription,
        createdAt: Date.now(),
      };

      await registerAsset(assetId, metadata);
      
      // In a real app, we would fetch the updated assets from blockchain
      // Here we're just updating the local state for demonstration
      setAssets([
        ...assets,
        {
          id: assetId,
          name: newAssetName,
          description: newAssetDescription,
          createdAt: Date.now(),
        },
      ]);
      
      setNewAssetName('');
      setNewAssetDescription('');
      
      Alert.alert('Success', 'Asset registered successfully');
    } catch (err) {
      console.error('Error registering asset:', err);
      Alert.alert('Error', 'Failed to register asset');
    }
  };

  const handleTransferAsset = async () => {
    if (!selectedAsset) {
      Alert.alert('Selection Error', 'Please select an asset first');
      return;
    }

    if (!transferAddress.trim()) {
      Alert.alert('Input Error', 'Please enter a valid destination address');
      return;
    }

    try {
      await transferAsset(selectedAsset, transferAddress);
      
      // In a real app, we would update the assets and history from blockchain
      // Fetch updated history to show the transfer
      fetchAssetHistory(selectedAsset);
      setTransferAddress('');
      
      Alert.alert('Success', 'Asset transferred successfully');
    } catch (err) {
      console.error('Error transferring asset:', err);
      Alert.alert('Error', 'Failed to transfer asset');
    }
  };

  // Render loading state
  if (!isConnected) {
    return (
      <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <View style={styles.notConnectedContainer}>
          <Database size={40} color={isDark ? '#818CF8' : '#6366F1'} />
          <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
            Wallet Not Connected
          </Text>
          <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
            Please connect your wallet to manage gene provenance
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
          Gene Provenance Manager
        </Text>
        <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
          Register and track ownership of gene sequences
        </Text>
      </View>

      {/* Register New Asset Section */}
      <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
        <View style={styles.sectionHeader}>
          <Upload size={20} color={isDark ? '#818CF8' : '#6366F1'} />
          <Text style={[styles.sectionTitle, isDark ? styles.sectionTitleDark : styles.sectionTitleLight]}>
            Register New Gene
          </Text>
        </View>
        
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Gene Name"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={newAssetName}
          onChangeText={setNewAssetName}
        />
        
        <TextInput
          style={[styles.input, styles.textArea, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Description"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={newAssetDescription}
          onChangeText={setNewAssetDescription}
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity 
          style={[styles.button, isDark ? styles.buttonDark : styles.buttonLight]}
          onPress={handleRegisterAsset}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={isDark ? '#1F2937' : '#FFFFFF'} />
          ) : (
            <Text style={[styles.buttonText, isDark ? styles.buttonTextDark : styles.buttonTextLight]}>
              Register
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Assets List Section */}
      <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
        <View style={styles.sectionHeader}>
          <List size={20} color={isDark ? '#818CF8' : '#6366F1'} />
          <Text style={[styles.sectionTitle, isDark ? styles.sectionTitleDark : styles.sectionTitleLight]}>
            Your Genes
          </Text>
          <TouchableOpacity style={styles.refreshButton}>
            <RefreshCw size={16} color={isDark ? '#818CF8' : '#6366F1'} />
          </TouchableOpacity>
        </View>
        
        {isLoadingAssets ? (
          <ActivityIndicator style={styles.loader} size="large" color={isDark ? '#818CF8' : '#6366F1'} />
        ) : assets.length === 0 ? (
          <Text style={[styles.emptyText, isDark ? styles.emptyTextDark : styles.emptyTextLight]}>
            No genes registered yet
          </Text>
        ) : (
          <View style={styles.assetsList}>
            {assets.map((asset) => (
              <TouchableOpacity
                key={asset.id}
                style={[
                  styles.assetItem,
                  isDark ? styles.assetItemDark : styles.assetItemLight,
                  selectedAsset === asset.id && (isDark ? styles.assetItemSelectedDark : styles.assetItemSelectedLight)
                ]}
                onPress={() => fetchAssetHistory(asset.id)}
              >
                <View style={styles.assetContent}>
                  <Text style={[styles.assetName, isDark ? styles.assetNameDark : styles.assetNameLight]}>
                    {asset.name}
                  </Text>
                  <Text style={[styles.assetId, isDark ? styles.assetIdDark : styles.assetIdLight]}>
                    ID: {asset.id}
                  </Text>
                  <Text 
                    numberOfLines={2} 
                    style={[styles.assetDescription, isDark ? styles.assetDescriptionDark : styles.assetDescriptionLight]}
                  >
                    {asset.description}
                  </Text>
                </View>
                {selectedAsset === asset.id && (
                  <View style={styles.assetSelected}>
                    <View style={[styles.indicator, isDark ? styles.indicatorDark : styles.indicatorLight]} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Transfer Asset Section */}
      {selectedAsset && (
        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <View style={styles.sectionHeader}>
            <ArrowUpCircle size={20} color={isDark ? '#818CF8' : '#6366F1'} />
            <Text style={[styles.sectionTitle, isDark ? styles.sectionTitleDark : styles.sectionTitleLight]}>
              Transfer Gene
            </Text>
          </View>
          
          <Text style={[styles.selectedAssetText, isDark ? styles.selectedAssetTextDark : styles.selectedAssetTextLight]}>
            Selected: {assets.find(a => a.id === selectedAsset)?.name || selectedAsset}
          </Text>
          
          <TextInput
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholder="Destination Address"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={transferAddress}
            onChangeText={setTransferAddress}
          />
          
          <TouchableOpacity 
            style={[styles.button, isDark ? styles.buttonDark : styles.buttonLight]}
            onPress={handleTransferAsset}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={isDark ? '#1F2937' : '#FFFFFF'} />
            ) : (
              <Text style={[styles.buttonText, isDark ? styles.buttonTextDark : styles.buttonTextLight]}>
                Transfer
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Asset History Section */}
      {selectedAsset && assetHistory.length > 0 && (
        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <View style={styles.sectionHeader}>
            <ArrowDownCircle size={20} color={isDark ? '#818CF8' : '#6366F1'} />
            <Text style={[styles.sectionTitle, isDark ? styles.sectionTitleDark : styles.sectionTitleLight]}>
              Provenance History
            </Text>
          </View>
          
          <View style={styles.historyList}>
            {assetHistory.map((event, index) => (
              <View 
                key={index} 
                style={[styles.historyItem, isDark ? styles.historyItemDark : styles.historyItemLight]}
              >
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={[styles.historyType, isDark ? styles.historyTypeDark : styles.historyTypeLight]}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Text>
                  <Text style={[styles.historyDate, isDark ? styles.historyDateDark : styles.historyDateLight]}>
                    {new Date(event.timestamp).toLocaleString()}
                  </Text>
                  <View style={styles.historyAddresses}>
                    <Text style={[styles.historyAddressLabel, isDark ? styles.historyLabelDark : styles.historyLabelLight]}>
                      From:
                    </Text>
                    <Text 
                      style={[styles.historyAddress, isDark ? styles.historyAddressDark : styles.historyAddressLight]}
                      numberOfLines={1}
                    >
                      {event.from}
                    </Text>
                  </View>
                  <View style={styles.historyAddresses}>
                    <Text style={[styles.historyAddressLabel, isDark ? styles.historyLabelDark : styles.historyLabelLight]}>
                      To:
                    </Text>
                    <Text 
                      style={[styles.historyAddress, isDark ? styles.historyAddressDark : styles.historyAddressLight]}
                      numberOfLines={1}
                    >
                      {event.to}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Transaction Status */}
      {(lastTransactionHash || error) && (
        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <View style={styles.sectionHeader}>
            <Database size={20} color={isDark ? '#818CF8' : '#6366F1'} />
            <Text style={[styles.sectionTitle, isDark ? styles.sectionTitleDark : styles.sectionTitleLight]}>
              Transaction Status
            </Text>
          </View>
          
          {error && (
            <View style={styles.error}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          )}
          
          {lastTransactionHash && (
            <View style={styles.transactionInfo}>
              <Text style={[styles.txLabel, isDark ? styles.txLabelDark : styles.txLabelLight]}>
                Transaction Hash:
              </Text>
              <Text 
                style={[styles.txHash, isDark ? styles.txHashDark : styles.txHashLight]}
                numberOfLines={1}
              >
                {lastTransactionHash}
              </Text>
              {Platform.OS === 'web' && (
                <TouchableOpacity 
                  style={[styles.viewTxButton, isDark ? styles.viewTxButtonDark : styles.viewTxButtonLight]}
                  onPress={() => {
                    // Open transaction in block explorer
                    window.open(`https://explorer.aptoslabs.com/txn/${lastTransactionHash}?network=testnet`, '_blank');
                  }}
                >
                  <Text style={[styles.viewTxText, isDark ? styles.viewTxTextDark : styles.viewTxTextLight]}>
                    View on Explorer
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  containerLight: {
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleLight: {
    color: '#111827',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  subtitleLight: {
    color: '#6B7280',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  sectionLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  sectionTitleLight: {
    color: '#111827',
  },
  sectionTitleDark: {
    color: '#F9FAFB',
  },
  refreshButton: {
    padding: 4,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputLight: {
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
  },
  inputDark: {
    backgroundColor: '#374151',
    color: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonLight: {
    backgroundColor: '#6366F1',
  },
  buttonDark: {
    backgroundColor: '#818CF8',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextLight: {
    color: '#FFFFFF',
  },
  buttonTextDark: {
    color: '#1F2937',
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  emptyTextLight: {
    color: '#9CA3AF',
  },
  emptyTextDark: {
    color: '#6B7280',
  },
  assetsList: {
    marginTop: 8,
  },
  assetItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
  },
  assetItemLight: {
    backgroundColor: '#F3F4F6',
  },
  assetItemDark: {
    backgroundColor: '#374151',
  },
  assetItemSelectedLight: {
    borderColor: '#6366F1',
    borderWidth: 1,
    backgroundColor: '#EEF2FF',
  },
  assetItemSelectedDark: {
    borderColor: '#818CF8',
    borderWidth: 1,
    backgroundColor: '#2e3755',
  },
  assetContent: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  assetNameLight: {
    color: '#111827',
  },
  assetNameDark: {
    color: '#F9FAFB',
  },
  assetId: {
    fontSize: 12,
    marginBottom: 4,
  },
  assetIdLight: {
    color: '#6B7280',
  },
  assetIdDark: {
    color: '#9CA3AF',
  },
  assetDescription: {
    fontSize: 14,
  },
  assetDescriptionLight: {
    color: '#4B5563',
  },
  assetDescriptionDark: {
    color: '#D1D5DB',
  },
  assetSelected: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorLight: {
    backgroundColor: '#6366F1',
  },
  indicatorDark: {
    backgroundColor: '#818CF8',
  },
  selectedAssetText: {
    marginBottom: 12,
    fontWeight: '500',
  },
  selectedAssetTextLight: {
    color: '#4B5563',
  },
  selectedAssetTextDark: {
    color: '#D1D5DB',
  },
  historyList: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyItemLight: {
    backgroundColor: '#F3F4F6',
  },
  historyItemDark: {
    backgroundColor: '#374151',
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366F1',
    marginTop: 4,
    marginRight: 8,
  },
  historyContent: {
    flex: 1,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyTypeDark: {
    color: '#F9FAFB',
  },
  historyTypeLight: {
    color: '#111827',
  },
  historyDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  historyDateDark: {
    color: '#9CA3AF',
  },
  historyDateLight: {
    color: '#6B7280',
  },
  historyAddresses: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  historyAddressLabel: {
    fontSize: 14,
    width: 40,
  },
  historyLabelDark: {
    color: '#D1D5DB',
  },
  historyLabelLight: {
    color: '#4B5563',
  },
  historyAddress: {
    fontSize: 14,
    flex: 1,
  },
  historyAddressDark: {
    color: '#9CA3AF',
  },
  historyAddressLight: {
    color: '#6B7280',
  },
  error: {
    backgroundColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#991B1B',
  },
  transactionInfo: {
    borderRadius: 8,
    padding: 12,
  },
  txLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  txLabelDark: {
    color: '#D1D5DB',
  },
  txLabelLight: {
    color: '#4B5563',
  },
  txHash: {
    fontSize: 14,
    marginBottom: 8,
  },
  txHashDark: {
    color: '#9CA3AF',
  },
  txHashLight: {
    color: '#6B7280',
  },
  viewTxButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  viewTxButtonDark: {
    backgroundColor: '#374151',
  },
  viewTxButtonLight: {
    backgroundColor: '#F3F4F6',
  },
  viewTxText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewTxTextDark: {
    color: '#D1D5DB',
  },
  viewTxTextLight: {
    color: '#4B5563',
  },
  notConnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

export default ProvenanceManager; 