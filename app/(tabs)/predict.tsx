import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleAlert as AlertCircle } from 'lucide-react-native';

const diseases = [
  'Cystic Fibrosis',
  'Sickle Cell Disease',
  'Huntington\'s Disease',
  'Duchenne Muscular Dystrophy',
  'Beta Thalassemia',
];

export default function PredictScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedDisease, setSelectedDisease] = useState('');
  const [geneSequence, setGeneSequence] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedDisease && !geneSequence) {
      setError('Please select a disease or enter a gene sequence');
      return;
    }
    
    setError(null);
    setLoading(true);
    // TODO: Implement API call to prediction server
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <ScrollView 
      style={[
        styles.container,
        isDark && styles.containerDark
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={isDark ? ['#1F2937', '#111827'] : ['#F9FAFB', '#F3F4F6']}
        style={styles.header}
      >
        <Text style={[styles.title, isDark && styles.textDark]}>Gene Edit Prediction</Text>
        <Text style={[styles.subtitle, isDark && styles.textDark]}>
          Select a disease or input a gene sequence to get editing recommendations
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle color="#EF4444" size={20} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Select Disease</Text>
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

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Or Enter Gene Sequence</Text>
        <TextInput
          style={[
            styles.input,
            isDark && styles.inputDark,
            Platform.select({
              web: styles.inputWeb,
            })
          ]}
          placeholder="Enter gene sequence..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={geneSequence}
          onChangeText={setGeneSequence}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Analyzing...' : 'Predict Edit'}
          </Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 20,
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
  inputWeb: {
    outlineStyle: 'none',
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
});