import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Chip,
  Input,
  NumberStepper,
  RadioGroup,
  Screen,
  ScreenProgress,
} from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';
import {
  EVALUATION_TOTAL_STEPS,
  useEvaluationStore,
} from '@/stores/evaluation-store';
import type {
  ExperienceLevel,
  PrimaryGoal,
  SessionDuration,
  Sex,
  TrainingEnvironment,
} from '@/types';
import { colors, spacing } from '@/theme';

const MEDICAL_DISCLAIMER =
  'O PERFORMA oferece sugestões de treino e nutrição. Consulte um profissional de saúde antes de iniciar ou alterar sua rotina, especialmente em caso de lesões, gravidez ou condições clínicas.';

export default function EvaluationScreen() {
  const router = useRouter();
  const step = useEvaluationStore((s) => s.step);
  const answers = useEvaluationStore((s) => s.answers);
  const next = useEvaluationStore((s) => s.next);
  const back = useEvaluationStore((s) => s.back);
  const patch = useEvaluationStore((s) => s.patch);
  const reset = useEvaluationStore((s) => s.reset);
  const completeEvaluation = useAuthStore((s) => s.completeEvaluation);
  const [restrictionsText, setRestrictionsText] = useState('');

  useEffect(() => {
    if (step === 1 && answers.age == null) patch({ age: 28 });
    if (step === 2 && answers.heightCm == null) patch({ heightCm: 168 });
    if (step === 3 && answers.weightKg == null) patch({ weightKg: 72 });
  }, [step, answers.age, answers.heightCm, answers.weightKg, patch]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return !!answers.sex;
      case 1:
        return !!answers.age && answers.age >= 14 && answers.age <= 90;
      case 2:
        return !!answers.heightCm && answers.heightCm >= 120;
      case 3:
        return !!answers.weightKg && answers.weightKg >= 35;
      case 4:
        return !!answers.goal;
      case 5:
        return !!answers.experience;
      case 6:
        return !!answers.trainingDaysPerWeek;
      case 7:
        return !!answers.environment && !!answers.sessionDurationMin;
      default:
        return false;
    }
  }, [answers, step]);

  const handleNext = () => {
    if (step < EVALUATION_TOTAL_STEPS - 1) {
      next();
      return;
    }

    const restrictions = restrictionsText
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);

    completeEvaluation({
      sex: answers.sex as Sex,
      age: answers.age!,
      heightCm: answers.heightCm!,
      weightKg: answers.weightKg!,
      goal: answers.goal as PrimaryGoal,
      experience: answers.experience as ExperienceLevel,
      trainingDaysPerWeek: answers.trainingDaysPerWeek!,
      environment: answers.environment as TrainingEnvironment,
      sessionDurationMin: answers.sessionDurationMin as SessionDuration,
      restrictions,
    });
    reset();
    router.replace('/(tabs)');
  };

  return (
    <Screen contentStyle={styles.screen}>
      <ScreenProgress current={step} total={EVALUATION_TOTAL_STEPS} />
      <View style={styles.body}>
        {renderStep(step, answers, patch, restrictionsText, setRestrictionsText)}
      </View>
      <View style={styles.footer}>
        {step > 0 ? (
          <AppButton label="Voltar" variant="ghost" onPress={back} />
        ) : null}
        <AppButton
          label={step === EVALUATION_TOTAL_STEPS - 1 ? 'Finalizar' : 'Próximo'}
          disabled={!canContinue}
          onPress={handleNext}
        />
      </View>
    </Screen>
  );
}

function renderStep(
  step: number,
  answers: ReturnType<typeof useEvaluationStore.getState>['answers'],
  patch: ReturnType<typeof useEvaluationStore.getState>['patch'],
  restrictionsText: string,
  setRestrictionsText: (value: string) => void,
) {
  switch (step) {
    case 0:
      return (
        <Question title="Qual é o seu sexo?">
          <RadioGroup
            value={answers.sex}
            onChange={(value) => patch({ sex: value as Sex })}
            options={[
              { value: 'female', label: 'Feminino' },
              { value: 'male', label: 'Masculino' },
              { value: 'other', label: 'Outro' },
              { value: 'prefer_not', label: 'Prefiro não informar' },
            ]}
          />
        </Question>
      );
    case 1:
      return (
        <Question title="Qual é a sua idade?">
          <NumberStepper
            value={answers.age ?? 28}
            min={14}
            max={90}
            onChange={(age) => patch({ age })}
          />
        </Question>
      );
    case 2:
      return (
        <Question title="Qual é a sua altura?">
          <NumberStepper
            value={answers.heightCm ?? 168}
            min={120}
            max={230}
            suffix="cm"
            onChange={(heightCm) => patch({ heightCm })}
          />
        </Question>
      );
    case 3:
      return (
        <Question title="Qual é o seu peso atual?">
          <NumberStepper
            value={answers.weightKg ?? 72}
            min={35}
            max={250}
            suffix="kg"
            onChange={(weightKg) => patch({ weightKg })}
          />
        </Question>
      );
    case 4:
      return (
        <Question title="Qual é o seu objetivo principal?">
          <RadioGroup
            value={answers.goal}
            onChange={(value) => patch({ goal: value as PrimaryGoal })}
            options={[
              { value: 'lose_fat', label: 'Perder gordura' },
              { value: 'gain_muscle', label: 'Ganhar massa muscular' },
              { value: 'definition', label: 'Definição muscular' },
              { value: 'conditioning', label: 'Melhorar condicionamento' },
              { value: 'maintain', label: 'Manter peso' },
              { value: 'health', label: 'Saúde e bem-estar' },
            ]}
          />
        </Question>
      );
    case 5:
      return (
        <Question title="Qual é o seu nível de experiência?">
          <RadioGroup
            value={answers.experience}
            onChange={(value) => patch({ experience: value as ExperienceLevel })}
            options={[
              {
                value: 'beginner',
                label: 'Iniciante',
                description: 'Menos de 6 meses consistentes',
              },
              {
                value: 'intermediate',
                label: 'Intermediário',
                description: '6 meses a 2 anos',
              },
              {
                value: 'advanced',
                label: 'Avançado',
                description: 'Mais de 2 anos',
              },
            ]}
          />
        </Question>
      );
    case 6:
      return (
        <Question title="Quantos dias por semana você pode treinar?">
          <View style={styles.chips}>
            {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
              <Chip
                key={day}
                label={String(day)}
                selected={answers.trainingDaysPerWeek === day}
                onPress={() => patch({ trainingDaysPerWeek: day })}
              />
            ))}
          </View>
        </Question>
      );
    case 7:
      return (
        <Question
          title="Onde e por quanto tempo você treina?"
          subtitle="Conte também limitações ou exercícios que prefere evitar."
        >
          <AppText variant="label" muted>
            Ambiente
          </AppText>
          <RadioGroup
            value={answers.environment}
            onChange={(value) => patch({ environment: value as TrainingEnvironment })}
            options={[
              { value: 'full_gym', label: 'Academia completa' },
              { value: 'condo_gym', label: 'Academia de condomínio' },
              { value: 'home', label: 'Em casa' },
              { value: 'no_equipment', label: 'Sem equipamentos' },
            ]}
          />
          <AppText variant="label" muted style={{ marginTop: spacing.lg }}>
            Duração por treino
          </AppText>
          <RadioGroup
            value={answers.sessionDurationMin?.toString()}
            onChange={(value) =>
              patch({ sessionDurationMin: Number(value) as SessionDuration })
            }
            options={[
              { value: '30', label: '30 min' },
              { value: '45', label: '45 min' },
              { value: '60', label: '60 min' },
              { value: '75', label: '75 min' },
              { value: '90', label: '90 min' },
            ]}
          />
          <Input
            label="Restrições ou observações (opcional)"
            placeholder="Ex.: evitar impacto no joelho"
            value={restrictionsText}
            onChangeText={setRestrictionsText}
            multiline
            style={{ minHeight: 96, textAlignVertical: 'top' }}
          />
          <AppText variant="caption" muted style={styles.disclaimer}>
            {MEDICAL_DISCLAIMER}
          </AppText>
        </Question>
      );
    default:
      return null;
  }
}

function Question({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.question}>
      <AppText variant="h1">{title}</AppText>
      {subtitle ? (
        <AppText variant="body" muted>
          {subtitle}
        </AppText>
      ) : null}
      <View style={styles.questionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: spacing.lg,
    justifyContent: 'space-between',
  },
  body: { flex: 1, paddingTop: spacing['2xl'] },
  question: { gap: spacing.md, flex: 1 },
  questionBody: { marginTop: spacing.lg, gap: spacing.lg },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
  disclaimer: {
    lineHeight: 18,
    color: colors.textMuted,
  },
});
