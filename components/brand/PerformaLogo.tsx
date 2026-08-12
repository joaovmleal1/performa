import { colors, radius } from '@/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppText } from '../ui/AppText';

type Props = {
  size?: number;
  showWordmark?: boolean;
  animatedOpacity?: number;
};

export function PerformaMark({ size = 48 }: { size?: number }) {
  return (
    <View
      style={[
        styles.mark,
        { width: size, height: size, borderRadius: size * 0.28 },
      ]}
      accessibilityLabel="Logo PERFORMA"
    >
      <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 64 64">
        <Path
          d="M14 52V12h22.5c9.2 0 15.5 5.4 15.5 13.8 0 6.2-3.4 10.8-9 12.7L52 52H38.8L30.2 37.2H26V52H14zm12-26.2h9.4c3.8 0 6.1-2 6.1-5.1S39.2 16 35.4 16H26v9.8z"
          fill={colors.primary}
        />
      </Svg>
    </View>
  );
}

export function PerformaLogo({ size = 72, showWordmark = true }: Props) {
  return (
    <View style={styles.wrap}>
      <PerformaMark size={size} />
      {showWordmark ? (
        <View style={{ alignItems: 'center', gap: 4 }}>
          <AppText variant="h1" style={styles.wordmark}>
            PERFORMA
          </AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.tag}>
            TREINO • NUTRIÇÃO • RESULTADOS
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 16 },
  mark: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,255,133,0.25)',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  wordmark: {
    letterSpacing: 2,
  },
  tag: {
    letterSpacing: 1.2,
  },
});

export function AIOrb({ size = 120 }: { size?: number }) {
  return (
    <View style={[stylesOrb.wrap, { width: size, height: size }]}>
      <View
        style={[
          stylesOrb.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.secondary,
          },
        ]}
      />
      <View
        style={[
          stylesOrb.ringInner,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: (size * 0.72) / 2,
            borderColor: colors.primary,
          },
        ]}
      />
      <View
        style={[
          stylesOrb.core,
          {
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: radius.full,
          },
        ]}
      />
    </View>
  );
}

const stylesOrb = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    shadowColor: colors.secondary,
    shadowOpacity: 0.45,
    shadowRadius: 20,
  },
  ringInner: {
    position: 'absolute',
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  core: {
    backgroundColor: colors.white,
    opacity: 0.9,
  },
});
