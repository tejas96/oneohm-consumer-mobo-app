/**
 * TimelineDot — Custom presentational milestone state dot indicator
 *
 * Layer: app/payments/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/shared/theme';

export interface TimelineDotProps {
  status: 'PAID' | 'PARTIAL' | 'DUE' | 'APPROVED' | 'CREDITED' | 'LOCKED';
}

const RING_SIZE = 18;
const RING_RADIUS = RING_SIZE / 2;
const SOLID_SIZE = 10;
const SOLID_RADIUS = SOLID_SIZE / 2;

export function TimelineDot({ status }: TimelineDotProps) {
  const theme = useAppTheme();

  let dotColor = theme.colors.outlineVariant;
  let ringColor = 'transparent';

  if (status === 'PAID' || status === 'CREDITED') {
    dotColor = theme.colors.brandSuccess || theme.colors.primary;
    ringColor = theme.colors.brandSuccessIconBg;
  } else if (status === 'PARTIAL' || status === 'DUE') {
    dotColor = theme.colors.warningText;
    ringColor = theme.colors.warningBg;
  } else if (status === 'APPROVED') {
    dotColor = theme.colors.secondary;
    ringColor = theme.colors.infoBgChip;
  }

  const hasRing = ringColor !== 'transparent';

  return (
    <View style={styles.dotContainer}>
      {hasRing ? (
        <View style={[styles.dotRing, { backgroundColor: ringColor }]}>
          <View style={[styles.dotSolid, { backgroundColor: dotColor }]} />
        </View>
      ) : (
        <View
          style={[
            styles.dotLocked,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dotContainer: {
    width: 24,
    alignItems: 'center',
    position: 'absolute',
    left: 17,
    top: 20,
    zIndex: 10,
  },
  dotRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotSolid: {
    width: SOLID_SIZE,
    height: SOLID_SIZE,
    borderRadius: SOLID_RADIUS,
  },
  dotLocked: {
    width: SOLID_SIZE,
    height: SOLID_SIZE,
    borderRadius: SOLID_RADIUS,
    borderWidth: 2,
  },
});
