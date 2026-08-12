import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Chip,
  RadioGroup,
  Screen,
  ScreenProgress,
} from '@/components/ui';
import {
  DIET_INTERVIEW_STEPS,
  useNutritionStore,
} from '@/stores/nutrition-store';
import type { DietInterviewAnswers, MealType } from '@/types';
import { spacing } from '@/theme';

const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Café' },
  { value: 'snack_am', label: 'Lanche manhã' },
  { value: 'lunch', label: 'Almoço' },
  { value: 'snack_pm', label: 'Lanche tarde' },
  { value: 'dinner', label: 'Jantar' },
  { value: 'supper', label: 'Ceia' },
];

const FOOD_OPTIONS = [
  'Frango',
  'Ovos',
  'Arroz',
  'Batata-doce',
  'Aveia',
  'Banana',
  'Iogurte',
  'Salmão',
  'Quinoa',
  'Whey',
];

export default function AiInterviewScreen() {
  const router = useRouter();
  const step = useNutritionStore((s) => s.interviewStep);
  const interview = useNutritionStore((s) => s.interview);
  const patchInterview = useNutritionStore((s) => s.patchInterview);
  const setInterviewStep = useNutritionStore((s) => s.setInterviewStep);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return !!interview.goal;
      case 1:
        return !!interview.mealsPerDay;
      case 2:
        return (interview.usualMeals?.length ?? 0) > 0;
      case 3:
        return !!interview.wakeTime;
      case 4:
        return !!interview.trainTime;
      case 5:
        return (interview.likedFoods?.length ?? 0) > 0;
      case 6:
        return true;
      case 7:
        return true;
      case 8:
        return !!interview.cookingTime;
      case 9:
        return !!interview.budget;
      default:
        return false;
    }
  }, [interview, step]);

  const goNext = () => {
    if (step < DIET_INTERVIEW_STEPS - 1) {
      setInterviewStep(step + 1);
      return;
    }
    router.push('/nutrition/ai-generating');
  };

  const goBack = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setInterviewStep(step - 1);
  };

  const toggleList = (
    key: 'likedFoods' | 'dislikedFoods' | 'restrictions' | 'usualMeals',
    value: string,
  ) => {
    const current = (interview[key] as string[] | undefined) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    patchInterview({ [key]: next } as DietInterviewAnswers);
  };

  return (
    <Screen contentStyle={styles.screen}>
      <ScreenProgress current={step} total={DIET_INTERVIEW_STEPS} />
      <View style={styles.body}>{renderStep(step, interview, patchInterview, toggleList)}</View>
      <View style={styles.footer}>
        <AppButton label="Voltar" variant="ghost" onPress={goBack} />
        <AppButton
          label={step === DIET_INTERVIEW_STEPS - 1 ? 'Gerar dieta' : 'Próximo'}
          variant="ai"
          disabled={!canContinue}
          onPress={goNext}
        />
      </View>
    </Screen>
  );
}

function renderStep(
  step: number,
  interview: DietInterviewAnswers,
  patch: (partial: DietInterviewAnswers) => void,
  toggleList: (
    key: 'likedFoods' | 'dislikedFoods' | 'restrictions' | 'usualMeals',
    value: string,
  ) => void,
) {
  switch (step) {
    case 0:
      return (
        <Question title="Qual é o objetivo da dieta?">
          <RadioGroup
            value={interview.goal}
            onChange={(value) =>
              patch({ goal: value as DietInterviewAnswers['goal'] })
            }
            options={[
              { value: 'lose_fat', label: 'Perder gordura' },
              { value: 'gain_muscle', label: 'Ganhar massa' },
              { value: 'definition', label: 'Definição' },
              { value: 'maintain', label: 'Manter peso' },
            ]}
          />
        </Question>
      );
    case 1:
      return (
        <Question title="Quantas refeições por dia?">
          <View style={styles.chips}>
            {([3, 4, 5, 6] as const).map((n) => (
              <Chip
                key={n}
                label={`${n}`}
                selected={interview.mealsPerDay === n}
                onPress={() => patch({ mealsPerDay: n })}
              />
            ))}
          </View>
        </Question>
      );
    case 2:
      return (
        <Question title="Quais refeições você costuma fazer?">
          <View style={styles.chips}>
            {MEAL_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={interview.usualMeals?.includes(opt.value)}
                onPress={() => toggleList('usualMeals', opt.value)}
              />
            ))}
          </View>
        </Question>
      );
    case 3:
      return (
        <Question title="Que horas você costuma acordar?">
          <RadioGroup
            value={interview.wakeTime}
            onChange={(wakeTime) => patch({ wakeTime })}
            options={[
              { value: '05:00', label: '05:00' },
              { value: '06:00', label: '06:00' },
              { value: '07:00', label: '07:00' },
              { value: '08:00', label: '08:00' },
              { value: '09:00', label: '09:00+' },
            ]}
          />
        </Question>
      );
    case 4:
      return (
        <Question title="Em qual horário você treina?">
          <RadioGroup
            value={interview.trainTime}
            onChange={(trainTime) => patch({ trainTime })}
            options={[
              { value: 'morning', label: 'Manhã' },
              { value: 'afternoon', label: 'Tarde' },
              { value: 'evening', label: 'Noite' },
              { value: 'flexible', label: 'Flexível' },
            ]}
          />
        </Question>
      );
    case 5:
      return (
        <Question title="Alimentos que você gosta">
          <View style={styles.chips}>
            {FOOD_OPTIONS.map((food) => (
              <Chip
                key={food}
                label={food}
                selected={interview.likedFoods?.includes(food)}
                onPress={() => toggleList('likedFoods', food)}
              />
            ))}
          </View>
        </Question>
      );
    case 6:
      return (
        <Question title="Alimentos que prefere evitar (opcional)">
          <View style={styles.chips}>
            {FOOD_OPTIONS.map((food) => (
              <Chip
                key={food}
                label={food}
                selected={interview.dislikedFoods?.includes(food)}
                onPress={() => toggleList('dislikedFoods', food)}
              />
            ))}
          </View>
        </Question>
      );
    case 7:
      return (
        <Question title="Restrições alimentares (opcional)">
          <View style={styles.chips}>
            {['Lactose', 'Glúten', 'Vegetariano', 'Vegano', 'Nenhuma'].map((item) => (
              <Chip
                key={item}
                label={item}
                selected={interview.restrictions?.includes(item)}
                onPress={() => toggleList('restrictions', item)}
              />
            ))}
          </View>
        </Question>
      );
    case 8:
      return (
        <Question title="Quanto tempo você tem para cozinhar?">
          <RadioGroup
            value={interview.cookingTime}
            onChange={(value) =>
              patch({ cookingTime: value as DietInterviewAnswers['cookingTime'] })
            }
            options={[
              { value: 'none', label: 'Quase nenhum' },
              { value: 'low', label: 'Pouco' },
              { value: 'moderate', label: 'Moderado' },
              { value: 'love', label: 'Adoro cozinhar' },
            ]}
          />
        </Question>
      );
    case 9:
      return (
        <Question title="Qual é o seu orçamento?">
          <RadioGroup
            value={interview.budget}
            onChange={(value) =>
              patch({ budget: value as DietInterviewAnswers['budget'] })
            }
            options={[
              { value: 'economic', label: 'Econômico' },
              { value: 'mid', label: 'Intermediário' },
              { value: 'flexible', label: 'Flexível' },
            ]}
          />
        </Question>
      );
    default:
      return null;
  }
}

function Question({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.question}>
      <AppText variant="h1">{title}</AppText>
      <View style={styles.questionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, paddingTop: spacing['2xl'] },
  question: { gap: spacing.md, flex: 1 },
  questionBody: { marginTop: spacing.lg, gap: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
});
