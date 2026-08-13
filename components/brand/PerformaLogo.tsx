import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { colors, gradients, radius } from '@/theme';

type Props = {
  size?: number;
  showWordmark?: boolean;
  showTagline?: boolean;
};

/** Símbolo oficial “P” do manual PERFORMA. */
export function PerformaMark({ size = 48 }: { size?: number }) {
  return (
    <View
      style={[
        styles.mark,
        {
          width: size,
          height: size,
        },
      ]}
      accessibilityLabel="Símbolo PERFORMA"
    >
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Path
          d="M6 8h33.5L52 20.5l-4.5 14L26 56H15V43l12-12H16L6 21h27l3-3H16z"
          fill={colors.primary}
        />
      </Svg>
    </View>
  );
}

export function PerformaLogo({
  size = 72,
  showWordmark = true,
  showTagline = true,
}: Props) {
  return (
    <View style={styles.wrap}>
      <PerformaMark size={size} />
      {showWordmark ? (
        <View style={styles.wordWrap}>
          <AppText variant="h1" style={styles.wordmark}>
            PERFORMA
          </AppText>
          {showTagline ? (
            <AppText variant="caption" color={colors.primary} style={styles.tag}>
              TREINO • NUTRIÇÃO • RESULTADOS
            </AppText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** Orb / aura para superfícies de Inteligência (Coach / Dieta IA) */
export function AIOrb({ size = 120 }: { size?: number }) {
  return (
    <View style={[stylesOrb.wrap, { width: size, height: size }]}>
      <LinearGradient
        colors={[...gradients.purpleGlow]}
        style={[
          stylesOrb.glow,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
      <View
        style={[
          stylesOrb.ring,
          {
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: (size * 0.78) / 2,
            borderColor: colors.secondary,
          },
        ]}
      />
      <View
        style={[
          stylesOrb.ringInner,
          {
            width: size * 0.52,
            height: size * 0.52,
            borderRadius: (size * 0.52) / 2,
            borderColor: colors.info,
          },
        ]}
      />
      <View
        style={[
          stylesOrb.core,
          {
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: radius.full,
            backgroundColor: colors.white,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 16 },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordWrap: { alignItems: 'center', gap: 6 },
  wordmark: {
    letterSpacing: 2.6,
    fontStyle: 'italic',
    color: colors.white,
  },
  tag: {
    letterSpacing: 1.4,
    fontFamily: 'Sora_500Medium',
  },
});

const stylesOrb = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute' },
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  ringInner: {
    position: 'absolute',
    borderWidth: 2,
  },
  core: {
    opacity: 0.95,
  },
});
