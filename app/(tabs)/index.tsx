import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Dna, Brain, FlaskRound as Flask, Info } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useTheme } from '../context/ThemeContext';

// Define typed styles for web platform
type WebStyles = {
  cursor?: string;
  transition?: string;
  ':hover'?: {
    backgroundColor?: string;
    transform?: string;
    boxShadow?: string;
  };
};

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
  const { isDark } = useTheme();

  // Use as any to bypass TypeScript errors for style props
  const containerStyle = [styles.container, isDark && styles.containerDark] as StyleProp<ViewStyle>;
  const headerContentStyle = styles.headerContent as StyleProp<ViewStyle>;
  const buttonStyle = [
    styles.button,
    Platform.OS === 'web' && styles.buttonHover,
  ] as StyleProp<ViewStyle>;
  const infoCardStyle = [styles.infoCard, isDark && styles.infoCardDark] as StyleProp<ViewStyle>;
  const featureCardStyle = [
    styles.featureCard,
    isDark && styles.featureCardDark,
    Platform.OS === 'web' && styles.featureCardHover,
  ] as StyleProp<ViewStyle>;
  const statCardStyle = [styles.statCard, isDark && styles.statCardDark] as StyleProp<ViewStyle>;

  return (
    <ScrollView style={containerStyle} showsVerticalScrollIndicator={false}>
      <View style={styles.header as StyleProp<ViewStyle>}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=2940&auto=format&fit=crop',
          }}
          style={StyleSheet.absoluteFill}
          accessibilityLabel="DNA structure background image"
        />
        <LinearGradient
          colors={
            isDark
              ? ['rgba(17, 24, 39, 0.8)', 'rgba(17, 24, 39, 0.95)']
              : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.95)']
          }
          style={StyleSheet.absoluteFill}
        />
        <Animated.View entering={FadeInDown.duration(1000).delay(200)} style={headerContentStyle}>
          <Text style={[styles.title, isDark && styles.titleDark] as StyleProp<TextStyle>}>
            GeneForge
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark] as StyleProp<TextStyle>}>
            Advanced Gene Editing with Predictive Analytics
          </Text>
          <TouchableOpacity
            style={buttonStyle}
            onPress={() => router.push('/predict')}
            accessibilityLabel="Start Analysis"
            accessibilityHint="Navigate to gene analysis screen"
          >
            <Text style={styles.buttonText as StyleProp<TextStyle>}>Start Analysis</Text>
            <ArrowRight
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon as StyleProp<ViewStyle>}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.content as StyleProp<ViewStyle>}>
        <View style={infoCardStyle}>
          <Info size={24} color={isDark ? '#6366F1' : '#4F46E5'} />
          <Text style={[styles.infoText, isDark && styles.infoTextDark] as StyleProp<TextStyle>}>
            Our AI-powered platform helps researchers predict optimal gene edits for treating
            genetic disorders with unprecedented accuracy.
          </Text>
        </View>

        <Text
          style={[styles.sectionTitle, isDark && styles.sectionTitleDark] as StyleProp<TextStyle>}
        >
          Key Features
        </Text>

        {features.map((feature, index) => (
          <Animated.View key={index} entering={FadeInUp.duration(600).delay(feature.delay)}>
            <TouchableOpacity
              style={featureCardStyle}
              accessibilityLabel={feature.title}
              accessibilityHint={feature.description}
            >
              <View
                style={
                  [styles.iconContainer, { backgroundColor: feature.color }] as StyleProp<ViewStyle>
                }
              >
                <feature.icon size={24} color="#FFFFFF" />
              </View>
              <View style={styles.featureContent as StyleProp<ViewStyle>}>
                <Text
                  style={
                    [styles.featureTitle, isDark && styles.featureTitleDark] as StyleProp<TextStyle>
                  }
                >
                  {feature.title}
                </Text>
                <Text
                  style={
                    [
                      styles.featureDescription,
                      isDark && styles.featureDescriptionDark,
                    ] as StyleProp<TextStyle>
                  }
                >
                  {feature.description}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.statsContainer as StyleProp<ViewStyle>}>
          {[
            { number: '99%', label: 'Accuracy' },
            { number: '50K+', label: 'Sequences' },
            { number: '24/7', label: 'Analysis' },
          ].map((stat, index) => {
            const cardStyles = [
              styles.statCard,
              isDark && styles.statCardDark,
              index > 0 && styles.statCardMargin,
            ].filter(Boolean) as StyleProp<ViewStyle>;

            const numberStyles = [styles.statNumber, isDark && styles.statNumberDark].filter(
              Boolean
            ) as StyleProp<TextStyle>;

            const labelStyles = [styles.statLabel, isDark && styles.statLabelDark].filter(
              Boolean
            ) as StyleProp<TextStyle>;

            return (
              <Animated.View
                key={index}
                entering={FadeInUp.duration(600).delay(800 + index * 100)}
                style={cardStyles}
              >
                <View style={styles.statContent as StyleProp<ViewStyle>}>
                  <Text style={numberStyles} adjustsFontSizeToFit numberOfLines={1}>
                    {stat.number}
                  </Text>
                  <Text style={labelStyles} adjustsFontSizeToFit numberOfLines={1}>
                    {stat.label}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

// Define a combined style type that includes web properties
type StyleWithWeb = ViewStyle & WebStyles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  } as StyleWithWeb,
  containerDark: {
    backgroundColor: '#111827',
  } as StyleWithWeb,
  header: {
    height: 500,
    position: 'relative',
  } as StyleWithWeb,
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  } as StyleWithWeb,
  title: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -1,
  } as TextStyle,
  titleDark: {
    color: '#F9FAFB',
  } as TextStyle,
  subtitle: {
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    opacity: 0.9,
    marginBottom: 32,
    lineHeight: 28,
  } as TextStyle,
  subtitleDark: {
    color: '#D1D5DB',
  } as TextStyle,
  button: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web'
      ? {
          cursor: 'pointer',
          transition: 'transform 0.2s, background-color 0.2s',
        }
      : {}),
  } as StyleWithWeb,
  buttonHover:
    Platform.OS === 'web'
      ? ({
          ':hover': {
            backgroundColor: '#4F46E5',
            transform: 'translateY(-2px)',
          } as any,
        } as any)
      : {},
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginRight: 8,
  } as TextStyle,
  buttonIcon: {
    marginLeft: 4,
  } as ViewStyle,
  content: {
    padding: 24,
  } as StyleWithWeb,
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 16,
  } as StyleWithWeb,
  infoCardDark: {
    backgroundColor: '#1F2937',
  } as StyleWithWeb,
  infoText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 24,
  } as TextStyle,
  infoTextDark: {
    color: '#D1D5DB',
  } as TextStyle,
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 24,
  } as TextStyle,
  sectionTitleDark: {
    color: '#F9FAFB',
  } as TextStyle,
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...(Platform.OS === 'web'
      ? {
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }
      : {}),
  } as StyleWithWeb,
  featureCardDark: {
    backgroundColor: '#1F2937',
  } as StyleWithWeb,
  featureCardHover:
    Platform.OS === 'web'
      ? ({
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          } as any,
        } as any)
      : {},
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  } as ViewStyle,
  featureContent: {
    flex: 1,
  } as ViewStyle,
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 4,
  } as TextStyle,
  featureTitleDark: {
    color: '#F9FAFB',
  } as TextStyle,
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  } as TextStyle,
  featureDescriptionDark: {
    color: '#9CA3AF',
  } as TextStyle,
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginHorizontal: -6,
  } as ViewStyle,
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    justifyContent: 'center',
  } as ViewStyle,
  statCardMargin: {
    marginLeft: 12,
  } as ViewStyle,
  statCardDark: {
    backgroundColor: '#1F2937',
  } as ViewStyle,
  statContent: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  statNumber: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#6366F1',
    textAlign: 'center',
    includeFontPadding: false,
    marginBottom: 8,
  } as TextStyle,
  statNumberDark: {
    color: '#818CF8',
  } as TextStyle,
  statLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    textAlign: 'center',
    includeFontPadding: false,
  } as TextStyle,
  statLabelDark: {
    color: '#9CA3AF',
  } as TextStyle,
});
