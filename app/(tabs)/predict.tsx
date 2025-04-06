import { LinearGradient } from 'expo-linear-gradient';
import { CircleAlert as AlertCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

// Interface for the prediction response
interface PredictionResponse {
  originalSequence: string;
  editedSequence: string;
  changeIndicator: string;
  efficiency: number;
  changedPosition: number;
  originalBase: string;
  newBase: string;
  message: string;
}

export default function PredictScreen() {
  const { isDark } = useTheme();

  const [dnaSequence, setDnaSequence] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  // Validate DNA sequence (only A, T, C, G allowed)
  const validateDnaSequence = (sequence: string): boolean => {
    return /^[ATCG]{20}$/.test(sequence);
  };

  const makePrediction = async (sequence: string): Promise<PredictionResponse> => {
    try {
        // For physical devices/emulators use your local IP
        // For iOS simulator use 'http://localhost:8000/predict'
        // For Android emulator use 'http://10.0.2.2:8000/predict'
        const API_URL = 'http://172.16.44.105:8000/predict';
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ sequence }),
        });

        if (!response.ok) {
            let errorMsg = 'Failed to get prediction';
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg;
            } catch (e) {
                errorMsg = `HTTP error! status: ${response.status}`;
            }
            throw new Error(errorMsg);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        let errorMessage = 'Network error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
};

const handleSubmit = async () => {
    if (!dnaSequence) {
        setError('Please enter a DNA sequence');
        return;
    }
    
    if (!validateDnaSequence(dnaSequence)) {
        setError('DNA sequence must be exactly 20 characters and contain only A, T, C, G');
        return;
    }

    setError(null);
    setLoading(true);

    try {
        const result = await makePrediction(dnaSequence);
        setPredictionResult(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        Alert.alert(
            'Error',
            errorMessage,
            [{ text: 'OK' }]
        );
    } finally {
        setLoading(false);
    }
};

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={isDark ? ['#1F2937', '#111827'] : ['#F9FAFB', '#F3F4F6']}
        style={styles.header}
      >
        <Text style={[styles.title, isDark && styles.textDark ]}>Gene Editing Prediction</Text>
        
        <Text style={[styles.modelDescription, isDark && styles.textDark]}>
          Fixing DNA, one base at a time - smarter, faster, 
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle color="#EF4444" size={20} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Input Parameters</Text>

          <Text style={[styles.inputLabel, isDark && styles.textDark]}>DNA Sequence (20 characters)</Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Enter DNA sequence (e.g., ATCGATCGATCGATCGATCG)"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={dnaSequence}
            onChangeText={(text) => setDnaSequence(text.toUpperCase())}
            autoCapitalize="characters"
            maxLength={20}
          />
          <Text style={[styles.helperText, isDark && styles.helperTextDark]}>
            Only A, T, C, G letters are allowed. Exactly 20 characters required.
          </Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Analyzing...' : 'Predict Edit Efficiency'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {predictionResult && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Prediction Results</Text>

            {/* Gene Editor */}
            <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
              <Text style={[styles.resultTitle, isDark && styles.textDark]}>Gene Edit Results</Text>
              <View style={[styles.sequenceContainer, isDark && styles.sequenceContainerDark]}>
                <Text style={[styles.sequenceLabel, isDark && styles.sequenceLabelDark]}>Original:</Text>
                <Text style={[styles.sequence, isDark && styles.sequenceDark]}>
                  {predictionResult.originalSequence}
                </Text>
                
                <Text style={[styles.sequenceLabel, isDark && styles.sequenceLabelDark]}>Edited:</Text>
                <View style={styles.editedSequenceContainer}>
                  {predictionResult.editedSequence.split('').map((char, index) => {
                    const isChanged = predictionResult.changeIndicator[index] === '*';
                    return (
                      <Text
                        key={index}
                        style={[
                          styles.sequenceChar,
                          isDark && styles.sequenceDark,
                          isChanged && styles.changedChar,
                        ]}
                      >
                        {char}
                      </Text>
                    );
                  })}
                </View>
                
                {/* Position indicator for changed base */}
                {predictionResult.changeIndicator.includes('*') && (
                  <View style={[
                    styles.positionInfoContainer, 
                    isDark && styles.positionInfoContainerDark
                  ]}>
                    <Text style={[styles.sequenceLabel, isDark && styles.sequenceLabelDark]}>
                      Changed Position:
                    </Text>
                    <Text style={[styles.positionText, isDark && styles.textDark]}>
                      Position {predictionResult.changedPosition} 
                      ({predictionResult.originalBase} → {predictionResult.newBase})
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Efficiency Gauge */}
            <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
              <Text style={[styles.resultTitle, isDark && styles.textDark]}>Efficiency Gauge</Text>
              <View style={styles.gaugeContainer}>
                <Text style={[styles.efficiencyText, isDark && styles.textDark]}>
                  {predictionResult.efficiency} Success Probability
                </Text>
                <View style={[styles.gauge, isDark && styles.gaugeDark]}>
                  <View
                    style={[styles.gaugeProgress, { width: `${predictionResult.efficiency}%` }]}
                  />
                </View>
                {predictionResult.message && (
                  <Text style={[styles.messageText, isDark && styles.textDark]}>
                    {predictionResult.message}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ... (keep all the StyleSheet styles the same as in your original file)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  modelDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  textDark: {
    color: '#F9FAFB',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    minHeight: 60,
    textAlignVertical: 'center',
    marginBottom: 8,
    color: '#111827',
    letterSpacing: 2,
  },
  inputDark: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginBottom: 24,
  },
  helperTextDark: {
    color: '#9CA3AF',
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginLeft: 8,
  },
  resultCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  resultCardDark: {
    backgroundColor: '#1F2937',
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  sequenceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  sequenceContainerDark: {
    backgroundColor: '#111827',
  },
  sequenceLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  sequenceLabelDark: {
    color: '#9CA3AF',
  },
  sequence: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: 2,
    fontWeight: '500',
  },
  sequenceDark: {
    color: '#F9FAFB',
  },
  editedSequenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  sequenceChar: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#111827',
    fontWeight: '500',
    letterSpacing: 2,
  },
  changedChar: {
    color: '#6366F1',
    fontWeight: 'bold',
    backgroundColor: '#EEF2FF',
    borderRadius: 4,
    overflow: 'hidden',
    paddingHorizontal: 1,
  },
  gaugeContainer: {
    alignItems: 'center',
  },
  efficiencyText: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  gauge: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  gaugeDark: {
    backgroundColor: '#374151',
  },
  gaugeProgress: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 6,
  },
  positionInfoContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  positionInfoContainerDark: {
    backgroundColor: '#1E293B', // Dark blue background for dark mode
  },
  positionText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#4F46E5',
    marginTop: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});