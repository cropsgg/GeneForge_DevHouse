import { View, Text, StyleSheet, ScrollView, Linking, useColorScheme, Image } from 'react-native';
import { ExternalLink, GitBranch, FlaskRound as Flask, Brain } from 'lucide-react-native';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2940&auto=format&fit=crop' }}
          style={styles.headerImage}
        />
        <View style={[styles.overlay, isDark && styles.overlayDark]} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.textDark]}>About GeneEdit Predict</Text>
        
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Brain size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Our Mission</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            GeneEdit Predict combines cutting-edge machine learning with gene editing
            technology to accelerate the development of personalized genetic
            therapies. Our platform helps researchers predict optimal gene edits for
            treating genetic disorders.
          </Text>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Flask size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>How It Works</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Our AI model analyzes genetic sequences and disease patterns to recommend
            precise CRISPR-based edits. The system considers factors like edit
            efficiency, off-target effects, and therapeutic potential to provide
            comprehensive predictions.
          </Text>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <GitBranch size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Technology</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            • Advanced Machine Learning Models{'\n'}
            • CRISPR Gene Editing Analysis{'\n'}
            • Real-time Prediction Engine{'\n'}
            • Comprehensive Safety Checks
          </Text>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <ExternalLink size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Research</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            Our work is based on peer-reviewed research in genomics and machine
            learning. For more information, visit our research page or contact our
            team.
          </Text>
        </View>

        <Text style={[styles.version, isDark && styles.versionDark]}>Version 1.0.0</Text>
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
    marginBottom: 24,
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
});