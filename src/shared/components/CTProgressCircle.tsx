import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { useAppTheme } from '@/shared/theme';

export interface CTProgressCircleProps {
  /** The progress value between 0 and 100 */
  progress: number;
  /** Size (both width and height) of the progress circle. Defaults to 192 */
  size?: number;
  /** Stroke width of the active progress ring. Defaults to 10 */
  strokeWidth?: number;
  /** Stroke width of the base track ring. Defaults to 6 */
  trackWidth?: number;
  /** Gradient colors for the active progress ring. Defaults to ['#76c044', '#0d74b8'] */
  gradientColors?: string[];
  /** Custom background color for the base track circle. Defaults to theme.colors.circularProgressBg */
  trackColor?: string;
  /** Content to render centered inside the progress circle */
  children?: React.ReactNode;
  /** Custom stylesheet container overrides */
  style?: ViewStyle;
}

export function CTProgressCircle({
  progress,
  size = 192,
  strokeWidth = 10,
  trackWidth = 6,
  gradientColors,
  trackColor,
  children,
  style,
}: CTProgressCircleProps) {
  const theme = useAppTheme();

  // Compute radius based on the modular size proportions
  const radius = 42 * (size / 100);
  const circumference = 2 * Math.PI * radius;

  // Clamp progress value between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const strokeDashoffset =
    circumference - (clampedProgress / 100) * circumference;

  const resolvedTrackColor = trackColor || theme.colors.circularProgressBg;
  const resolvedGradientColors = gradientColors || [
    theme.colors.brandSuccess,
    theme.colors.brandBlue,
  ];

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        {resolvedGradientColors && resolvedGradientColors.length > 0 && (
          <Defs>
            <LinearGradient
              id="progressCircleGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              {resolvedGradientColors.map((color, idx) => {
                const offset =
                  resolvedGradientColors.length > 1
                    ? (idx / (resolvedGradientColors.length - 1)) * 100
                    : 0;
                return (
                  <Stop
                    key={`${color}-${idx}`}
                    offset={`${offset}%`}
                    stopColor={color}
                  />
                );
              })}
            </LinearGradient>
          </Defs>
        )}

        {/* Base Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={resolvedTrackColor}
          strokeWidth={trackWidth}
          fill="transparent"
        />

        {/* Active Ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={
            resolvedGradientColors && resolvedGradientColors.length > 0
              ? 'url(#progressCircleGrad)'
              : theme.colors.primary
          }
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Centered Children Container */}
      {children && <View style={styles.centerLabels}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerLabels: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});
