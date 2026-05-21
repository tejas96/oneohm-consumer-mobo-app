/**
 * LanguageSelectScreen — First-launch Language Selection
 *
 * Full-screen Lottie background with clean glass-style language cards.
 * Fully theme-aware: adapts overlay opacity, status bar, and card colors
 * to dark and light mode via useAppTheme().
 *
 * Layer: app/auth/screens
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Text as PaperText } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  useAppTheme,
} from '@/shared/theme';
import { ScreenWrapper, CTButton } from '@/shared/components';

import { useLanguageSelectLogic } from '../hooks/useLanguageSelectLogic';

interface LanguageOptionProps {
  flag: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function LanguageOption({
  flag,
  label,
  isSelected,
  onPress,
}: LanguageOptionProps) {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.langCard,
        {
          borderColor: isSelected
            ? theme.colors.primary
            : theme.colors.outlineVariant,
          backgroundColor: isSelected
            ? theme.colors.primaryContainer
            : theme.colors.surfaceVariant,
        },
      ]}
    >
      <View style={styles.langLeft}>
        <Text style={styles.flag}>{flag}</Text>
        <Text
          style={[
            styles.langLabel,
            {
              color: isSelected
                ? theme.colors.primary
                : theme.colors.onSurfaceVariant,
              fontWeight: isSelected ? fontWeight.bold : fontWeight.medium,
            },
          ]}
        >
          {label}
        </Text>
      </View>
      <View
        style={[
          styles.radioOuter,
          {
            borderColor: isSelected
              ? theme.colors.primary
              : theme.colors.onSurfaceVariant,
          },
          isSelected && { backgroundColor: theme.colors.primary },
        ]}
      >
        {isSelected && (
          <Text style={[styles.checkMark, { color: theme.colors.onPrimary }]}>
            ✓
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function LanguageSelectScreen() {
  const { selectedLanguage, handleLanguageSelect, handleContinue, t } =
    useLanguageSelectLogic();
  const theme = useAppTheme();

  return (
    <ScreenWrapper ambientGlow padded={false} showThemeToggle={true}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('@/assets/animations/lottie/Translation Animation.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
          <PaperText
            variant="displaySmall"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            {t('auth.languageSelect')}
          </PaperText>
          <Text
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('auth.languageSelectSubtitle')}
          </Text>
        </View>

        {/* Language Cards */}
        <View style={styles.cardsContainer}>
          <LanguageOption
            flag="🇮🇳"
            label="मराठी  (Marathi)"
            isSelected={selectedLanguage === 'mr'}
            onPress={() => handleLanguageSelect('mr')}
          />
          <View style={styles.cardSpacer} />
          <LanguageOption
            flag="🇬🇧"
            label="English"
            isSelected={selectedLanguage === 'en'}
            onPress={() => handleLanguageSelect('en')}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <CTButton
            variant="primary"
            size="lg"
            onPress={handleContinue}
            style={styles.continueButton}
          >
            {t('auth.continue')} →
          </CTButton>
          <Text
            style={[styles.caption, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('auth.languageChangeCaption')}
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const CARD_RADIUS = borderRadius.card;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  lottieContainer: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  title: {
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
  },
  cardSpacer: {
    height: spacing.md,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: spacing.md,
    lineHeight: 34,
  },
  langLabel: {
    fontSize: fontSize.headline,
    flexShrink: 1,
  },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  checkMark: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  continueButton: {
    width: '100%',
  },
  caption: {
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },
});
