import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
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
  subtitle: string;
  image: string;
};

const slides: Slide[] = [
  {
    key: '1',
    title: 'Seu melhor\ncomeça agora',
    subtitle: 'Treino, nutrição e evolução no mesmo lugar.',
    image:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: '2',
    title: 'Treinos feitos\npara você',
    subtitle: 'Planos personalizados com progressão inteligente de cargas.',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: '3',
    title: 'Nutrição que\nacompanha sua rotina',
    subtitle: 'Refeições, macros e dieta com IA alinhadas ao seu objetivo.',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
  },
];

const PHONE_MAX = 430;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [index, setIndex] = useState(0);
  const [frameHeight, setFrameHeight] = useState(windowHeight);
  const listRef = useRef<FlatList<Slide>>(null);

  const frameWidth = Math.min(windowWidth, PHONE_MAX);
  const isLast = index === slides.length - 1;

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace('/(auth)/login');
  }, [completeOnboarding, router]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / Math.max(frameWidth, 1));
    if (next !== index && next >= 0 && next < slides.length) {
      setIndex(next);
    }
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
      <View
        style={[styles.phoneFrame, { width: frameWidth }]}
        onLayout={(e) => setFrameHeight(e.nativeEvent.layout.height)}
      >
        <FlatList
          ref={listRef}
          style={styles.list}
          data={slides}
          horizontal
          pagingEnabled
          bounces={false}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.key}
          getItemLayout={(_, i) => ({
            length: frameWidth,
            offset: frameWidth * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <View style={{ width: frameWidth, height: frameHeight }}>
              <ImageBackground
                source={{ uri: item.image }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={[
                    'rgba(18,18,23,0.35)',
                    'rgba(18,18,23,0.12)',
                    'rgba(18,18,23,0.78)',
                    colors.background,
                  ]}
                  locations={[0, 0.28, 0.58, 1]}
                  style={StyleSheet.absoluteFill}
                />
              </ImageBackground>

              <View
                style={[
                  styles.topBar,
                  { paddingTop: Math.max(insets.top, spacing.lg) },
                ]}
              >
                <View style={styles.brandRow}>
                  <PerformaMark size={28} />
                  <AppText variant="label" style={styles.brandWord}>
                    PERFORMA
                  </AppText>
                </View>
                <Pressable
                  onPress={finish}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Pular onboarding"
                  style={styles.skipBtn}
                >
                  <AppText variant="label" color={colors.textSecondary}>
                    Pular
                  </AppText>
                </Pressable>
              </View>

              <View
                style={[
                  styles.bottomContent,
                  {
                    paddingBottom:
                      Math.max(insets.bottom, spacing.lg) + 120,
                  },
                ]}
              >
                <AppText variant="display" style={styles.title}>
                  {item.title}
                </AppText>
                <AppText
                  variant="body"
                  color={colors.textSecondary}
                  style={styles.subtitle}
                >
                  {item.subtitle}
                </AppText>
              </View>
            </View>
          )}
        />

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, spacing.lg) },
          ]}
        >
          <ProgressDots total={slides.length} index={index} />
          <AppButton
            label={isLast ? 'Começar' : 'Próximo'}
            onPress={goNext}
            accessibilityLabel={isLast ? 'Começar' : 'Próximo slide'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          maxWidth: PHONE_MAX,
          maxHeight: 860,
          borderRadius: radius.xl,
          marginVertical: spacing.lg,
          boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
        } as object)
      : null),
  },
  list: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandWord: {
    letterSpacing: 1.6,
    color: colors.white,
  },
  skipBtn: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bottomContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
  },
  title: {
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: spacing.sm,
    maxWidth: 340,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    alignItems: 'center',
  },
});
