/**
 * Login Screen — Phone number input for OTP request
 *
 * Layer: app/auth/screens
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import { ScreenWrapper, CTButton, CTTextInput } from '@/shared/components';
import { spacing, useAppTheme } from '@/shared/theme';
import { useLoginScreenLogic } from '../hooks/useLoginScreenLogic';

export function LoginScreen() {
  const {
    phone,
    setPhone,
    isPending,
    handleRequestOtp,
    handleLanguageChange,
    isEn,
    t,
  } = useLoginScreenLogic();
  const theme = useAppTheme();

  return (
    <ScreenWrapper ambientGlow padded={false} showThemeToggle={false}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Language Toggle (Top Right) */}
        <View style={styles.langToggleContainer}>
          <View
            style={[
              styles.langToggle,
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <Pressable
              onPress={() => handleLanguageChange('en')}
              style={[
                styles.langBtn,
                isEn && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.langText,
                  {
                    color: isEn
                      ? theme.colors.onPrimary
                      : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                EN
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleLanguageChange('mr')}
              style={[
                styles.langBtn,
                !isEn && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.langText,
                  {
                    color: !isEn
                      ? theme.colors.onPrimary
                      : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                मराठी
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View
              style={[
                styles.logoIcon,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                <Circle
                  cx="24"
                  cy="24"
                  r="14"
                  stroke={theme.colors.onPrimary}
                  strokeWidth="2.5"
                />
                <Circle cx="24" cy="24" r="5" fill={theme.colors.onPrimary} />
              </Svg>
            </View>
            <Text
              style={[styles.logoText, { color: theme.colors.onBackground }]}
            >
              One
              <Text
                style={[
                  styles.logoTextHighlight,
                  { color: theme.colors.primary },
                ]}
              >
                Ohm
              </Text>
            </Text>
          </View>

          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
              {t('auth.loginTitle')}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t('auth.loginSubtitle')}
            </Text>
          </View>

          {/* Phone Input */}
          <View style={styles.inputSection}>
            <Text
              style={[
                styles.inputLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t('auth.mobileNumberLabel')}
            </Text>
            <View style={styles.inputRow}>
              {/* Country Code */}
              <View
                style={[
                  styles.countryCode,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.outlineVariant,
                  },
                ]}
              >
                <Text style={styles.countryEmoji}>🇮🇳</Text>
                <Text
                  style={[
                    styles.countryPrefix,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  +91
                </Text>
                <Svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.colors.onSurfaceVariant}
                  strokeWidth="2.5"
                >
                  <Polyline points="6 9 12 15 18 9" />
                </Svg>
              </View>
              {/* Number Input */}
              <CTTextInput
                containerStyle={styles.inputContainer}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder={t('auth.mobileNumberPlaceholder')}
                value={phone}
                onChangeText={text => setPhone(text.replace(/\D/g, ''))}
                autoFocus
              />
            </View>
          </View>

          {/* Info text */}
          <View style={styles.infoTextContainer}>
            <Svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.onSurfaceVariant}
              strokeWidth="2"
              style={styles.infoIcon}
            >
              <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </Svg>
            <Text
              style={[
                styles.infoText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t('auth.verificationInfo')}
            </Text>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* CTA Button */}
          <View style={styles.ctaContainer}>
            <CTButton
              variant="primary"
              size="lg"
              onPress={handleRequestOtp}
              disabled={isPending}
              loading={isPending}
              style={[styles.button, { shadowColor: theme.colors.primary }]}
            >
              {t('auth.continue')}
            </CTButton>

            <Text
              style={[
                styles.termsText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t('auth.termsAndPrivacy').split('Terms')[0]}
              <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                {t('auth.terms')}
              </Text>{' '}
              &{' '}
              <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                {t('auth.privacyPolicy')}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  langToggleContainer: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    zIndex: 20,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 96,
    paddingBottom: 32,
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 64,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
  },
  headingContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    opacity: 0.8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 12,
  },
  countryEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  countryPrefix: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 10,
    opacity: 0.6,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.6,
  },
  spacer: {
    flex: 1,
  },
  ctaContainer: {
    marginTop: 'auto',
  },
  button: {
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.6,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
  langText: {
    fontWeight: '700',
    fontSize: 10,
  },
  logoTextHighlight: {
    fontWeight: '800',
  },
});
