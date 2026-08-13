export type Sex = 'female' | 'male' | 'other' | 'prefer_not';

export type PrimaryGoal =
  | 'lose_fat'
  | 'gain_muscle'
  | 'definition'
  | 'conditioning'
  | 'maintain'
  | 'health';

export type Goal = PrimaryGoal;
export type FitnessGoal = PrimaryGoal;
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingEnvironment =
  | 'full_gym'
  | 'condo_gym'
  | 'home'
  | 'no_equipment';
export type SessionDuration = 30 | 45 | 60 | 75 | 90;
export type WorkoutDuration = SessionDuration;

export type MealType =
  | 'breakfast'
  | 'snack_am'
  | 'morning_snack'
  | 'lunch'
  | 'snack_pm'
  | 'afternoon_snack'
  | 'dinner'
  | 'supper';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'glutes'
  | 'abs'
  | 'cardio';

export type Equipment =
  | 'machine'
  | 'dumbbell'
  | 'barbell'
  | 'cable'
  | 'bodyweight';

export type DietGoal = 'lose_fat' | 'gain_muscle' | 'definition' | 'maintain';
export type CookingTime =
  | 'none'
  | 'almost_none'
  | 'low'
  | 'little'
  | 'moderate'
  | 'love'
  | 'love_cooking';
export type BudgetLevel = 'economic' | 'mid' | 'intermediate' | 'flexible';

export type DietInterest = 'already_doing' | 'want_with_us' | 'not_now';

export type TrainingMode = 'general' | 'preparation';

export type PeriodizationPhaseKind =
  | 'base'
  | 'build'
  | 'intensification'
  | 'peak'
  | 'taper'
  | 'competition';

export interface PeriodizationPhase {
  id: string;
  kind: PeriodizationPhaseKind;
  name: string;
  weeks: number;
  focus: string;
  volume: 'low' | 'moderate' | 'high';
  intensity: 'low' | 'moderate' | 'high';
  notes: string[];
}

export interface PeriodizationPlan {
  id: string;
  sport: string;
  competitionName: string;
  competitionDate: string;
  totalWeeks: number;
  phases: PeriodizationPhase[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: PrimaryGoal;
  experience: ExperienceLevel;
  trainingDaysPerWeek: number;
  environment: TrainingEnvironment;
  sessionDurationMin: SessionDuration;
  preferredDuration?: SessionDuration;
  restrictions: string[];
  streakDays: number;
  /** Já faz dieta / quer montar com o PERFORMA / agora não */
  dietInterest?: DietInterest;
  /** Desbloqueia a montagem de dieta na aba Nutrição */
  dietBuilderUnlocked?: boolean;
  /** Modo preparação para esporte/competição */
  preparationMode?: boolean;
  preparationSport?: string;
  competitionName?: string;
  competitionDate?: string;
  periodization?: PeriodizationPlan | null;
  onboardingCompleted?: boolean;
  assessmentCompleted?: boolean;
  evaluationCompleted?: boolean;
  units: { weight: 'kg' | 'lb'; height: 'cm' | 'in' };
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  instructions: string[];
  commonMistakes: string[];
  thumbnailColor?: string;
  /** Google Drive file id for the exercise GIF */
  driveFileId?: string;
  /** Direct URL to the execution GIF */
  gifUrl?: string;
  sourceFolder?: string;
  restSecondsDefault?: number;
  defaultSets?: number;
  defaultReps?: number;
  defaultRestSec?: number;
}

export interface WorkoutExercise {
  id?: string;
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  restSeconds: number;
  previousWeightKg: number;
  suggestedWeightKg: number;
  completed: boolean;
  notes?: string;
  order?: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  estimatedMinutes: number;
  muscleFocus: string[];
  exercises: WorkoutExercise[];
}

export interface LoggedSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completedAt: string;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export type MacroConsumed = MacroTargets;
export type Macros = MacroTargets;

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  title?: string;
  time: string;
  items: FoodItem[];
  logged?: boolean;
  calories?: number;
  macros?: Macros;
}

export interface DietPlan {
  id: string;
  title: string;
  targets: MacroTargets;
  dailyCalories?: number;
  macros?: Macros;
  meals: Meal[];
  createdAt: string;
  source?: 'ai' | 'manual';
}

/** Garante targets sempre presentes ao ler planos gerados/mock */
export function getDietTargets(plan: DietPlan): MacroTargets {
  return (
    plan.targets ??
    plan.macros ?? {
      calories: plan.dailyCalories ?? 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
    }
  );
}

export interface DailyNutrition {
  date: string;
  consumed: MacroTargets;
  target: MacroTargets;
  meals: Meal[];
  waterLiters: number;
  waterGoalLiters: number;
}

export interface NutritionDaySummary {
  consumedCalories: number;
  remainingCalories: number;
  targetCalories: number;
  macrosConsumed: { proteinG: number; carbsG: number; fatG: number };
  macrosTarget: { proteinG: number; carbsG: number; fatG: number };
}

export interface WeightPoint {
  date: string;
  weightKg: number;
}

export type ProgressPoint = WeightPoint;

export interface BodyMeasurement {
  id?: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  abdomenCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  hipCm?: number;
  calfCm?: number;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  weightKg: number;
  reps?: number;
  date: string;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  key?: string;
  targetLabel: string;
  completed: boolean;
  completedToday?: boolean;
  streak: number;
}

export interface AIInsight {
  id: string;
  category: 'consistency' | 'progression' | 'protein' | 'recovery' | 'general';
  title: string;
  message: string;
  accent?: 'green' | 'purple';
}

export type AiInsight = AIInsight;

export interface EvaluationAnswers {
  sex?: Sex;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  goal?: PrimaryGoal;
  experience?: ExperienceLevel;
  trainingDaysPerWeek?: number;
  environment?: TrainingEnvironment;
  sessionDurationMin?: SessionDuration;
  restrictions?: string[];
  dietInterest?: DietInterest;
  preparationMode?: boolean;
  preparationSport?: string;
  competitionName?: string;
  competitionDate?: string;
}

export type AssessmentAnswers = EvaluationAnswers & { restrictions?: string | string[] };

export interface DietInterviewAnswers {
  goal?: DietGoal;
  mealsPerDay?: 3 | 4 | 5 | 6;
  usualMeals?: MealType[];
  wakeTime?: string;
  trainTime?: string;
  trainingTime?: string;
  likedFoods?: string[];
  dislikedFoods?: string[];
  restrictions?: string[];
  cookingTime?: CookingTime;
  budget?: BudgetLevel;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'proteins' | 'carbs' | 'fruits' | 'vegetables' | 'dairy' | 'other';
  quantityLabel: string;
  purchased: boolean;
}
