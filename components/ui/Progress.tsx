import { colors, radius } from '@/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppText } from './AppText';

type RingProps = {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  value?: string;
};

export function ProgressRing({
  progress,
  size = 88,
  stroke = 8,
  color = colors.primary,
  trackColor = colors.surfaceMedium,
  label,
  value,
}: RingProps) {
  const radiusSvg = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radiusSvg;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusSvg}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusSvg}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        {value ? <AppText variant="label">{value}</AppText> : null}
        {label ? (
          <AppText variant="caption" color={colors.textMuted} center>
            {label}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

type BarProps = {
  progress: number;
  color?: string;
  height?: number;
  trackColor?: string;
};

export function ProgressBar({
  progress,
  color = colors.primary,
  height = 8,
  trackColor = colors.surfaceMedium,
}: BarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: trackColor, borderRadius: radius.full },
      ]}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: radius.full,
        }}
      />
    </View>
  );
}

type MacroProps = {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
};

export function MacroProgress({
  label,
  current,
  target,
  unit = 'g',
  color,
}: MacroProps) {
  return (
    <View style={{ gap: 6 }}>
      <View style={styles.macroRow}>
        <AppText variant="label">{label}</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {current}
          {unit} / {target}
          {unit}
        </AppText>
      </View>
      <ProgressBar progress={target ? current / target : 0} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  track: { width: '100%', overflow: 'hidden' },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
