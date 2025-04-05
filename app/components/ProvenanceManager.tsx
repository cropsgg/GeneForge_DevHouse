import {
  Database,
  Upload,
  RefreshCw,
  List,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

type Asset = {
  id: string;
  name: string;
  description: string;
  createdAt: number;
};

const ProvenanceManager = () => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetHistory, setAssetHistory] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetDescription, setNewAssetDescription] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Mock assets for demonstration
  useEffect(() => {
    setIsLoadingAssets(true);
    // Simulate fetching assets
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
  }, []);

  const fetchAssetHistory = async (assetId: string) => {
    if (!assetId) return;

    try {
      // Simulate fetching asset history
      setIsLoading(true);
      setTimeout(() => {
        const mockHistory = [
          {
            type: 'CREATED',
            timestamp: Date.now() - 86400000 * 3,
            by: '0x789abc',
          },
          {
            type: 'UPDATED',
            timestamp: Date.now() - 86400000 * 2,
            by: '0x789abc',
          },
        ];
        setAssetHistory(mockHistory);
        setSelectedAsset(assetId);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching asset history:', err);
      Alert.alert('Error', 'Failed to fetch asset history');
      setIsLoading(false);
    }
  };

  const handleRegisterAsset = async () => {
    if (!newAssetName.trim()) {
      Alert.alert('Input Error', 'Please enter an asset name');
      return;
    }

    try {
      setIsLoading(true);
      const assetId = `0x${Math.random().toString(16).substr(2, 12)}`;

      // Simulate asset registration
      setTimeout(() => {
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
        setLastTransactionId(assetId);
        setIsLoading(false);
        Alert.alert('Success', 'Asset registered successfully');
      }, 1500);
    } catch (err) {
      console.error('Error registering asset:', err);
      Alert.alert('Error', 'Failed to register asset');
      setIsLoading(false);
      setError('Failed to register asset');
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
      setIsLoading(true);

      // Simulate asset transfer
      setTimeout(() => {
        // Update history to show the transfer
        const newHistory = [
          ...assetHistory,
          {
            type: 'TRANSFERRED',
            timestamp: Date.now(),
            by: transferAddress,
          },
        ];
        setAssetHistory(newHistory);
        setTransferAddress('');
        setLastTransactionId(`TX${Math.random().toString(16).substring(2, 10)}`);
        setIsLoading(false);
        Alert.alert('Success', 'Asset transferred successfully');
      }, 1500);
    } catch (err) {
      console.error('Error transferring asset:', err);
      Alert.alert('Error', 'Failed to transfer asset');
      setIsLoading(false);
      setError('Failed to transfer asset');
    }
  };

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
          <Text
            style={[
              styles.sectionTitle,
              isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
            ]}
          >
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
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Register Asset</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Assets List Section */}
      <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
        <View style={styles.sectionHeader}>
          <List size={20} color={isDark ? '#818CF8' : '#6366F1'} />
          <Text
            style={[
              styles.sectionTitle,
              isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
            ]}
          >
            Registered Genes
          </Text>
        </View>

        {isLoadingAssets ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={isDark ? '#818CF8' : '#6366F1'}
          />
        ) : assets.length === 0 ? (
          <Text style={[styles.emptyText, isDark ? styles.emptyTextDark : styles.emptyTextLight]}>
            No assets registered yet
          </Text>
        ) : (
          assets.map((asset, index) => (
            <TouchableOpacity
              key={asset.id}
              style={[
                styles.assetItem,
                selectedAsset === asset.id && styles.selectedAsset,
                isDark ? styles.assetItemDark : styles.assetItemLight,
                selectedAsset === asset.id && isDark && styles.selectedAssetDark,
              ]}
              onPress={() => fetchAssetHistory(asset.id)}
            >
              <Text
                style={[styles.assetName, isDark ? styles.assetNameDark : styles.assetNameLight]}
              >
                {asset.name}
              </Text>
              <Text
                style={[
                  styles.assetDescription,
                  isDark ? styles.assetDescriptionDark : styles.assetDescriptionLight,
                ]}
              >
                {asset.description}
              </Text>
              <Text
                style={[styles.assetDate, isDark ? styles.assetDateDark : styles.assetDateLight]}
              >
                Created: {new Date(asset.createdAt).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Transfer Asset Section */}
      {selectedAsset && (
        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <View style={styles.sectionHeader}>
            <ArrowUpCircle size={20} color={isDark ? '#818CF8' : '#6366F1'} />
            <Text
              style={[
                styles.sectionTitle,
                isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
              ]}
            >
              Transfer Gene
            </Text>
          </View>

          <TextInput
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholder="Recipient Address"
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
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Transfer Asset</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Asset History Section */}
      {selectedAsset && assetHistory.length > 0 && (
        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <View style={styles.sectionHeader}>
            <RefreshCw size={20} color={isDark ? '#818CF8' : '#6366F1'} />
            <Text
              style={[
                styles.sectionTitle,
                isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
              ]}
            >
              Asset History
            </Text>
          </View>

          {assetHistory.map((event, index) => (
            <View
              key={index}
              style={[
                styles.historyItem,
                isDark ? styles.historyItemDark : styles.historyItemLight,
              ]}
            >
              <View style={styles.historyIconContainer}>
                {event.type === 'CREATED' && (
                  <Database size={16} color={isDark ? '#818CF8' : '#6366F1'} />
                )}
                {event.type === 'TRANSFERRED' && (
                  <ArrowDownCircle size={16} color={isDark ? '#F472B6' : '#EC4899'} />
                )}
                {event.type === 'UPDATED' && (
                  <RefreshCw size={16} color={isDark ? '#34D399' : '#10B981'} />
                )}
              </View>
              <View style={styles.historyContent}>
                <Text
                  style={[
                    styles.historyType,
                    isDark ? styles.historyTypeDark : styles.historyTypeLight,
                  ]}
                >
                  {event.type}
                </Text>
                <Text
                  style={[
                    styles.historyDate,
                    isDark ? styles.historyDateDark : styles.historyDateLight,
                  ]}
                >
                  {new Date(event.timestamp).toLocaleString()}
                </Text>
                {event.by && (
                  <Text
                    style={[
                      styles.historyBy,
                      isDark ? styles.historyByDark : styles.historyByLight,
                    ]}
                  >
                    By: {event.by}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Transaction Status */}
      {(lastTransactionId || error) && (
        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <View style={styles.sectionHeader}>
            <Database size={20} color={isDark ? '#818CF8' : '#6366F1'} />
            <Text
              style={[
                styles.sectionTitle,
                isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
              ]}
            >
              Transaction Status
            </Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {lastTransactionId && (
            <View style={styles.transactionInfo}>
              <Text
                style={[
                  styles.transactionLabel,
                  isDark ? styles.transactionLabelDark : styles.transactionLabelLight,
                ]}
              >
                Transaction ID:
              </Text>
              <TouchableOpacity onPress={() => Alert.alert('Transaction ID', lastTransactionId)}>
                <Text
                  style={[
                    styles.transactionHash,
                    isDark ? styles.transactionHashDark : styles.transactionHashLight,
                  ]}
                >
                  {lastTransactionId}
                </Text>
              </TouchableOpacity>
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
  },
  containerLight: {
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  header: {
    padding: 20,
    marginBottom: 10,
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
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
  },
  sectionLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  sectionDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitleLight: {
    color: '#111827',
  },
  sectionTitleDark: {
    color: '#F9FAFB',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#1F2937',
    borderColor: '#4B5563',
    color: '#F9FAFB',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLight: {
    backgroundColor: '#6366F1',
  },
  buttonDark: {
    backgroundColor: '#818CF8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  emptyTextLight: {
    color: '#6B7280',
  },
  emptyTextDark: {
    color: '#9CA3AF',
  },
  assetItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  assetItemLight: {
    backgroundColor: '#F3F4F6',
    borderColor: '#F3F4F6',
  },
  assetItemDark: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  selectedAsset: {
    borderColor: '#6366F1',
  },
  selectedAssetDark: {
    borderColor: '#818CF8',
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  assetNameLight: {
    color: '#111827',
  },
  assetNameDark: {
    color: '#F9FAFB',
  },
  assetDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  assetDescriptionLight: {
    color: '#4B5563',
  },
  assetDescriptionDark: {
    color: '#D1D5DB',
  },
  assetDate: {
    fontSize: 12,
  },
  assetDateLight: {
    color: '#6B7280',
  },
  assetDateDark: {
    color: '#9CA3AF',
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
    backgroundColor: '#1F2937',
  },
  historyIconContainer: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyType: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  historyTypeLight: {
    color: '#111827',
  },
  historyTypeDark: {
    color: '#F9FAFB',
  },
  historyDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  historyDateLight: {
    color: '#6B7280',
  },
  historyDateDark: {
    color: '#9CA3AF',
  },
  historyBy: {
    fontSize: 12,
  },
  historyByLight: {
    color: '#6B7280',
  },
  historyByDark: {
    color: '#9CA3AF',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 8,
  },
  transactionInfo: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  transactionLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  transactionLabelLight: {
    color: '#111827',
  },
  transactionLabelDark: {
    color: '#F9FAFB',
  },
  transactionHash: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  transactionHashLight: {
    color: '#4F46E5',
  },
  transactionHashDark: {
    color: '#818CF8',
  },
  notConnectedContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProvenanceManager;
