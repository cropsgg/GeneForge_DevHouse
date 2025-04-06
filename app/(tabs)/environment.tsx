import { LinearGradient } from 'expo-linear-gradient';
import { CircleAlert as AlertCircle, Thermometer, Droplets, Wind, RefreshCw } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

// Interface for lab environment data
interface LabEnvironment {
  temperature: number;
  humidity: number;
  aqi: number;
  isOptimal: boolean;
}

// Optimal ranges for lab environment
const OPTIMAL_RANGES = {
  temperature: { min: 20, max: 25 }, // °C
  humidity: { min: 40, max: 60 },    // %
  aqi: { min: 0, max: 200 },         // AQI
};

export default function EnvironmentScreen() {
  const { isDark } = useTheme();

  const [labEnvironment, setLabEnvironment] = useState<LabEnvironment | null>(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState<string | null>(null);

  // Fetch lab environment data on component mount and set interval for real-time updates
  useEffect(() => {
    fetchLabEnvironment();
    const intervalId = setInterval(fetchLabEnvironment, 1000); // Fetch every 1 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Function to fetch lab environment data from the server
  const fetchLabEnvironment = async () => {
    setError(null);
    
    try {
      // Fetch data from the API endpoint
      const response = await fetch('http://192.168.12.45/data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Parse the JSON response
      const data = await response.json();
      
      // Check if all values are within optimal range
      const isOptimal = 
        data.temperature >= OPTIMAL_RANGES.temperature.min && 
        data.temperature <= OPTIMAL_RANGES.temperature.max &&
        data.humidity >= OPTIMAL_RANGES.humidity.min && 
        data.humidity <= OPTIMAL_RANGES.humidity.max &&
        data.aqi >= OPTIMAL_RANGES.aqi.min && 
        data.aqi <= OPTIMAL_RANGES.aqi.max;
      
      // Use functional update to ensure smooth state transition
      setLabEnvironment(prev => ({
        temperature: data.temperature,
        humidity: data.humidity,
        aqi: data.aqi,
        isOptimal
      }));
    } catch (error) {
      console.error('Error fetching environment data:', error);
      setError('Failed to fetch laboratory environment data');
    } finally {
      setLoading(false); // Only set loading to false after initial load
    }
  };

  // Render the environment data
  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={isDark ? ['#1F2937', '#111827'] : ['#F9FAFB', '#F3F4F6']}
        style={styles.header}
      >
        <Text style={[styles.title, isDark && styles.textDark]}>Laboratory Environment</Text>
        
        <Text style={[styles.description, isDark && styles.textDark]}>
          Monitor and manage optimal conditions for gene editing experiments
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle color="#EF4444" size={20} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Environment Status Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={[styles.loadingText, isDark && styles.textDark]}>
              Checking laboratory environment...
            </Text>
          </View>
        ) : labEnvironment && (
          <View style={styles.section}>
            <View style={[styles.environmentCard, isDark && styles.environmentCardDark]}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                Environment Status
              </Text>
              
              <View style={styles.environmentMetrics}>
                <View style={styles.metricItem}>
                  <Thermometer size={20} color={isDark ? "#F9FAFB" : "#111827"} />
                  <Text style={[styles.metricLabel, isDark && styles.textDark]}>Temperature:</Text>
                  <Text style={[
                    styles.metricValue, 
                    isDark && styles.textDark,
                    labEnvironment.temperature < OPTIMAL_RANGES.temperature.min || 
                    labEnvironment.temperature > OPTIMAL_RANGES.temperature.max ? styles.metricValueBad : styles.metricValueGood
                  ]}>
                    {labEnvironment.temperature}°C
                  </Text>
                </View>
                
                <View style={styles.metricItem}>
                  <Droplets size={20} color={isDark ? "#F9FAFB" : "#111827"} />
                  <Text style={[styles.metricLabel, isDark && styles.textDark]}>Humidity:</Text>
                  <Text style={[
                    styles.metricValue, 
                    isDark && styles.textDark,
                    labEnvironment.humidity < OPTIMAL_RANGES.humidity.min || 
                    labEnvironment.humidity > OPTIMAL_RANGES.humidity.max ? styles.metricValueBad : styles.metricValueGood
                  ]}>
                    {labEnvironment.humidity}%
                  </Text>
                </View>
                
                <View style={styles.metricItem}>
                  <Wind size={20} color={isDark ? "#F9FAFB" : "#111827"} />
                  <Text style={[styles.metricLabel, isDark && styles.textDark]}>Air Quality:</Text>
                  <Text style={[
                    styles.metricValue, 
                    isDark && styles.textDark,
                    labEnvironment.aqi < OPTIMAL_RANGES.aqi.min || 
                    labEnvironment.aqi > OPTIMAL_RANGES.aqi.max ? styles.metricValueBad : styles.metricValueGood
                  ]}>
                    AQI {labEnvironment.aqi}
                  </Text>
                </View>
              </View>
              
              <View style={[
                styles.environmentStatus,
                labEnvironment.isOptimal ? styles.environmentStatusGood : styles.environmentStatusBad
              ]}>
                <Text style={styles.environmentStatusText}>
                  {labEnvironment.isOptimal 
                    ? "Environment Optimal for Gene Editing" 
                    : "Environment Not Suitable for Gene Editing"}
                </Text>
              </View>
            </View>

            <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
              <Text style={[styles.infoTitle, isDark && styles.textDark]}>Optimal Ranges</Text>
              
              <View style={styles.rangeItem}>
                <Text style={[styles.rangeLabel, isDark && styles.textDark]}>Temperature:</Text>
                <Text style={[styles.rangeValue, isDark && styles.textDark]}>
                  {OPTIMAL_RANGES.temperature.min}°C - {OPTIMAL_RANGES.temperature.max}°C
                </Text>
              </View>
              
              <View style={styles.rangeItem}>
                <Text style={[styles.rangeLabel, isDark && styles.textDark]}>Humidity:</Text>
                <Text style={[styles.rangeValue, isDark && styles.textDark]}>
                  {OPTIMAL_RANGES.humidity.min}% - {OPTIMAL_RANGES.humidity.max}%
                </Text>
              </View>
              
              <View style={styles.rangeItem}>
                <Text style={[styles.rangeLabel, isDark && styles.textDark]}>Air Quality Index:</Text>
                <Text style={[styles.rangeValue, isDark && styles.textDark]}>
                  {OPTIMAL_RANGES.aqi.min} - {OPTIMAL_RANGES.aqi.max}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={fetchLabEnvironment}
            >
              <RefreshCw size={20} color="#FFFFFF" />
              <Text style={styles.refreshButtonText}>Refresh Environment Data</Text>
            </TouchableOpacity>
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
    textAlign: 'center',
  },
  description: {
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
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
  environmentCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  environmentCardDark: {
    backgroundColor: '#1F2937',
  },
  environmentMetrics: {
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
    marginLeft: 8,
    marginRight: 8,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  metricValueGood: {
    color: '#10B981',
  },
  metricValueBad: {
    color: '#EF4444',
  },
  environmentStatus: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  environmentStatusGood: {
    backgroundColor: '#D1FAE5',
  },
  environmentStatusBad: {
    backgroundColor: '#FEE2E2',
  },
  environmentStatusText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  infoCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoCardDark: {
    backgroundColor: '#1F2937',
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rangeLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
    marginRight: 8,
    flex: 1,
  },
  rangeValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#10B981',
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
  },
});