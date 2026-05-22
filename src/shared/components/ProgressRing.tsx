/**
 * ProgressRing — Premium Circular SVG Progress Ring
 *
 * Layer: shared/components (Presentational Component)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';
import { Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import { useAppTheme } from '@/shared/theme';
import { fontSize, fontWeight } from '@/shared/theme';

export interface ProgressRingProps {
  progress: number;
  color: string;
}

const RING_SIZE = 56;
const RADIUS = 20;
const STROKE_WIDTH = 3;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER_COORD = RING_SIZE / 2;

export function ProgressRing({ progress, color }: ProgressRingProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const clampedProgress = Math.max(0, Math.min(100, progress));
  const strokeDashoffset =
    CIRCUMFERENCE - (clampedProgress / 100) * CIRCUMFERENCE;

  return (
    <View style={styles.ringContainer}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ringSvg}>
        {/* Base Track */}
        <Circle
          cx={CENTER_COORD}
          cy={CENTER_COORD}
          r={RADIUS}
          fill="transparent"
          stroke={theme.colors.circularProgressBg}
          strokeWidth={STROKE_WIDTH}
        />
        {/* Active Progress */}
        <Circle
          cx={CENTER_COORD}
          cy={CENTER_COORD}
          r={RADIUS}
          fill="transparent"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${CENTER_COORD} ${CENTER_COORD})`}
        />
      </Svg>
      <View style={styles.ringLabelGroup}>
        <Text style={[styles.ringPercent, { color }]} numberOfLines={1}>
          {clampedProgress}%
        </Text>
        <Text
          style={[styles.ringSub, { color: theme.colors.onSurfaceVariant }]}
          numberOfLines={1}
        >
          {t('projectSwitcher.done')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringSvg: {
    position: 'absolute',
  },
  ringLabelGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  ringPercent: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: 14,
  },
  ringSub: {
    fontSize: fontSize.micro,
    lineHeight: 10,
    opacity: 0.6,
  },
});
