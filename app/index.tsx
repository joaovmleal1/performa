import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PerformaLogo } from '@/components/brand/PerformaLogo';
import { useAuthStore } from '@/stores/auth-store';
import { colors } from '@/theme';
import { duration } from '@/theme/motion';

export default function SplashGateScreen() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasSeenOnboarding = useAuthStore((s) => s.hasSeenOnboarding);
  const hasCompletedEvaluation = useAuthStore((s) => s.hasCompletedEvaluation);
  const [ready, setReady] = useState(false);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: duration.slow });
    const timer = setTimeout(() => setReady(true), duration.splash);
    return () => clearTimeout(timer);
  }, [opacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isHydrated || !ready) {
    return (
      <View style={styles.splash}>
        <Animated.View style={logoStyle}>
          <PerformaLogo size={88} />
        </Animated.View>
      </View>
    );
  }

  if (!hasSeenOnboarding) return <Redirect href="/(auth)/onboarding" />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!hasCompletedEvaluation) return <Redirect href="/(evaluation)" />;
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
