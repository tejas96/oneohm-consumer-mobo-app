import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@/core/i18n';
import type { Language } from '@/core/i18n';
import type { AuthStackParamList } from '@/core/navigation/navigation.types';
import { Route } from '@/core/navigation/routes';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  Route.LANGUAGE_SELECT
>;

export function useLanguageSelectLogic() {
  const { currentLanguage, setLanguage, t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const handleLanguageSelect = async (lang: Language) => {
    await setLanguage(lang);
  };

  const handleContinue = () => {
    // Navigate to onboarding
    navigation.replace(Route.ONBOARDING);
  };

  return {
    selectedLanguage: currentLanguage,
    handleLanguageSelect,
    handleContinue,
    t,
  };
}
