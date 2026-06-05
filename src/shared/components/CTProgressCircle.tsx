import React, { useEffect } from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Path,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useFrameCallback,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const WAVE_COUNT = 12;
const WAVE_AMP = 4.5;
const WAVE_SPEED = 1.6;
const SVG_PADDING = 32;

/**
 * Builds a wavy OPEN ARC for exactly `progress`% of the circle.
 * Starts at the top (−π/2), sweeps clockwise.
 * No mask is used — only the progress portion is drawn, so there
 * is no box-frame clipping artefact at the 4 cardinal directions.
 */
function buildWavyArcPath(
  cx: number,
  cy: number,
  r: number,
  progress: number,
  phase: number,
): string {
  'worklet';
  if (progress <= 0) {
    return '';
  }
  const p = Math.min(100, Math.max(0, progress));
  const totalAngle = (p / 100) * 2 * Math.PI;
  const steps = Math.max(3, Math.round((240 * p) / 100));
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const angle = -Math.PI / 2 + (i / steps) * totalAngle;
    const currentR = r + WAVE_AMP * Math.sin(WAVE_COUNT * angle + phase);
    const x = (cx + currentR * Math.cos(angle)).toFixed(2);
    const y = (cy + currentR * Math.sin(angle)).toFixed(2);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d; // open arc — no 'Z'
}

import { useAppTheme } from '@/shared/theme';

export interface CTProgressCircleProps {
  /** The progress value between 0 and 100 */
  progress: number;
  /** Size (both width and height) of the visual circle. Defaults to 192 */
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
  /** Whether to render as a wavy/wibly progress circle */
  isWavy?: boolean;
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
  isWavy = false,
}: CTProgressCircleProps) {
  const theme = useAppTheme();

  // Padded canvas — wrapper = canvasSize, SVG = canvasSize, no negative offsets.
  // Android ignores overflow:'visible'; wrapper must equal the SVG canvas size.
  const canvasSize = size + SVG_PADDING;
  const center = canvasSize / 2;
  const radius = 42 * (size / 100);

  const clampedProgress = Math.max(0, Math.min(100, progress));

  // For non-wavy mode only
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (clampedProgress / 100) * circumference;

  const resolvedTrackColor = trackColor || theme.colors.circularProgressBg;
  const resolvedGradientColors = gradientColors || [
    theme.colors.brandSuccess,
    theme.colors.brandBlue,
  ];

  // ─── Wavy animation ──────────────────────────────────────────────────────────
  // Share progress with UI thread so the worklet can read it
  const progressShared = useSharedValue(clampedProgress);
  useEffect(() => {
    progressShared.value = clampedProgress;
  }, [clampedProgress, progressShared]);

  const phase = useSharedValue(0);
  useFrameCallback(info => {
    if (!isWavy) {
      return;
    }
    const dt = (info.timeSincePreviousFrame ?? 16) / 1000;
    phase.value = phase.value + WAVE_SPEED * dt;
  });

  const animatedPathProps = useAnimatedProps(() => {
    if (!isWavy) {
      return { d: '' };
    }
    return {
      d: buildWavyArcPath(
        center,
        center,
        radius,
        progressShared.value,
        phase.value,
      ),
    };
  });

  return (
    // Wrapper is canvasSize × canvasSize — same as SVG canvas.
    // Android clips Views to their own bounds (overflow:'visible' is ignored),
    // so the wrapper must NOT be smaller than the SVG.
    <View
      style={[
        styles.container,
        { width: canvasSize, height: canvasSize },
        style,
      ]}
    >
      <Svg width={canvasSize} height={canvasSize} style={styles.svg}>
        <Defs>
          {resolvedGradientColors && resolvedGradientColors.length > 0 && (
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
          )}
        </Defs>

        {/* Base Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={resolvedTrackColor}
          strokeWidth={trackWidth}
          fill="transparent"
        />

        {/* Active Ring */}
        {isWavy ? (
          /*
            Wavy arc — draws ONLY the progress portion as an open arc.
            No mask needed → no box-frame clipping at cardinal directions.
          */
          <AnimatedPath
            animatedProps={animatedPathProps}
            stroke={
              resolvedGradientColors && resolvedGradientColors.length > 0
                ? 'url(#progressCircleGrad)'
                : theme.colors.primary
            }
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <Circle
            cx={center}
            cy={center}
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
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </Svg>

      {/*
        Children inset by SVG_PADDING/2 on each side so they sit perfectly
        over the visual circle (not over the transparent padding zone).
      */}
      {children && (
        <View
          style={[
            styles.centerLabels,
            {
              top: SVG_PADDING / 2,
              left: SVG_PADDING / 2,
              right: SVG_PADDING / 2,
              bottom: SVG_PADDING / 2,
            },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    // No overflow property — SVG and wrapper are the same canvasSize
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  centerLabels: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});
