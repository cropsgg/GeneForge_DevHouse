import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ViewStyle,
  TextStyle,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleAlert as AlertCircle, AlertTriangle, Flag } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

// Configuration for the ML model API
// Change this to your local machine's IP address when testing
// Use 10.0.2.2 for Android emulator to access host machine's localhost
// Use localhost for iOS simulator
const API_BASE_URL = Platform.select({
  ios: 'http://localhost:5000',
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

const diseases = [
  'Cystic Fibrosis',
  'Sickle Cell Disease',
  'Huntington\'s Disease',
  'Duchenne Muscular Dystrophy',
  'Beta Thalassemia',
];

// Interface for the ML model's response
interface PredictionResponse {
  originalSequence: string;
  editedSequence: string;
  efficiency: number;
  offTargets: Array<{ site: string; risk: 'high' | 'medium' }>;
  therapeuticSummary: string;
}

export default function PredictScreen() {
  const { isDark } = useTheme();
  
  const [selectedDisease, setSelectedDisease] = useState('');
  const [targetSequence, setTargetSequence] = useState('');
  const [pamSequence, setPamSequence] = useState('');
  const [guideRNA, setGuideRNA] = useState('');
  const [donorTemplate, setDonorTemplate] = useState('');
  const [cellType, setCellType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  /**
   * Makes a prediction request to the Python ML model via Flask API
   * The Flask server should be running locally with the following endpoints:
   * 
   * POST /api/predict
   * Request body: {
   *   disease?: string;
   *   targetSequence?: string;
   *   pamSequence?: string;
   *   guideRNA?: string;
   *   donorTemplate?: string;
   *   cellType?: string;
   * }
   * 
   * Response body: PredictionResponse
   */
  const makePrediction = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disease: selectedDisease,
          targetSequence,
          pamSequence,
          guideRNA,
          donorTemplate,
          cellType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result as PredictionResponse;
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedDisease && (!targetSequence || !pamSequence || !guideRNA || !donorTemplate || !cellType)) {
      setError('Please select a disease or fill in all required fields');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Call the Python ML model API
      const result = await makePrediction();
      setPredictionResult(result);
    } catch (error) {
      setError('Failed to get prediction. Please check if the ML server is running.');
      Alert.alert(
        'Error',
        'Failed to connect to the ML server. Make sure the Python Flask server is running on your local machine.',
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
        <Text style={[styles.title, isDark && styles.textDark]}>CRISPR-Cas9 Edit Prediction</Text>
        <Text style={[styles.subtitle, isDark && styles.textDark]}>
          Select a disease or enter the required parameters for CRISPR-Cas9 gene editing prediction
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
          
          <Text style={[styles.sectionSubtitle, isDark && styles.textDark]}>Select Disease</Text>
          <View style={styles.diseaseList}>
            {diseases.map((disease) => (
              <TouchableOpacity
                key={disease}
                style={[
                  styles.diseaseItem,
                  selectedDisease === disease && styles.selectedDisease,
                  isDark && styles.diseaseItemDark,
                  selectedDisease === disease && isDark && styles.selectedDiseaseDark,
                ]}
                onPress={() => setSelectedDisease(disease)}>
                <Text
                  style={[
                    styles.diseaseText,
                    selectedDisease === disease && styles.selectedDiseaseText,
                    isDark && styles.textDark,
                    selectedDisease === disease && isDark && styles.selectedDiseaseTextDark,
                  ]}>
                  {disease}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionSubtitle, isDark && styles.textDark]}>Or Enter Manual Parameters</Text>
          
          <Text style={[styles.inputLabel, isDark && styles.textDark]}>Target DNA Sequence</Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Enter target DNA sequence (e.g., ATCGATCGATCGATCG)"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={targetSequence}
            onChangeText={setTargetSequence}
            multiline
            numberOfLines={3}
          />

          <Text style={[styles.inputLabel, isDark && styles.textDark]}>PAM Sequence</Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Enter PAM sequence (e.g., NGG)"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={pamSequence}
            onChangeText={setPamSequence}
            multiline
            numberOfLines={2}
          />

          <Text style={[styles.inputLabel, isDark && styles.textDark]}>Guide RNA Sequence</Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Enter guide RNA sequence"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={guideRNA}
            onChangeText={setGuideRNA}
            multiline
            numberOfLines={3}
          />

          <Text style={[styles.inputLabel, isDark && styles.textDark]}>Donor Template</Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Enter donor template sequence for homology-directed repair"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={donorTemplate}
            onChangeText={setDonorTemplate}
            multiline
            numberOfLines={3}
          />

          <Text style={[styles.inputLabel, isDark && styles.textDark]}>Cell Type</Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Enter target cell type (e.g., HEK293, HeLa)"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={cellType}
            onChangeText={setCellType}
            multiline
            numberOfLines={2}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}>
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
            <View style={styles.resultCard}>
              <Text style={[styles.resultTitle, isDark && styles.textDark]}>Gene Editor</Text>
              <View style={styles.sequenceContainer}>
                <Text style={[styles.sequenceLabel, isDark && styles.textDark]}>Original:</Text>
                <Text style={[styles.sequence, isDark && styles.textDark]}>{predictionResult.originalSequence}</Text>
                <Text style={[styles.sequenceLabel, isDark && styles.textDark]}>Edited:</Text>
                <Text style={[styles.sequence, isDark && styles.textDark]}>{predictionResult.editedSequence}</Text>
              </View>
            </View>

            {/* Efficiency Gauge */}
            <View style={styles.resultCard}>
              <Text style={[styles.resultTitle, isDark && styles.textDark]}>Efficiency Gauge</Text>
              <View style={styles.gaugeContainer}>
                <Text style={[styles.efficiencyText, isDark && styles.textDark]}>
                  {predictionResult.efficiency}% Success Probability
                </Text>
                <View style={styles.gauge}>
                  <View style={[styles.gaugeProgress, { width: `${predictionResult.efficiency}%` }]} />
                </View>
              </View>
            </View>

            {/* Off-Target Alerts */}
            <View style={styles.resultCard}>
              <Text style={[styles.resultTitle, isDark && styles.textDark]}>Off-Target Alerts</Text>
              {predictionResult.offTargets.map((target, index) => (
                <View key={index} style={styles.offTargetItem}>
                  {target.risk === 'high' ? (
                    <AlertTriangle color="#EF4444" size={20} />
                  ) : (
                    <Flag color="#F59E0B" size={20} />
                  )}
                  <Text style={[styles.offTargetText, isDark && styles.textDark]}>
                    {target.site} - {target.risk === 'high' ? 'High' : 'Medium'} Risk
                  </Text>
                </View>
              ))}
            </View>

            {/* Therapeutic Report */}
            <View style={styles.resultCard}>
              <Text style={[styles.resultTitle, isDark && styles.textDark]}>Therapeutic Report</Text>
              <Text style={[styles.reportText, isDark && styles.textDark]}>
                {predictionResult.therapeuticSummary}
              </Text>
            </View>
          </View>
        )}
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
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 24,
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
  sectionSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
    marginBottom: 8,
  },
  diseaseList: {
    marginBottom: 20,
  },
  diseaseItem: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 8,
  },
  diseaseItemDark: {
    backgroundColor: '#1F2937',
  },
  selectedDisease: {
    backgroundColor: '#6366F1',
  },
  selectedDiseaseDark: {
    backgroundColor: '#4F46E5',
  },
  diseaseText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
  },
  selectedDiseaseText: {
    color: '#FFFFFF',
  },
  selectedDiseaseTextDark: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
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
  sequenceLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  sequence: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: 1,
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
  gaugeProgress: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 6,
  },
  offTargetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  offTargetText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
    marginLeft: 8,
  },
  reportText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#111827',
    lineHeight: 24,
  },
});

/*
Python Flask Server Setup Instructions:

1. Create a new directory for the ML server:
   mkdir ml_server
   cd ml_server

2. Create a virtual environment and install dependencies:
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install flask flask-cors torch numpy pandas scikit-learn

3. Create server.py with this basic structure:

   from flask import Flask, request, jsonify
   from flask_cors import CORS
   import torch
   # Import your ML model and preprocessing functions here

   app = Flask(__name__)
   CORS(app)

   # Load your ML model here
   # model = YourModel.load('path/to/model')

   @app.route('/api/predict', methods=['POST'])
   def predict():
       data = request.json
       
       # Process input data
       # Make prediction using your model
       # Format response according to PredictionResponse interface
       
       result = {
           'originalSequence': data.get('targetSequence', ''),
           'editedSequence': 'EDITED_SEQUENCE',
           'efficiency': 85.5,
           'offTargets': [
               {'site': 'chr7:145,789,543', 'risk': 'high'},
               {'site': 'chr12:78,901,234', 'risk': 'medium'}
           ],
           'therapeuticSummary': 'Prediction summary...'
       }
       
       return jsonify(result)

   if __name__ == '__main__':
       app.run(debug=True)

4. Run the Flask server:
   python server.py

The server will start on http://localhost:5000

Note: When running on a physical device, replace localhost with your computer's
local IP address in API_BASE_URL above.
*/