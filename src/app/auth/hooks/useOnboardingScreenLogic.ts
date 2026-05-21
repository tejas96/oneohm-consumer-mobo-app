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
import { useAppTheme } from '@/shared/theme';
import { useTranslation } from '@/core/i18n';

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
  const { t } = useTranslation();
  const theme = useAppTheme();

  const slides: OnboardingSlideData[] = [
    {
      title: t('onboarding.slide1.title'),
      subtitle: t('onboarding.slide1.subtitle'),
      accentColor: theme.colors.primary, // Brand Primary
      lottieFile: require('@/assets/animations/lottie/Tracking my package.json'),
    },
    {
      title: t('onboarding.slide2.title'),
      subtitle: t('onboarding.slide2.subtitle'),
      accentColor: theme.colors.secondary, // Brand Secondary
      lottieFile: require('@/assets/animations/lottie/slide2_notifications.json'),
    },
    {
      title: t('onboarding.slide3.title'),
      subtitle: t('onboarding.slide3.subtitle'),
      accentColor: theme.colors.brandPurple, // Brand Purple
      lottieFile: require('@/assets/animations/lottie/slide3_team.json'),
    },
    {
      title: t('onboarding.slide4.title'),
      subtitle: t('onboarding.slide4.subtitle'),
      accentColor: theme.colors.warningText, // Amber (warning state)
      lottieFile: require('@/assets/animations/lottie/slide4_payments.json'),
    },
    {
      title: t('onboarding.slide5.title'),
      subtitle: t('onboarding.slide5.subtitle'),
      accentColor: theme.colors.tertiary, // Emerald Green
      lottieFile: require('@/assets/animations/lottie/Rocket Launch.json'),
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
