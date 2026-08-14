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
  getEvaluationTotalSteps,
  useEvaluationStore,
} from '@/stores/evaluation-store';
import type {
  DietInterest,
  ExperienceLevel,
  PrimaryGoal,
  SessionDuration,
  Sex,
  TrainingEnvironment,
} from '@/types';
import { colors, spacing } from '@/theme';

const MEDICAL_DISCLAIMER =
  'O PERFORMA oferece sugestões de treino e nutrição. Consulte um profissional de saúde antes de iniciar ou alterar sua rotina, especialmente em caso de lesões, gravidez ou condições clínicas.';

const SPORT_SUGGESTIONS = [
  'Corrida / Road race',
  'Musculação / Bodybuilding',
  'CrossFit',
  'Futebol',
  'Jiu-jitsu',
  'Natação',
  'Ciclismo',
  'Triathlon',
  'Funcional',
  'Outro',
];

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

  const totalSteps = getEvaluationTotalSteps(answers);

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
      case 8:
        return !!answers.dietInterest;
      case 9:
        return typeof answers.preparationMode === 'boolean';
      case 10:
        return (
          !!answers.preparationSport?.trim() &&
          !!answers.competitionName?.trim() &&
          !!answers.competitionDate?.trim()
        );
      default:
        return false;
    }
  }, [answers, step]);

  const handleNext = () => {
    if (step < totalSteps - 1) {
      next();
      return;
    }

    const restrictions = restrictionsText
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const wantsDiet = answers.dietInterest === 'want_with_us';

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
      dietInterest: answers.dietInterest,
      dietBuilderUnlocked: wantsDiet,
      preparationMode: Boolean(answers.preparationMode),
      preparationSport: answers.preparationSport,
      competitionName: answers.competitionName,
      competitionDate: answers.competitionDate,
    });
    reset();
    router.replace('/(tabs)');
  };

  return (
    <Screen contentStyle={styles.screen}>
      <ScreenProgress current={step} total={totalSteps} />
      <View style={styles.body}>
        {renderStep(step, answers, patch, restrictionsText, setRestrictionsText)}
      </View>
      <View style={styles.footer}>
        {step > 0 ? (
          <AppButton label="Voltar" variant="ghost" onPress={back} />
        ) : null}
        <AppButton
          label={step === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
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
    case 8:
      return (
        <Question
          title="E a dieta?"
          subtitle="Isso define se a montagem do plano alimentar fica desbloqueada para você."
        >
          <RadioGroup
            value={answers.dietInterest}
            onChange={(value) => patch({ dietInterest: value as DietInterest })}
            options={[
              {
                value: 'already_doing',
                label: 'Já faço dieta',
                description: 'Continuo com meu plano atual por enquanto',
              },
              {
                value: 'want_with_us',
                label: 'Quero montar com o PERFORMA',
                description: 'Desbloqueia a dieta com IA após a entrevista',
              },
              {
                value: 'not_now',
                label: 'Agora não',
                description: 'Posso liberar depois na aba Nutrição',
              },
            ]}
          />
        </Question>
      );
    case 9:
      return (
        <Question
          title="Modo preparação"
          subtitle="Ative se você está se preparando para um esporte ou competição. Vamos montar a periodização completa."
        >
          <RadioGroup
            value={
              answers.preparationMode == null
                ? undefined
                : answers.preparationMode
                  ? 'yes'
                  : 'no'
            }
            onChange={(value) =>
              patch({
                preparationMode: value === 'yes',
                ...(value === 'no'
                  ? {
                      preparationSport: undefined,
                      competitionName: undefined,
                      competitionDate: undefined,
                    }
                  : {}),
              })
            }
            options={[
              {
                value: 'yes',
                label: 'Sim, ativar modo preparação',
                description: 'Esporte/competição + periodização por fases',
              },
              {
                value: 'no',
                label: 'Não, rotina geral',
                description: 'Treino contínuo sem foco em prova',
              },
            ]}
          />
        </Question>
      );
    case 10:
      return (
        <Question
          title="Para qual prova você está se preparando?"
          subtitle="Usaremos isso para montar a estrutura de periodização até a data da competição."
        >
          <AppText variant="label" muted>
            Esporte
          </AppText>
          <View style={styles.chips}>
            {SPORT_SUGGESTIONS.map((sport) => (
              <Chip
                key={sport}
                label={sport}
                selected={answers.preparationSport === sport}
                onPress={() => patch({ preparationSport: sport })}
              />
            ))}
          </View>
          <Input
            label="Esporte (se outro)"
            placeholder="Ex.: Powerlifting, Tênis, Surf..."
            value={
              SPORT_SUGGESTIONS.includes(answers.preparationSport ?? '')
                ? ''
                : (answers.preparationSport ?? '')
            }
            onChangeText={(preparationSport) => patch({ preparationSport })}
          />
          <Input
            label="Nome da competição"
            placeholder="Ex.: Maratona de SP, Campeonato Estadual..."
            value={answers.competitionName ?? ''}
            onChangeText={(competitionName) => patch({ competitionName })}
          />
          <Input
            label="Data da competição"
            placeholder="AAAA-MM-DD"
            value={answers.competitionDate ?? ''}
            onChangeText={(competitionDate) => patch({ competitionDate })}
            autoCapitalize="none"
          />
          <AppText variant="caption" muted>
            Use o formato AAAA-MM-DD (ex.: 2026-11-15).
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
