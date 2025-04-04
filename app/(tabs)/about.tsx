import { View, Text, StyleSheet, ScrollView, Linking, Image, TouchableOpacity, Alert } from 'react-native';
import { LinkIcon, Shield, FileText, GitCommit, Award } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import WalletConnect from '../components/WalletConnect';
import { useWallet } from '../context/WalletContext';
import React, { useState } from 'react';
import { useSmartContract } from '../context/SmartContractContext';
import ProvenanceManager from '../components/ProvenanceManager';

export default function TrackScreen() {
  const { isDark } = useTheme();
  const { isConnected, account } = useWallet();
  const { 
    registerAsset, 
    startWorkflow, 
    grantAccess, 
    registerIP, 
    isLoading 
  } = useSmartContract();
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  // Function to handle submitting a transaction
  const handleSampleProvenance = async () => {
    if (!isConnected || !account) {
      Alert.alert("Wallet Required", "Please connect your wallet first");
      return;
    }

    try {
      const sampleId = `sample-${Date.now().toString(16)}`; // Generate a unique sample ID
      const metadata = {
        type: "DNA",
        source: "Laboratory A",
        description: "Gene sequence for CRISPR editing experiment",
        timestamp: Date.now(),
        researcher: account.address
      };

      const txHash = await registerAsset(sampleId, metadata);
      Alert.alert("Success", `Sample registered! Transaction: ${txHash.slice(0, 10)}...`);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      Alert.alert("Error", `${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle workflow start
  const handleStartWorkflow = async () => {
    if (!isConnected || !account) {
      Alert.alert("Wallet Required", "Please connect your wallet first");
      return;
    }

    try {
      const workflowId = `workflow-${Date.now().toString(16)}`;
      const metadata = {
        name: "CRISPR Experiment Workflow",
        description: "Standard protocol for CRISPR-Cas9 gene editing experiments",
        steps: [
          "sample_collection",
          "quality_control",
          "sequencing",
          "analysis",
          "review"
        ],
        researcher: account.address
      };

      const txHash = await startWorkflow(workflowId, metadata);
      Alert.alert("Success", `Workflow started! Transaction: ${txHash.slice(0, 10)}...`);
    } catch (error) {
      console.error("Error starting workflow:", error);
      Alert.alert("Error", `${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle access control
  const handleGrantAccess = async () => {
    if (!isConnected || !account) {
      Alert.alert("Wallet Required", "Please connect your wallet first");
      return;
    }

    // In a real app, we might have an asset picker and user address input
    const assetId = `sample-${Date.now().toString(16)}`;
    const collaboratorAddress = "0x9d639be85a32e4b3e92fb73eea7feed6bd614db9bc26c1308f5b95ff558e09c3";
    
    try {
      const txHash = await grantAccess(assetId, collaboratorAddress, ["READ", "ANALYZE"]);
      Alert.alert("Success", `Access granted! Transaction: ${txHash.slice(0, 10)}...`);
    } catch (error) {
      console.error("Error granting access:", error);
      Alert.alert("Error", `${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle IP registration
  const handleRegisterIP = async () => {
    if (!isConnected || !account) {
      Alert.alert("Wallet Required", "Please connect your wallet first");
      return;
    }

    try {
      const ipId = `ip-${Date.now().toString(16)}`;
      const metadata = {
        title: "Novel CRISPR Gene Editing Technique",
        description: "A new approach for targeting multiple genes simultaneously",
        contributors: [account.address],
        keywords: ["CRISPR", "multi-target", "gene-editing"],
        timestamp: Date.now()
      };

      const txHash = await registerIP(ipId, metadata);
      Alert.alert("Success", `IP registered! Transaction: ${txHash.slice(0, 10)}...`);
    } catch (error) {
      console.error("Error registering IP:", error);
      Alert.alert("Error", `${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Function to toggle a contract section
  const toggleContract = (contract: string) => {
    setSelectedContract(selectedContract === contract ? null : contract);
  };

  const renderContractActions = (contract: string) => {
    if (selectedContract !== contract) return null;

    // Different UI based on contract type
    switch (contract) {
      case 'provenance':
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <Text style={[styles.actionTitle, isDark && styles.actionTitleDark]}>
              Track New Sample
            </Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleSampleProvenance}
              disabled={isLoading || !isConnected}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? "Submitting..." : "Track DNA Sample"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'workflow':
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <Text style={[styles.actionTitle, isDark && styles.actionTitleDark]}>
              Start New Workflow
            </Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleStartWorkflow}
              disabled={isLoading || !isConnected}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? "Submitting..." : "Start CRISPR Workflow"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'access':
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <Text style={[styles.actionTitle, isDark && styles.actionTitleDark]}>
              Grant Access
            </Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleGrantAccess}
              disabled={isLoading || !isConnected}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? "Submitting..." : "Grant Collaborator Access"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'ip':
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <Text style={[styles.actionTitle, isDark && styles.actionTitleDark]}>
              Register IP
            </Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRegisterIP}
              disabled={isLoading || !isConnected}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? "Submitting..." : "Register CRISPR Innovation"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
              Connect your wallet to interact with this contract.
            </Text>
          </View>
        );
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=2832&auto=format&fit=crop' }}
          style={styles.headerImage}
        />
        <View style={[styles.overlay, isDark && styles.overlayDark]} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.textDark]}>Blockchain Tracking</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          Secure your genetic research with Aptos blockchain integration
        </Text>

        <WalletConnect />
        
        <TouchableOpacity 
          style={[styles.card, isDark && styles.cardDark]} 
          onPress={() => toggleContract('provenance')}
          activeOpacity={0.8}
        >
          <LinkIcon size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Sample Provenance</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Track the complete lineage and origin of genetic samples with immutable 
            blockchain records. Our provenance system ensures that every sample is 
            traceable to its source with cryptographic verification.
          </Text>
          <View style={styles.tagContainer}>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Secure</Text>
            </View>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Verifiable</Text>
            </View>
          </View>
          {renderContractActions('provenance')}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, isDark && styles.cardDark]}
          onPress={() => toggleContract('audit')}
          activeOpacity={0.8}
        >
          <FileText size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Experimental Data Audit Trail</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Create tamper-proof records of your experimental data and results. 
            Our audit trail system logs every modification, analysis, and finding 
            with timestamp authentication and researcher verification.
          </Text>
          <View style={styles.tagContainer}>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Timestamped</Text>
            </View>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Auditable</Text>
            </View>
        </View>
          {renderContractActions('audit')}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, isDark && styles.cardDark]}
          onPress={() => toggleContract('access')}
          activeOpacity={0.8}
        >
          <Shield size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Access Control & Permissions</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Manage who can access and modify sensitive genetic data with granular 
            permission controls. Our blockchain-based access system provides 
            cryptographic security while maintaining compliance with privacy regulations.
          </Text>
          <View style={styles.tagContainer}>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Granular</Text>
            </View>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Compliant</Text>
            </View>
        </View>
          {renderContractActions('access')}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, isDark && styles.cardDark]}
          onPress={() => toggleContract('workflow')}
          activeOpacity={0.8}
        >
          <GitCommit size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Workflow Automation & Compliance</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Automate research workflows while ensuring regulatory compliance. 
            Smart contracts enforce proper protocols, track consent management, 
            and document each step in the genetic research process.
          </Text>
          <View style={styles.tagContainer}>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Automated</Text>
            </View>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Regulatory</Text>
            </View>
        </View>
          {renderContractActions('workflow')}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, isDark && styles.cardDark]}
          onPress={() => toggleContract('ip')}
          activeOpacity={0.8}
        >
          <Award size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Intellectual Property & Attribution</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Protect your research discoveries and intellectual property with 
            blockchain verification. Our system provides immutable proof of 
            authorship, timestamps contributions, and manages licensing for 
            genetic innovations.
          </Text>
          <View style={styles.tagContainer}>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Attributable</Text>
            </View>
            <View style={[styles.tag, isDark && styles.tagDark]}>
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>Protected</Text>
            </View>
        </View>
          {renderContractActions('ip')}
        </TouchableOpacity>

        <Text style={[styles.version, isDark && styles.versionDark]}>Blockchain Version 1.0</Text>

        <ProvenanceManager />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  overlayDark: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginBottom: 24,
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  textDark: {
    color: '#F9FAFB',
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  tagDark: {
    backgroundColor: '#312E81',
  },
  tagText: {
    color: '#4F46E5',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  tagTextDark: {
    color: '#A5B4FC',
  },
  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  versionDark: {
    color: '#9CA3AF',
  },
  actionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  actionContainerDark: {
    backgroundColor: '#374151',
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  actionTitleDark: {
    color: '#F9FAFB',
  },
  actionButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  infoTextDark: {
    color: '#9CA3AF',
  },
});