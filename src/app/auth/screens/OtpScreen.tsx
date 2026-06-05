/**
 * OTP Screen — OTP input and verification
 *
 * Layer: app/auth/screens
 */

import React, { useRef } from 'react';
import { StyleSheet, View, TextInput as RNTextInput } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { ScreenWrapper, CTButton } from '@/shared/components';
import { useAppTheme } from '@/shared/theme';
import { useOtpScreenLogic } from '../hooks/useOtpScreenLogic';

export function OtpScreen() {
  const {
    phone,
    otp,
    setOtp,
    timer,
    isPending,
    handleVerifyOtp,
    handleResendOtp,
    handleGoBack,
    formatTimer,
    isInputFocused,
    setIsInputFocused,
    t,
  } = useOtpScreenLogic();
  const theme = useAppTheme();
  const inputRef = useRef<RNTextInput>(null);

  const renderOtpBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 6; i++) {
      const char = otp[i] || '';
      const isFocused = isInputFocused && otp.length === i;
      const isFilled = otp.length > i;

      boxes.push(
        <View
          key={i}
          style={[
            styles.otpBox,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: isFocused
                ? theme.colors.primary
                : isFilled
                ? theme.colors.primary
                : theme.colors.outlineVariant,
            },
          ]}
        >
          <Text style={[styles.otpText, { color: theme.colors.onBackground }]}>
            {char || (isFocused ? '' : '·')}
          </Text>
        </View>,
      );
    }
    return boxes;
  };

  return (
    <ScreenWrapper
      ambientGlow
      padded={false}
      showThemeToggle={false}
      keyboardAvoiding={true}
    >
      <View style={styles.content}>
        {/* Back Button */}
        <IconButton
          icon="chevron-left"
          size={20}
          iconColor={theme.colors.onBackground}
          rippleColor="transparent"
          onPress={handleGoBack}
          style={[
            styles.backButton,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        />

        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            {t('auth.verifyOtpTitle')}
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('auth.verifyOtpSubtitle')}{' '}
            <Text
              style={[
                styles.phoneHighlight,
                { color: theme.colors.onBackground },
              ]}
            >
              {phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
            </Text>
          </Text>
        </View>

        {/* OTP Input Grid */}
        <View style={styles.otpContainer}>
          <View style={styles.otpRow}>{renderOtpBoxes()}</View>
          <RNTextInput
            ref={inputRef}
            value={otp}
            onChangeText={text => setOtp(text.replace(/\D/g, ''))}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            caretHidden
            autoFocus
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            underlineColorAndroid="transparent"
            importantForAutofill="yes"
            selectionColor="transparent"
          />
        </View>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text
            style={[
              styles.resendText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('auth.didNotReceive')}{' '}
            {timer > 0 ? (
              <Text
                style={[styles.resendTimer, { color: theme.colors.primary }]}
              >
                {t('auth.resendIn').replace('{time}', formatTimer(timer))}
              </Text>
            ) : (
              <Text
                onPress={handleResendOtp}
                style={[styles.resendLink, { color: theme.colors.primary }]}
              >
                {t('auth.resendCode')}
              </Text>
            )}
          </Text>
        </View>

        {/* Auto-detect badge */}
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          <View
            style={[styles.badgeDot, { backgroundColor: theme.colors.primary }]}
          />
          <Text
            style={[styles.badgeText, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('auth.autoDetecting')}
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <CTButton
            variant="primary"
            size="lg"
            onPress={handleVerifyOtp}
            disabled={isPending}
            loading={isPending}
            style={[styles.button, { shadowColor: theme.colors.primary }]}
          >
            {t('auth.verifyAndContinue')}
          </CTButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 64,
    paddingBottom: 32,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  headingContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otpBox: {
    width: 44,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpText: {
    fontSize: 22,
    fontWeight: '700',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0.01,
    color: 'transparent',
    backgroundColor: 'transparent',
    fontSize: 1,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    opacity: 0.8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  spacer: {
    flex: 1,
  },
  ctaContainer: {
    marginTop: 'auto',
  },
  button: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
  phoneHighlight: {
    fontWeight: '500',
  },
  resendTimer: {
    fontWeight: '600',
  },
  resendLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
