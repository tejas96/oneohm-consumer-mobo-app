/**
 * useOnboardingScreenLogic — Custom Logic Hook for Onboarding Screen
 *
 * Separates presentation (UI) from state & side-effects.
 * Manages active slide index, transitions, storage checks, and navigation.
 *
 * Layer: app/auth/hooks
 */

import { useState } from 'react';

import { Route, useAppNavigation } from '@/core/navigation';
import { STORAGE_KEYS } from '@/core/config/constants';
import { setItem } from '@/core/storage/app.storage';
import { colors } from '@/shared/theme';

export const TOTAL_SLIDES = 5;

export interface OnboardingSlideData {
  title: string;
  subtitle: string;
  accentColor: string;
  lottieFile: any;
}

export function useOnboardingScreenLogic() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useAppNavigation();

  const slides: OnboardingSlideData[] = [
    {
      title: 'Track Your\nSolar Project',
      subtitle:
        'Follow every milestone — from site survey to commissioning — in a beautiful, real-time timeline.',
      accentColor: colors.brand.primary, // Brand Primary
      lottieFile: require('@/assets/animations/lottie/slide1_tracking.json'),
    },
    {
      title: 'Real-Time\nNotifications',
      subtitle:
        'Instant alerts on milestones, team visits, payments, and every project update — right on your phone.',
      accentColor: colors.brand.secondary, // Brand Secondary
      lottieFile: require('@/assets/animations/lottie/slide2_notifications.json'),
    },
    {
      title: 'Your Dedicated\nTeam',
      subtitle:
        'Call or chat with your project manager, engineer, and technicians — one tap away.',
      accentColor: colors.brand.accentPurple, // Brand Purple
      lottieFile: require('@/assets/animations/lottie/slide3_team.json'),
    },
    {
      title: 'Documents &\nPayments',
      subtitle:
        'Access agreements, invoices, warranties, and track every payment — all in one secure place.',
      accentColor: colors.semantic.warning, // Amber
      lottieFile: require('@/assets/animations/lottie/slide4_payments.json'),
    },
    {
      title: 'Power Your\nTomorrow',
      subtitle:
        'See your impact on the planet — energy savings, carbon offset, and cost reduction, beautifully visualized.',
      accentColor: colors.brand.accentEmerald, // Emerald Green
      lottieFile: require('@/assets/animations/lottie/slide5_savings.json'),
    },
  ];

  const completeOnboarding = async () => {
    // Persist seen status in AppStorage
    await setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
    // Reset navigation stack to prevent back-navigation to onboarding
    navigation.reset({
      index: 0,
      routes: [{ name: Route.LOGIN }],
    });
  };

  const handleNext = () => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const setSlideIndex = (index: number) => {
    if (index >= 0 && index < TOTAL_SLIDES) {
      setCurrentSlide(index);
    }
  };

  return {
    currentSlide,
    slides,
    totalSlides: TOTAL_SLIDES,
    handleNext,
    handlePrev,
    handleSkip,
    setSlideIndex,
  };
}
