import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { ScreenWrapper, CTAppBar } from '@/shared/components';
import { spacing, fontSize, useAppTheme } from '@/shared/theme';

export function SupportScreen() {
  const navigation = useNavigation();
  const theme = useAppTheme();

  return (
    <ScreenWrapper>
      <CTAppBar title="Support & Contact" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Support Screen
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Under Construction
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
});
