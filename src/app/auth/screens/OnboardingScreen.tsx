/**
 * OnboardingScreen — Carbon Titanium High-Fidelity Onboarding Flow
 *
 * Implements sliding transitions, custom animated particles, and local Lottie support.
 * Separates presentation from logic using `useOnboardingScreenLogic` custom hook.
 * Fully theme-aware: all colors sourced from useAppTheme().
 *
 * Layer: app/auth/screens
 * Rules: Skinny Component, absolute imports, 100% theme token safety.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, Icon } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import {
  fontSize,
  fontWeight,
  spacing,
  useAppTheme,
  colors,
  hexToRgba,
} from '@/shared/theme';
import {
  ScreenWrapper,
  CTButton,
  ThemeToggleButton,
} from '@/shared/components';
import { useTranslation } from '@/core/i18n';
import {
  useOnboardingScreenLogic,
  TOTAL_SLIDES,
} from '../hooks/useOnboardingScreenLogic';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Floating Particle Dots (60fps Native Animations) ───
interface ParticleConfig {
  id: number;
  delay: number;
  left: number;
  size: number;
  duration: number;
  color: string;
}

const PARTICLES: ParticleConfig[] = [
  {
    id: 1,
    delay: 0,
    left: 15,
    size: 4,
    duration: 8000,
    color: hexToRgba(colors.brand.primary, 0.4),
  },
  {
    id: 2,
    delay: 2000,
    left: 35,
    size: 5,
    duration: 9000,
    color: hexToRgba(colors.brand.secondary, 0.3),
  },
  {
    id: 3,
    delay: 1000,
    left: 60,
    size: 3,
    duration: 7500,
    color: hexToRgba(colors.brand.primary, 0.5),
  },
  {
    id: 4,
    delay: 3500,
    left: 80,
    size: 4,
    duration: 10000,
    color: hexToRgba(colors.brand.secondary, 0.2),
  },
  {
    id: 5,
    delay: 500,
    left: 45,
    size: 3,
    duration: 8500,
    color: hexToRgba(colors.brand.primary, 0.3),
  },
  {
    id: 6,
    delay: 4000,
    left: 25,
    size: 5,
    duration: 9500,
    color: hexToRgba(colors.brand.secondary, 0.4),
  },
  {
    id: 7,
    delay: 1500,
    left: 70,
    size: 4,
    duration: 7000,
    color: hexToRgba(colors.brand.primary, 0.4),
  },
  {
    id: 8,
    delay: 3000,
    left: 90,
    size: 3,
    duration: 9000,
    color: hexToRgba(colors.brand.secondary, 0.3),
  },
];

function FloatingParticle({
  delay,
  left,
  size,
  duration,
  color,
}: Omit<ParticleConfig, 'id'>) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
      ),
    ]);
    animation.start();
    return () => animation.stop();
  }, [animatedValue, delay, duration]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, -320],
  });
  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 0.8, 0.3, 0],
  });
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.2],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    />
  );
}

export function OnboardingScreen() {
  const { currentSlide, slides, handleNext, handleSkip, setSlideIndex } =
    useOnboardingScreenLogic();
  const { t } = useTranslation();
  const theme = useAppTheme();

  const scrollViewRef = useRef<ScrollView>(null);
  const activeSlide = slides[currentSlide];

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: currentSlide * SCREEN_WIDTH,
      animated: true,
    });
  }, [currentSlide]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / SCREEN_WIDTH);
    if (index !== currentSlide && index >= 0 && index < TOTAL_SLIDES) {
      setSlideIndex(index);
    }
  };

  return (
    <ScreenWrapper
      padded={false}
      ambientGlow={false}
      style={styles.wrapper}
      showThemeToggle={false}
    >
      {/* ─── Particle Effects Layer ─── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {PARTICLES.map(p => {
          const isPrimary = p.id % 2 !== 0;
          const baseColor = isPrimary
            ? theme.colors.primary
            : theme.colors.secondary;
          const alpha = isPrimary ? 0.3 : 0.2;
          const dynamicColor = hexToRgba(baseColor, alpha);
          return (
            <FloatingParticle
              key={p.id}
              delay={p.delay}
              left={p.left}
              size={p.size}
              duration={p.duration}
              color={dynamicColor}
            />
          );
        })}
      </View>

      {/* ─── Theme Toggle (Top Left) ─── */}
      <View style={styles.themeToggle}>
        <ThemeToggleButton />
      </View>

      {/* ─── Skip Button (Top Right) ─── */}
      {currentSlide < TOTAL_SLIDES - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.skipText, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('common.skip')}
          </Text>
        </TouchableOpacity>
      )}

      {/* ─── Paginated Slider ─── */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={styles.scrollArea}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slideContainer}>
            {/* Lottie Animation */}
            <View style={styles.lottieContainer}>
              <LottieView
                source={slide.lottieFile}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>

            {/* Typography */}
            <View style={styles.textStack}>
              <Text
                variant="displayLarge"
                style={[styles.title, { color: theme.colors.onBackground }]}
              >
                {slide.title.split('\n')[0]}
                {'\n'}
                <Text
                  style={[styles.titleAccent, { color: slide.accentColor }]}
                >
                  {slide.title.split('\n')[1]}
                </Text>
              </Text>
              <Text
                variant="bodyLarge"
                style={[
                  styles.subtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {slide.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ─── Footer Controls ─── */}
      <View style={styles.footer}>
        {currentSlide < TOTAL_SLIDES - 1 ? (
          <View style={styles.controlsRow}>
            {/* Progress Dots */}
            <View style={styles.dotsRow}>
              {slides.map((_, index) => {
                const isActive = index === currentSlide;
                return (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      isActive
                        ? [
                            styles.activeDot,
                            {
                              backgroundColor: activeSlide.accentColor,
                              shadowColor: activeSlide.accentColor,
                            },
                          ]
                        : [
                            styles.inactiveDot,
                            { backgroundColor: theme.colors.outlineVariant },
                          ],
                    ]}
                  />
                );
              })}
            </View>

            {/* Circular Next Button */}
            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: activeSlide.accentColor },
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Icon
                source="chevron-right"
                size={32}
                color={colors.neutral.white}
              />
            </TouchableOpacity>
          </View>
        ) : (
          /* Final slide CTA Button */
          <Animated.View style={styles.ctaWrapper}>
            <CTButton
              variant="primary"
              size="lg"
              onPress={handleNext}
              style={{ backgroundColor: activeSlide.accentColor }}
            >
              {t('auth.getStarted')}
            </CTButton>
          </Animated.View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  themeToggle: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    zIndex: 50,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.xl,
    zIndex: 50,
    padding: spacing.xs,
  },
  skipText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
  particle: {
    position: 'absolute',
    bottom: -10,
    pointerEvents: 'none',
  },
  lottieContainer: {
    position: 'relative',
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  lottie: {
    width: 260,
    height: 260,
  },
  textStack: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  title: {
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  titleAccent: {
    fontWeight: fontWeight.black,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl * 1.5,
    minHeight: 100,
    justifyContent: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 28,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  inactiveDot: {
    width: 6,
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  ctaWrapper: {
    width: '100%',
  },
});
