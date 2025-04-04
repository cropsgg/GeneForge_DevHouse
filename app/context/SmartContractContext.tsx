import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { AptosClient, Types } from 'aptos';
import { useWallet } from './WalletContext';

// Network configuration
const NETWORKS = {
  mainnet: 'https://fullnode.mainnet.aptoslabs.com',
  testnet: 'https://fullnode.testnet.aptoslabs.com',
  devnet: 'https://fullnode.devnet.aptoslabs.com',
};

// Contract addresses for different modules
const CONTRACT_ADDRESSES = {
  // Production contract addresses
  provenance: '0x9d639be85a32e4b3e92fb73eea7feed6bd614db9bc26c1308f5b95ff558e09c3',
  marketplace: '0x38d6b521f7556c72f933b5f7c964d1a247bd92833ef56e44487e49ea9e89eb35',
  access_control: '0x7ae4bfd501d18a32619af59e1258f1a6a0bd42fb794d2665de2778956b77ea35',
  workflow: '0x4fa558b83d7c7998d26c94207c2d8e1c09bc1fa1ea76b9b48cc12f33c4edee96',
  ip_registry: '0x57585a6f2a5e73e92ac4be0b8a8fa09536caec24ca15af9e8af55f9257f40c1e',
  
  // Module names for easy reference
  modules: {
    provenance: 'gene_provenance',
    marketplace: 'gene_marketplace',
    access_control: 'access_control',
    workflow: 'workflow_automation',
    ip_registry: 'ip_registry'
  }
};

// Smart contract function types
type SmartContractContextType = {
  // Provenance functions
  registerAsset: (assetId: string, metadata: any) => Promise<string>;
  transferAsset: (assetId: string, toAddress: string) => Promise<string>;
  getAssetHistory: (assetId: string) => Promise<any[]>;
  
  // Marketplace functions
  listAsset: (assetId: string, price: number) => Promise<string>;
  purchaseAsset: (assetId: string) => Promise<string>;
  
  // Access Control functions
  grantAccess: (assetId: string, userAddress: string, permissions: string[]) => Promise<string>;
  revokeAccess: (assetId: string, userAddress: string) => Promise<string>;
  checkAccess: (assetId: string, userAddress: string) => Promise<boolean>;
  
  // Workflow functions
  startWorkflow: (workflowId: string, metadata: any) => Promise<string>;
  completeWorkflowStep: (workflowId: string, stepId: string) => Promise<string>;
  getWorkflowStatus: (workflowId: string) => Promise<any>;
  
  // IP Registry functions
  registerIP: (ipId: string, metadata: any) => Promise<string>;
  licenseIP: (ipId: string, licenseeAddress: string, terms: string) => Promise<string>;
  getIPDetails: (ipId: string) => Promise<any>;
  
  // State
  isLoading: boolean;
  lastTransactionHash: string | null;
  error: string | null;
  
  // General contract utilities
  executeTransaction: (
    moduleAddress: string, 
    moduleName: string, 
    functionName: string, 
    typeArguments: string[], 
    args: any[]
  ) => Promise<string>;
  
  queryResource: (resourceType: string, address?: string) => Promise<any>;
};

// Create the context with default values
export const SmartContractContext = createContext<SmartContractContextType>({
  registerAsset: async () => '',
  transferAsset: async () => '',
  getAssetHistory: async () => [],
  listAsset: async () => '',
  purchaseAsset: async () => '',
  grantAccess: async () => '',
  revokeAccess: async () => '',
  checkAccess: async () => false,
  startWorkflow: async () => '',
  completeWorkflowStep: async () => '',
  getWorkflowStatus: async () => ({}),
  registerIP: async () => '',
  licenseIP: async () => '',
  getIPDetails: async () => ({}),
  isLoading: false,
  lastTransactionHash: null,
  error: null,
  executeTransaction: async () => '',
  queryResource: async () => ({}),
});

// Provider props interface
interface SmartContractProviderProps {
  children: ReactNode;
  network?: 'mainnet' | 'testnet' | 'devnet';
}

export const SmartContractProvider = ({ 
  children, 
  network = 'testnet' 
}: SmartContractProviderProps) => {
  const { account, isConnected, signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize client for blockchain interactions
  const client = new AptosClient(NETWORKS[network]);
  
  // Clear error when wallet connection changes
  useEffect(() => {
    setError(null);
  }, [isConnected, account]);

  // Check if wallet is connected before operations
  const checkWalletConnected = () => {
    if (!isConnected || !account) {
      const errorMessage = 'Wallet not connected';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Main function to execute a transaction on the blockchain
  const executeTransaction = async (
    moduleAddress: string,
    moduleName: string,
    functionName: string,
    typeArguments: string[] = [],
    args: any[] = []
  ): Promise<string> => {
    console.log('DEBUG: Executing contract transaction', {
      moduleAddress, moduleName, functionName, typeArguments, args
    });
    
    checkWalletConnected();
    setIsLoading(true);
    setError(null);
    
    try {
      // Create transaction payload
      const payload: Types.EntryFunctionPayload = {
        function: `${moduleAddress}::${moduleName}::${functionName}`,
        type_arguments: typeArguments,
        arguments: args
      };
      
      let txHash = '';
      
      if (Platform.OS === 'web') {
        // Web implementation - use actual blockchain
        txHash = await signAndSubmitTransaction(payload);
        console.log('DEBUG: Transaction submitted with hash:', txHash);
        
        // Wait for transaction confirmation
        try {
          // Instead of using specific transaction methods that might not be available,
          // we'll simply wait a few seconds and consider the transaction confirmed
          // This is a temporary workaround for Expo Go development
          console.log('DEBUG: Waiting for transaction confirmation...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('DEBUG: Transaction considered confirmed after timeout');
          
          // For production, you would implement proper transaction status checking:
          // const txInfo = await client.getAccountTransactionByHash(account.address, txHash);
          // if (txInfo && txInfo.success) {
          //   confirmed = true;
          // }
        } catch (e) {
          console.error('Error waiting for transaction:', e);
          // Continue even if we can't confirm the transaction
        }
      } else {
        // Mobile mock implementation for Expo Go
        console.log('DEBUG: On mobile, mocking transaction response');
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        Alert.alert('Transaction Simulated', `Mock transaction hash: ${txHash}`);
      }
      
      setLastTransactionHash(txHash);
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during transaction';
      console.error('Transaction error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Query a resource from the blockchain
  const queryResource = async (resourceType: string, address?: string): Promise<any> => {
    const targetAddress = address || account?.address;
    if (!targetAddress) {
      throw new Error('No address provided for resource query');
    }
    
    try {
      console.log(`DEBUG: Querying resource ${resourceType} for address ${targetAddress}`);
      
      if (Platform.OS === 'web') {
        // Web implementation - query actual blockchain
        const resources = await client.getAccountResources(targetAddress);
        const resource = resources.find(r => r.type === resourceType);
        return resource?.data || null;
      } else {
        // Mobile mock implementation
        console.log('DEBUG: On mobile, returning mock resource data');
        // Return mock data based on resource type
        if (resourceType.includes('provenance')) {
          return {
            assets: ['asset1', 'asset2'],
            totalRegistered: 2
          };
        } else if (resourceType.includes('marketplace')) {
          return {
            listings: [{id: 'asset1', price: '10000000'}],
            sales: 5
          };
        }
        return null;
      }
    } catch (err) {
      console.error('Error querying resource:', err);
      return null;
    }
  };

  // Provenance contract functions
  const registerAsset = async (assetId: string, metadata: any): Promise<string> => {
    console.log('DEBUG: Registering asset', { assetId, metadata });
    return executeTransaction(
      CONTRACT_ADDRESSES.provenance,
      CONTRACT_ADDRESSES.modules.provenance,
      'register_asset',
      [],
      [assetId, JSON.stringify(metadata)]
    );
  };

  const transferAsset = async (assetId: string, toAddress: string): Promise<string> => {
    console.log('DEBUG: Transferring asset', { assetId, toAddress });
    return executeTransaction(
      CONTRACT_ADDRESSES.provenance,
      CONTRACT_ADDRESSES.modules.provenance,
      'transfer_asset',
      [],
      [assetId, toAddress]
    );
  };

  const getAssetHistory = async (assetId: string): Promise<any[]> => {
    console.log('DEBUG: Getting asset history', { assetId });
    
    if (Platform.OS === 'web') {
      // On web, we would query the blockchain for events related to this asset
      try {
        // In a real implementation, this would use the appropriate API call
        // for your specific contract's event structure
        console.log('DEBUG: Would query blockchain for asset events');
        
        // This is a placeholder. You would implement actual event fetching based on
        // your contract's design and the Aptos JS SDK capabilities
        return [
          { timestamp: Date.now() - 86400000, type: 'registration', from: '0x0', to: account?.address },
          { timestamp: Date.now() - 43200000, type: 'transfer', from: account?.address, to: 'someOtherAddress' }
        ];
      } catch (error) {
        console.error('Error fetching asset history:', error);
        return [];
      }
    } else {
      // On mobile, return mock data
      console.log('DEBUG: On mobile, returning mock asset history');
      return [
        { timestamp: Date.now() - 86400000, type: 'registration', from: '0x0', to: account?.address },
        { timestamp: Date.now() - 43200000, type: 'transfer', from: account?.address, to: '0xabcdef' },
        { timestamp: Date.now() - 3600000, type: 'transfer', from: '0xabcdef', to: account?.address }
      ];
    }
  };

  // Marketplace contract functions
  const listAsset = async (assetId: string, price: number): Promise<string> => {
    console.log('DEBUG: Listing asset for sale', { assetId, price });
    return executeTransaction(
      CONTRACT_ADDRESSES.marketplace,
      CONTRACT_ADDRESSES.modules.marketplace,
      'list_asset',
      [],
      [assetId, price.toString()]
    );
  };

  const purchaseAsset = async (assetId: string): Promise<string> => {
    console.log('DEBUG: Purchasing asset', { assetId });
    return executeTransaction(
      CONTRACT_ADDRESSES.marketplace,
      CONTRACT_ADDRESSES.modules.marketplace,
      'purchase_asset',
      [],
      [assetId]
    );
  };

  // Access Control contract functions
  const grantAccess = async (assetId: string, userAddress: string, permissions: string[]): Promise<string> => {
    console.log('DEBUG: Granting access', { assetId, userAddress, permissions });
    return executeTransaction(
      CONTRACT_ADDRESSES.access_control,
      CONTRACT_ADDRESSES.modules.access_control,
      'grant_access',
      [],
      [assetId, userAddress, JSON.stringify(permissions)]
    );
  };

  const revokeAccess = async (assetId: string, userAddress: string): Promise<string> => {
    console.log('DEBUG: Revoking access', { assetId, userAddress });
    return executeTransaction(
      CONTRACT_ADDRESSES.access_control,
      CONTRACT_ADDRESSES.modules.access_control,
      'revoke_access',
      [],
      [assetId, userAddress]
    );
  };

  const checkAccess = async (assetId: string, userAddress: string): Promise<boolean> => {
    console.log('DEBUG: Checking access', { assetId, userAddress });
    
    if (Platform.OS === 'web') {
      try {
        // This would be a view function call, not a transaction
        // In reality, you might use a different API for view functions
        const resourceType = `${CONTRACT_ADDRESSES.access_control}::${CONTRACT_ADDRESSES.modules.access_control}::AccessRegistry`;
        const resource = await queryResource(resourceType);
        
        // Mock implementation since we can't make actual calls here
        return true;
      } catch (error) {
        console.error('Error checking access:', error);
        return false;
      }
    } else {
      // Mock implementation for mobile
      console.log('DEBUG: On mobile, returning mock access check');
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return Math.random() > 0.2; // 80% chance of having access
    }
  };

  // Workflow Automation contract functions
  const startWorkflow = async (workflowId: string, metadata: any): Promise<string> => {
    console.log('DEBUG: Starting workflow', { workflowId, metadata });
    return executeTransaction(
      CONTRACT_ADDRESSES.workflow,
      CONTRACT_ADDRESSES.modules.workflow,
      'start_workflow',
      [],
      [workflowId, JSON.stringify(metadata)]
    );
  };

  const completeWorkflowStep = async (workflowId: string, stepId: string): Promise<string> => {
    console.log('DEBUG: Completing workflow step', { workflowId, stepId });
    return executeTransaction(
      CONTRACT_ADDRESSES.workflow,
      CONTRACT_ADDRESSES.modules.workflow,
      'complete_step',
      [],
      [workflowId, stepId]
    );
  };

  const getWorkflowStatus = async (workflowId: string): Promise<any> => {
    console.log('DEBUG: Getting workflow status', { workflowId });
    
    if (Platform.OS === 'web') {
      try {
        // This would be a view function call in a real implementation
        console.log('DEBUG: Would query blockchain for workflow status');
        
        // Mock implementation
        return {
          id: workflowId,
          status: 'in_progress',
          completedSteps: ['sample_collection', 'quality_control'],
          pendingSteps: ['sequencing', 'analysis', 'review'],
          startedAt: Date.now() - 604800000, // 7 days ago
          lastUpdated: Date.now() - 86400000 // 1 day ago
        };
      } catch (error) {
        console.error('Error fetching workflow status:', error);
        return {};
      }
    } else {
      // Mock implementation for mobile
      console.log('DEBUG: On mobile, returning mock workflow status');
      return {
        id: workflowId,
        status: 'in_progress',
        completedSteps: ['sample_collection', 'quality_control'],
        pendingSteps: ['sequencing', 'analysis', 'review'],
        startedAt: Date.now() - 604800000, // 7 days ago
        lastUpdated: Date.now() - 86400000 // 1 day ago
      };
    }
  };

  // IP Registry contract functions
  const registerIP = async (ipId: string, metadata: any): Promise<string> => {
    console.log('DEBUG: Registering IP', { ipId, metadata });
    return executeTransaction(
      CONTRACT_ADDRESSES.ip_registry,
      CONTRACT_ADDRESSES.modules.ip_registry,
      'register_ip',
      [],
      [ipId, JSON.stringify(metadata)]
    );
  };

  const licenseIP = async (ipId: string, licenseeAddress: string, terms: string): Promise<string> => {
    console.log('DEBUG: Licensing IP', { ipId, licenseeAddress, terms });
    return executeTransaction(
      CONTRACT_ADDRESSES.ip_registry,
      CONTRACT_ADDRESSES.modules.ip_registry,
      'license_ip',
      [],
      [ipId, licenseeAddress, terms]
    );
  };

  const getIPDetails = async (ipId: string): Promise<any> => {
    console.log('DEBUG: Getting IP details', { ipId });
    
    if (Platform.OS === 'web') {
      try {
        // This would be a view function call in a real implementation
        console.log('DEBUG: Would query blockchain for IP details');
        
        // Mock implementation
        return {
          id: ipId,
          owner: account?.address || '0x1',
          created: Date.now() - 2592000000, // 30 days ago
          description: 'Novel gene editing technique for treating cystic fibrosis',
          licensees: [
            { address: '0x123...', terms: 'Research use only', granted: Date.now() - 864000000 }
          ]
        };
      } catch (error) {
        console.error('Error fetching IP details:', error);
        return {};
      }
    } else {
      // Mock implementation for mobile
      console.log('DEBUG: On mobile, returning mock IP details');
      return {
        id: ipId,
        owner: account?.address || '0x1',
        created: Date.now() - 2592000000, // 30 days ago
        description: 'Novel gene editing technique for treating cystic fibrosis',
        licensees: [
          { address: '0x123...', terms: 'Research use only', granted: Date.now() - 864000000 }
        ]
      };
    }
  };

  // Include all functions in the context value
  const contextValue: SmartContractContextType = {
    registerAsset,
    transferAsset,
    getAssetHistory,
    listAsset,
    purchaseAsset,
    grantAccess,
    revokeAccess,
    checkAccess,
    startWorkflow,
    completeWorkflowStep,
    getWorkflowStatus,
    registerIP,
    licenseIP,
    getIPDetails,
    isLoading,
    lastTransactionHash,
    error,
    executeTransaction,
    queryResource
  };

  return (
    <SmartContractContext.Provider value={contextValue}>
      {children}
    </SmartContractContext.Provider>
  );
};

// Custom hook for using the smart contract context
export const useSmartContract = () => useContext(SmartContractContext); 