import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AIOrb } from '@/components/brand/PerformaLogo';
import { AppButton, AppText, Screen } from '@/components/ui';
import { useNutritionStore } from '@/stores/nutrition-store';
import { spacing } from '@/theme';

export default function AiDietIntroScreen() {
  const router = useRouter();
  const resetInterview = useNutritionStore((s) => s.resetInterview);

  return (
    <Screen>
      <View style={styles.body}>
        <AIOrb size={140} />
        <AppText variant="h1" center style={{ marginTop: spacing['2xl'] }}>
          Dieta com PERFORMA AI
        </AppText>
        <AppText variant="body" muted center style={{ marginTop: spacing.md }}>
          Responda algumas perguntas rápidas e receba um plano alimentar alinhado
          ao seu objetivo, rotina e preferências.
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppButton
          label="Começar entrevista"
          variant="ai"
          onPress={() => {
            resetInterview();
            router.push('/nutrition/ai-interview');
          }}
        />
        <AppButton label="Voltar" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
});
