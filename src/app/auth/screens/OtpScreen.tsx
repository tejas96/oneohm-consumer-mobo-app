/**
 * OTP Screen — OTP input and verification
 *
 * Layer: app/auth/screens
 * Pattern: Uses useRoutes() hook for params, NOT prop-drilled route
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { useRoutes } from '@/core/navigation';
import type { AuthStackParamList } from '@/core/navigation';
import { Route } from '@/core/navigation';
import { useVerifyOtp } from '@/data/resources/auth.resource';
import { ScreenWrapper } from '@/shared/components';
import { colors, fontSize, spacing } from '@/shared/theme';

export function OtpScreen() {
  const { params } = useRoutes<Route.OTP>();
  const phone = (params as AuthStackParamList[Route.OTP])?.phone ?? '';
  const [otp, setOtp] = useState('');
  const verifyOtp = useVerifyOtp();

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      Toast.show({ type: 'error', text1: 'Please enter a valid OTP' });
      return;
    }

    verifyOtp.mutate(
      { phone, otp },
      {
        onError: error => {
          Toast.show({ type: 'error', text1: error.message || 'Invalid OTP' });
        },
        // onSuccess is handled inside the useVerifyOtp hook — it sets auth state.
        // Navigation will automatically switch to MainNavigator via RootNavigator.
      },
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to +91 {phone}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            mode="outlined"
            style={styles.input}
            autoFocus
          />

          <Button
            mode="contained"
            onPress={handleVerifyOtp}
            loading={verifyOtp.isPending}
            disabled={verifyOtp.isPending || otp.length < 4}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Verify & Login
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing['4xl'],
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  form: {
    gap: spacing.xl,
  },
  input: {
    backgroundColor: colors.surface.card,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});
