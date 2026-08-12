import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AIOrb } from '@/components/brand/PerformaLogo';
import { AppText, Screen } from '@/components/ui';
import { useNutritionStore } from '@/stores/nutrition-store';
import { colors, spacing } from '@/theme';

export default function AiGeneratingScreen() {
  const router = useRouter();
  const generateDietFromInterview = useNutritionStore((s) => s.generateDietFromInterview);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateDietFromInterview();
      router.replace('/nutrition/ai-result');
    }, 1800);
    return () => clearTimeout(timer);
  }, [generateDietFromInterview, router]);

  return (
    <Screen>
      <View style={styles.body}>
        <AIOrb size={120} />
        <AppText variant="h2" center style={{ marginTop: spacing['2xl'] }}>
          Gerando sua dieta…
        </AppText>
        <AppText variant="body" muted center style={{ marginTop: spacing.sm }}>
          Ajustando macros, refeições e preferências.
        </AppText>
        <ActivityIndicator color={colors.secondary} style={{ marginTop: spacing.xl }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
