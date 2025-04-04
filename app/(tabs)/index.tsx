import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, useColorScheme, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Dna, Brain, FlaskRound as Flask, Info } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const features = [
  {
    title: 'Gene Analysis',
    description: 'Advanced analysis of genetic sequences using AI',
    icon: Dna,
    color: '#818CF8',
    delay: 200,
  },
  {
    title: 'Predictive Models',
    description: 'ML-powered predictions for gene editing outcomes',
    icon: Brain,
    color: '#34D399',
    delay: 400,
  },
  {
    title: 'Research Tools',
    description: 'Comprehensive suite of research and analysis tools',
    icon: Flask,
    color: '#F472B6',
    delay: 600,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView 
      style={[styles.container, isDark && styles.containerDark]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=2940&auto=format&fit=crop' }}
          style={StyleSheet.absoluteFill}
          accessibilityLabel="DNA structure background image"
        />
        <LinearGradient
          colors={isDark 
            ? ['rgba(17, 24, 39, 0.8)', 'rgba(17, 24, 39, 0.95)']
            : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.95)']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View 
          entering={FadeInDown.duration(1000).delay(200)}
          style={styles.headerContent}
        >
          <Text style={[styles.title, isDark && styles.titleDark]}>GeneEdit AI</Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            Advanced Gene Editing with Predictive Analytics
          </Text>
          <TouchableOpacity
            style={[styles.button, Platform.OS === 'web' && styles.buttonHover]}
            onPress={() => router.push('/predict')}
            accessibilityLabel="Start Analysis"
            accessibilityHint="Navigate to gene analysis screen"
          >
            <Text style={styles.buttonText}>Start Analysis</Text>
            <ArrowRight size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Info size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            Our AI-powered platform helps researchers predict optimal gene edits
            for treating genetic disorders with unprecedented accuracy.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Key Features
        </Text>

        {features.map((feature, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.duration(600).delay(feature.delay)}
          >
            <TouchableOpacity
              style={[
                styles.featureCard,
                isDark && styles.featureCardDark,
                Platform.OS === 'web' && styles.featureCardHover,
              ]}
              accessibilityLabel={feature.title}
              accessibilityHint={feature.description}
            >
              <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                <feature.icon size={24} color="#FFFFFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, isDark && styles.featureDescriptionDark]}>
                  {feature.description}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.statsContainer}>
          {[
            { number: '99%', label: 'Accuracy' },
            { number: '50K+', label: 'Sequences' },
            { number: '24/7', label: 'Analysis' }
          ].map((stat, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.duration(600).delay(800 + index * 100)}
              style={[styles.statCard, isDark && styles.statCardDark]}
            >
              <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>
                {stat.number}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                {stat.label}
              </Text>
            </Animated.View>
          ))}
        </View>
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
    height: 500,
    position: 'relative',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -1,
  },
  titleDark: {
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    opacity: 0.9,
    marginBottom: 32,
    lineHeight: 28,
  },
  subtitleDark: {
    color: '#D1D5DB',
  },
  button: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'flex-start',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s, background-color 0.2s',
      },
    }),
  },
  buttonHover: {
    ':hover': {
      backgroundColor: '#4F46E5',
      transform: 'translateY(-2px)',
    },
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  content: {
    padding: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  infoTextDark: {
    color: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 24,
  },
  sectionTitleDark: {
    color: '#F9FAFB',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      },
    }),
  },
  featureCardDark: {
    backgroundColor: '#1F2937',
  },
  featureCardHover: {
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  featureTitleDark: {
    color: '#F9FAFB',
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  featureDescriptionDark: {
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statCardDark: {
    backgroundColor: '#1F2937',
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  statNumberDark: {
    color: '#818CF8',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  statLabelDark: {
    color: '#9CA3AF',
  },
});