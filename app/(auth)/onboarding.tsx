import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PerformaMark } from '@/components/brand/PerformaLogo';
import { AppButton, AppText, ProgressDots } from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';
import { colors, radius, spacing } from '@/theme';

type Slide = {
  key: string;
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
};

const slides: Slide[] = [
  {
    key: '1',
    title: 'Seu ',
    highlight: 'melhor',
    subtitle: ' começa agora',
    image:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: '2',
    title: 'Treinos feitos ',
    highlight: 'para você',
    subtitle: '',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: '3',
    title: 'Nutrição que acompanha ',
    highlight: 'sua rotina',
    subtitle: '',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
  },
];

/** Telas 02–04 — Onboarding com highlight verde + fotografia full-bleed */
export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);
  const isLast = index === slides.length - 1;

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace('/(auth)/login');
  }, [completeOnboarding, router]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / Math.max(width, 1));
    if (next !== index && next >= 0 && next < slides.length) setIndex(next);
  };

  const goNext = () => {
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <View style={styles.screen}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.key}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View style={{ width, flex: 1 }}>
            <ImageBackground source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover">
              <LinearGradient
                colors={['rgba(8,11,16,0.45)', 'rgba(8,11,16,0.15)', 'rgba(8,11,16,0.55)', colors.background]}
                locations={[0, 0.35, 0.62, 1]}
                style={StyleSheet.absoluteFill}
              />
            </ImageBackground>

            <View style={[styles.topBar, { paddingTop: Math.max(insets.top, spacing.lg) }]}>
              <View style={styles.brandRow}>
                <PerformaMark size={26} />
                <AppText variant="label" style={styles.brandWord}>
                  PERFORMA
                </AppText>
              </View>
              <Pressable onPress={finish} hitSlop={12} style={styles.skipBtn}>
                <AppText variant="label" color={colors.textSecondary}>
                  Pular
                </AppText>
              </Pressable>
            </View>

            <View
              style={[
                styles.copy,
                { paddingBottom: Math.max(insets.bottom, spacing.lg) + 140 },
              ]}
            >
              <AppText variant="display">
                {item.title}
                <AppText variant="display" color={colors.primary}>
                  {item.highlight}
                </AppText>
                {item.subtitle}
              </AppText>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <ProgressDots total={slides.length} index={index} />
        {isLast ? (
          <AppButton label="Começar" onPress={goNext} />
        ) : (
          <Pressable
            onPress={goNext}
            style={styles.roundCta}
            accessibilityRole="button"
            accessibilityLabel="Próximo"
          >
            <ArrowRight size={24} color={colors.onPrimary} strokeWidth={2.4} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandWord: { letterSpacing: 1.6, color: colors.white },
  skipBtn: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  copy: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing['2xl'],
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    paddingHorizontal: spacing['2xl'],
    gap: spacing.lg,
    alignItems: 'center',
  },
  roundCta: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
});
