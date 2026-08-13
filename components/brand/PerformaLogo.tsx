import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  G,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { colors, gradients, radius } from '@/theme';

type Props = {
  size?: number;
  showWordmark?: boolean;
  showTagline?: boolean;
};

/** Símbolo oficial 3D enviado pela marca PERFORMA. */
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
      <Svg width={size} height={size} viewBox="0 0 1024 1024">
        <Defs>
          <SvgLinearGradient id="main" x1="180" y1="180" x2="850" y2="680">
            <Stop offset="0" stopColor="#00F2C3" />
            <Stop offset="0.52" stopColor="#00F58A" />
            <Stop offset="1" stopColor="#00E969" />
          </SvgLinearGradient>
          <SvgLinearGradient id="fold" x1="265" y1="625" x2="520" y2="760">
            <Stop offset="0" stopColor="#53FFB4" />
            <Stop offset="0.48" stopColor="#00EFA0" />
            <Stop offset="1" stopColor="#00C97A" />
          </SvgLinearGradient>
        </Defs>
        <G>
          <Path
            d="M214 187h490c27 0 48 13 63 36l96 143c11 17 11 37-1 54L708 613c-12 15-29 22-48 22H550L392 839c-10 13-29 12-38-2L251 674c-9-14-9-30 1-44l103-140c11-15 27-22 45-22h174c14 0 25-5 33-17l21-31c6-9 6-18-1-27l-23-29c-8-9-18-13-30-13H303c-15 0-26-6-34-19l-70-116c-9-15 0-29 15-29Z"
            fill="url(#main)"
            stroke="#7CFFD0"
            strokeWidth={3}
          />
          <Path
            d="M252 630c10-14 25-22 44-22h270L392 839c-10 13-29 12-38-2L251 674c-9-14-9-30 1-44Z"
            fill="url(#fold)"
            opacity={0.9}
          />
          <Path
            d="M214 189h490c27 0 48 13 63 36"
            fill="none"
            stroke="#B8FFE1"
            strokeOpacity={0.55}
            strokeWidth={4}
          />
        </G>
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
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
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
