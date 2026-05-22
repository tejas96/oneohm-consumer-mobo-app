import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import {
  useAppTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  hexToRgba,
  colors,
} from '@/shared/theme';
import type { TranslationKey } from '@/core/i18n/i18n.types';

interface LanguageToggleProps {
  currentLanguage: string;
  setLanguage: (lang: 'en' | 'mr') => void;
  t: (key: TranslationKey) => string;
}

export function LanguageToggle({
  currentLanguage,
  setLanguage,
  t,
}: LanguageToggleProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('profile.languageHeader')}
      </Text>
      <View
        style={[
          styles.langWrapper,
          { backgroundColor: theme.colors.glassBgStrong },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.langButton,
            currentLanguage === 'en' && [
              styles.langActive,
              {
                backgroundColor: theme.colors.primary,
                ...Platform.select({
                  ios: {
                    shadowColor: hexToRgba(colors.neutral.black, 0.1),
                  },
                }),
              },
            ],
          ]}
          onPress={() => setLanguage('en')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              currentLanguage === 'en'
                ? { color: theme.colors.onPrimary }
                : { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
            ]}
          >
            {t('profile.english')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.langButton,
            currentLanguage === 'mr' && [
              styles.langActive,
              {
                backgroundColor: theme.colors.primary,
                ...Platform.select({
                  ios: {
                    shadowColor: hexToRgba(colors.neutral.black, 0.1),
                  },
                }),
              },
            ],
          ]}
          onPress={() => setLanguage('mr')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              currentLanguage === 'mr'
                ? { color: theme.colors.onPrimary }
                : { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
            ]}
          >
            {t('profile.marathi')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  langWrapper: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing['2xs'],
  },
  langButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langActive: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  langText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
});
