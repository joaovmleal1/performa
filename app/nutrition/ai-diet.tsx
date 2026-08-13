import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AIOrb } from '@/components/brand/PerformaLogo';
import { AppButton, AppText, Screen, ScreenHeader } from '@/components/ui';
import { useNutritionStore } from '@/stores/nutrition-store';
import { colors, radius, spacing } from '@/theme';

/** Tela Dieta com IA — intro */
export default function AiDietIntroScreen() {
  const router = useRouter();
  const resetInterview = useNutritionStore((s) => s.resetInterview);

  return (
    <Screen>
      <ScreenHeader title="Dieta com IA" showBack />
      <View style={styles.badge}>
        <AppText variant="caption" color={colors.secondary}>
          BETA
        </AppText>
      </View>

      <View style={styles.body}>
        <AIOrb size={140} />
        <AppText variant="h1" center style={{ marginTop: spacing['2xl'] }}>
          Uma dieta criada para a sua{' '}
          <AppText variant="h1" color={colors.primary}>
            rotina
          </AppText>
          .
        </AppText>
        <AppText
          variant="body"
          color={colors.textSecondary}
          center
          style={{ marginTop: spacing.md }}
        >
          Responda algumas perguntas e o PERFORMA IA criará um plano alimentar
          personalizado para você.
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppButton
          label="Criar minha dieta"
          variant="ai"
          onPress={() => {
            resetInterview();
            router.push('/nutrition/ai-interview');
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryMuted,
    marginBottom: spacing.md,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
});
