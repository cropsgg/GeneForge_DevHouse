import {
  LinkIcon,
  FileText,
  Shield,
  GitCommit,
  Award,
  ExternalLink,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { useTheme } from '../context/ThemeContext';

export default function TrackScreen() {
  const { isDark } = useTheme();
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  // Check if we're running on web platform
  const isWeb = Platform.OS === 'web';
  const websiteUrl = 'https://geneforgedevhouse.vercel.app/';

  // Handle navigation based on platform
  const handlePlatformAccess = () => {
    if (isWeb) {
      // For web users, open in a new tab
      window.open(websiteUrl, '_blank');
    } else {
      // For mobile users, toggle WebView
      setShowWebView(!showWebView);
    }
  };

  const handleSampleProvenance = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Sample registered successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to register sample');
    }
  };

  const handleStartWorkflow = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Workflow started successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to start workflow');
    }
  };

  const handleGrantAccess = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Access granted successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to grant access');
    }
  };

  const handleRegisterIP = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'IP registered successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to register IP');
    }
  };

  // Function to toggle a contract section
  const toggleContract = (contract: string) => {
    setExpandedContract(expandedContract === contract ? null : contract);
  };

  // Toggle WebView visibility
  const toggleWebView = () => {
    setShowWebView(!showWebView);
  };

  // Function to render the appropriate action UI based on the contract type
  const renderContractActions = (contract: string) => {
    if (expandedContract !== contract) return null;

    switch (contract) {
      case 'provenance':
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <TouchableOpacity
              style={[styles.actionButton, isDark && styles.actionButtonDark]}
              onPress={handleSampleProvenance}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>
                  {isLoading ? 'Submitting...' : 'Track DNA Sample'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        );
      case 'workflow':
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <TouchableOpacity
              style={[styles.actionButton, isDark && styles.actionButtonDark]}
              onPress={handleStartWorkflow}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>Start Workflow</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      case 'access':
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <TouchableOpacity
              style={[styles.actionButton, isDark && styles.actionButtonDark]}
              onPress={handleGrantAccess}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>Grant Access</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      case 'ip':
        return (
          <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
            <TouchableOpacity
              style={[styles.actionButton, isDark && styles.actionButtonDark]}
              onPress={handleRegisterIP}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>Register IP</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=2832&auto=format&fit=crop',
          }}
          style={styles.headerImage}
        />
        <View style={[styles.overlay, isDark && styles.overlayDark]} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.textDark]}>Research Tracking</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          Secure your genetic research with advanced tracking features
        </Text>

        {/* Blockchain Platform Access Button at the top */}
        <TouchableOpacity
          style={[styles.platformButton, isDark && styles.platformButtonDark]}
          onPress={handlePlatformAccess}
          activeOpacity={0.8}
        >
          <View style={styles.platformButtonContent}>
            <View style={styles.platformButtonIconContainer}>
              <LayoutGrid size={20} color="#FFFFFF" />
            </View>
            <View style={styles.platformButtonTextContainer}>
              <Text style={styles.platformButtonTitle}>
                Access Genetic Research Smart Contracts
              </Text>
              <Text style={styles.platformButtonSubtitle}>
                Secure sample tracking, verification & permissions on Aptos blockchain
              </Text>
            </View>
            {!isWeb &&
              (showWebView ? (
                <ChevronUp size={20} color="#FFFFFF" style={styles.platformButtonArrow} />
              ) : (
                <ChevronDown size={20} color="#FFFFFF" style={styles.platformButtonArrow} />
              ))}
            {isWeb && <ExternalLink size={20} color="#FFFFFF" style={styles.platformButtonArrow} />}
          </View>
        </TouchableOpacity>

        {/* WebView container only for mobile */}
        {!isWeb && showWebView && (
          <View style={[styles.webViewContainer, { marginBottom: 24 }]}>
            <WebView
              source={{ uri: websiteUrl }}
              style={styles.webView}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.webViewLoader}>
                  <ActivityIndicator size="large" color={isDark ? '#818CF8' : '#6366F1'} />
                </View>
              )}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.card, isDark && styles.cardDark]}
          onPress={() => toggleContract('provenance')}
          activeOpacity={0.8}
        >
          <LinkIcon size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Sample Provenance</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Track the complete lineage and origin of genetic samples with immutable records. Our
            provenance system ensures that every sample is traceable to its source with
            cryptographic verification.
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
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Experimental Data Audit Trail
          </Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Create tamper-proof records of your experimental data and results. Our audit trail
            system logs every modification, analysis, and finding with timestamp authentication and
            researcher verification.
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
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Access Control & Permissions
          </Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Manage who can access and modify sensitive genetic data with granular permission
            controls. Our access system provides cryptographic security while maintaining compliance
            with privacy regulations.
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
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Workflow Automation & Compliance
          </Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Automate research workflows while ensuring regulatory compliance. Our system enforces
            proper protocols, tracks consent management, and documents each step in the genetic
            research process.
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
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Intellectual Property & Attribution
          </Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Protect your research discoveries and intellectual property with secure verification.
            Our system provides immutable proof of authorship, timestamps contributions, and manages
            licensing for genetic innovations.
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

        {/* GeneForge Card with Link */}
        <View style={[styles.geneforgeCard, isDark && styles.geneforgeCardDark]}>
          <Text style={[styles.geneforgeTitle, isDark && styles.textDark]}>
            GeneForge: Blockchain CRISPR Platform
          </Text>
          <Text style={[styles.geneforgeDescription, isDark && styles.geneforgeDescriptionDark]}>
            Access our specialized blockchain platform for secure genomic research with transparent,
            traceable and immutable gene editing workflows powered by Aptos blockchain.
          </Text>

          <TouchableOpacity
            style={[styles.geneforgeButton, isDark && styles.geneforgeButtonDark]}
            onPress={handlePlatformAccess}
          >
            <Text style={styles.geneforgeButtonText}>
              {isWeb ? 'Open Blockchain Platform' : 'View Blockchain Platform'}
            </Text>
            <ExternalLink size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <View style={styles.geneforgeFeatures}>
            <View style={styles.geneforgeFeatureItem}>
              <Shield size={18} color={isDark ? '#C7D2FE' : '#E0E7FF'} />
              <Text style={styles.geneforgeFeatureText}>Cryptographic verification</Text>
            </View>
            <View style={styles.geneforgeFeatureItem}>
              <FileText size={18} color={isDark ? '#C7D2FE' : '#E0E7FF'} />
              <Text style={styles.geneforgeFeatureText}>Immutable audit trail</Text>
            </View>
            <View style={styles.geneforgeFeatureItem}>
              <Award size={18} color={isDark ? '#C7D2FE' : '#E0E7FF'} />
              <Text style={styles.geneforgeFeatureText}>IP protection & attribution</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.version, isDark && styles.versionDark]}>Version 1.0</Text>
      </View>
    </ScrollView>
  );
}

const { width, height } = Dimensions.get('window');

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
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  textDark: {
    color: '#F9FAFB',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagDark: {
    backgroundColor: '#2D3748',
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4F46E5',
  },
  tagTextDark: {
    color: '#818CF8',
  },
  actionContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  actionContainerDark: {
    backgroundColor: '#374151',
  },
  actionButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonDark: {
    backgroundColor: '#818CF8',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    textAlign: 'center',
  },
  infoTextDark: {
    color: '#D1D5DB',
  },
  version: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 20,
  },
  versionDark: {
    color: '#6B7280',
  },
  geneforgeCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  geneforgeCardDark: {
    backgroundColor: '#4338CA',
  },
  geneforgeTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  geneforgeDescription: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#E0E7FF',
    lineHeight: 24,
    marginBottom: 20,
  },
  geneforgeDescriptionDark: {
    color: '#C7D2FE',
  },
  geneforgeFeatures: {
    marginTop: 16,
  },
  geneforgeFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  geneforgeFeatureText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#E0E7FF',
    marginLeft: 8,
  },
  platformButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  platformButtonDark: {
    backgroundColor: '#4338CA',
  },
  platformButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  platformButtonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  platformButtonTextContainer: {
    flex: 1,
  },
  platformButtonTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  platformButtonSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  platformButtonArrow: {
    marginLeft: 8,
  },
  webViewContainer: {
    width: '100%',
    height: height * 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  webView: {
    flex: 1,
  },
  webViewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  webLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    marginBottom: 24,
  },
  webLinkContainerDark: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  webLinkText: {
    color: '#6366F1',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginRight: 8,
  },
  geneforgeButton: {
    backgroundColor: '#312E81',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  geneforgeButtonDark: {
    backgroundColor: '#4F46E5',
  },
  geneforgeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
});
