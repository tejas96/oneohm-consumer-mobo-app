import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
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
import LottieView from 'lottie-react-native';

import { useTranslation } from '@/core/i18n';
import type { Project } from '@/data/types';
import {
  spacing,
  fontSize,
  lineHeight,
  fontWeight,
  useAppTheme,
} from '@/shared/theme';
import { CTChip } from '@/shared/components';

// ─── Animated SVG path (Reanimated driven) ─────────────────────────────────────
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ProgressWidgetProps {
  activeProject: Project;
}

const SUSTAINABILITY_LOTTIE = require('@/assets/animations/lottie/slide4_payments.json');

// ─── Wave constants ─────────────────────────────────────────────────────────────
const WAVE_COUNT = 12; // full oscillations around the ring
const WAVE_AMP = 4.5; // radial deviation in pixels per crest
const WAVE_SPEED = 1.6; // phase radians advanced per second

// ─── Layout constants ───────────────────────────────────────────────────────────
// The SVG canvas is padded so wave crests never touch the canvas edge.
// Android ignores overflow:'visible' on Views — the wrapper must be at least
// as large as the SVG canvas to avoid clipping.
//
//   Max stroke reach = RADIUS + WAVE_AMP + STROKE_W/2 = 84 + 4.5 + 4.5 = 93 px
//   Canvas half      = PADDED_SIZE / 2                = 252 / 2         = 126 px
//   Safety margin    = 126 − 93                                         = 33 px ✓
const VISIBLE_SIZE = 220;
const SVG_PADDING = 32;
const PADDED_SIZE = VISIBLE_SIZE + SVG_PADDING; // 252
const STROKE_W = 9;
const TRACK_W = 6;
const RADIUS = 84;
const CX = PADDED_SIZE / 2; // 126
const CY = PADDED_SIZE / 2; // 126

/**
 * Builds a wavy OPEN ARC for exactly `progress`% of the circle.
 *
 *   r(θ) = RADIUS + WAVE_AMP · sin(WAVE_COUNT · θ + φ)
 *
 * Starts at the top (−π/2) and sweeps clockwise.
 * Drawing only the arc portion means NO MASK IS NEEDED — there is
 * nothing to clip, and the box-frame artefact disappears completely.
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
  // Scale step count with arc length — minimum 3 steps for tiny arcs
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

export function ProgressWidget({ activeProject }: ProgressWidgetProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const isCompleted = activeProject.status === 'COMPLETED';
  const progressValue = isCompleted ? 100 : activeProject.progress;
  const capacity = activeProject.capacity || 5;
  const statusLabel = isCompleted
    ? t('dashboard.gridActive')
    : t('dashboard.inProgress');

  // ─── Share progress with UI thread so the worklet can read it ────────────────
  const progressShared = useSharedValue(progressValue);
  useEffect(() => {
    progressShared.value = progressValue;
  }, [progressValue, progressShared]);

  // ─── Phase animation (Reanimated UI thread) ───────────────────────────────────
  const phase = useSharedValue(0);
  useFrameCallback(info => {
    const dt = (info.timeSincePreviousFrame ?? 16) / 1000;
    phase.value = phase.value + WAVE_SPEED * dt;
  });

  // ─── Animated arc path — no mask, draws only the progress portion ─────────────
  const animatedPathProps = useAnimatedProps(() => ({
    d: buildWavyArcPath(CX, CY, RADIUS, progressShared.value, phase.value),
  }));

  return (
    <View style={styles.container}>
      {/*
        Wrapper is PADDED_SIZE × PADDED_SIZE (= SVG canvas size).
        Android clips Views to their bounds regardless of overflow:'visible',
        so the wrapper must be exactly as large as the SVG — no negative offsets.
      */}
      <View
        style={[
          styles.circleWrapper,
          { width: PADDED_SIZE, height: PADDED_SIZE },
        ]}
      >
        {/* Lottie watermark — clipped to inner circle */}
        <View style={styles.waveContainer} pointerEvents="none">
          <LottieView
            source={SUSTAINABILITY_LOTTIE}
            autoPlay
            loop
            style={styles.waveLottie}
          />
        </View>

        {/* SVG fills the wrapper exactly — top:0, left:0, no negative offsets */}
        <Svg width={PADDED_SIZE} height={PADDED_SIZE} style={styles.svg}>
          <Defs>
            <LinearGradient
              id="solarOrbitGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={theme.colors.brandSuccess} />
              <Stop offset="50%" stopColor={theme.colors.primary} />
              <Stop offset="100%" stopColor={theme.colors.warningAccent} />
            </LinearGradient>
          </Defs>

          {/* 1. Full-ring grey base track */}
          <Circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            stroke={theme.colors.circularProgressBg}
            strokeWidth={TRACK_W}
            fill="transparent"
          />

          {/*
            2. Wavy progress arc.
            No mask — only the progress portion is drawn as an open arc.
            strokeLinecap="round" gives naturally rounded ends at 0% and progress%.
          */}
          <AnimatedPath
            animatedProps={animatedPathProps}
            stroke="url(#solarOrbitGrad)"
            strokeWidth={STROKE_W}
            fill="transparent"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>

        {/*
          Center labels inset by SVG_PADDING/2 on each side so they sit
          perfectly over the visual circle (not over the transparent padding zone).
        */}
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
          pointerEvents="none"
        >
          <Text
            style={[
              styles.systemSize,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('dashboard.systemSize').replace('{size}', `${capacity} kW`)}
          </Text>
          <Text style={[styles.percentage, { color: theme.colors.onSurface }]}>
            {progressValue}%
          </Text>
          <CTChip
            status={isCompleted ? 'success' : 'warning'}
            size="sm"
            style={styles.chip}
          >
            {statusLabel}
          </CTChip>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    // No overflow needed — SVG and wrapper are exactly the same PADDED_SIZE
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  waveContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    zIndex: 1,
    opacity: 0.15,
  },
  waveLottie: {
    width: '180%',
    height: '180%',
  },
  centerLabels: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 20,
  },
  systemSize: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.7,
  },
  percentage: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.display,
    marginVertical: spacing.micro,
    letterSpacing: -1.5,
  },
  chip: {
    marginTop: spacing.micro,
    alignSelf: 'center',
  },
});
