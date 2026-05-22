import React from 'react';

import { useTranslation } from '@/core/i18n';
import { CTOnboardingPlaceholder } from '@/shared/components';

export function OnboardingState() {
  const { t } = useTranslation();

  return (
    <CTOnboardingPlaceholder
      title={t('dashboard.onboardingTitle')}
      description={t('dashboard.onboardingDesc')}
      lottieSource={require('@/assets/animations/lottie/Man and robot with computers sitting together in workplace.json')}
      statusText={t('dashboard.onboardingStage')}
      status="warning"
    />
  );
}
