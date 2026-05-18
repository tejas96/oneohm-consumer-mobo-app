/**
 * Login Screen — Phone number input for OTP request
 *
 * Layer: app/auth/screens
 * Pattern: Uses useAppNavigation() hook, NOT prop-drilled navigation
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { Route, useAppNavigation } from '@/core/navigation';
import { useRequestOtp } from '@/data/resources/auth.resource';
import { ScreenWrapper } from '@/shared/components';
import { colors, fontSize, spacing } from '@/shared/theme';

export function LoginScreen() {
  const [phone, setPhone] = useState('');
  const navigation = useAppNavigation();
  const requestOtp = useRequestOtp();

  const handleRequestOtp = () => {
    if (phone.length < 10) {
      Toast.show({ type: 'error', text1: 'Invalid phone number' });
      return;
    }

    requestOtp.mutate(
      { phone },
      {
        onSuccess: () => {
          navigation.navigate(Route.OTP, { phone });
        },
        onError: error => {
          Toast.show({
            type: 'error',
            text1: error.message || 'Failed to send OTP',
          });
        },
      },
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to OneOhm</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to get started
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            mode="outlined"
            left={<TextInput.Affix text="+91" />}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleRequestOtp}
            loading={requestOtp.isPending}
            disabled={requestOtp.isPending || phone.length < 10}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Get OTP
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
