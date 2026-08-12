import type {
  AIInsight,
  BodyMeasurement,
  DailyNutrition,
  DietPlan,
  Exercise,
  Habit,
  PersonalRecord,
  UserProfile,
  WeightPoint,
  WorkoutPlan,
} from '@/types';

export const mockUser: UserProfile = {
  id: 'user_amanda',
  name: 'Amanda Silva',
  fullName: 'Amanda Silva',
  username: 'amanda.silva',
  email: 'amanda@performa.app',
  sex: 'female',
  age: 28,
  heightCm: 168,
  weightKg: 72,
  goal: 'definition',
  experience: 'intermediate',
  trainingDaysPerWeek: 4,
  environment: 'full_gym',
  sessionDurationMin: 60,
  restrictions: [],
  streakDays: 7,
  onboardingCompleted: true,
  assessmentCompleted: true,
  units: { weight: 'kg', height: 'cm' },
};

export const goalLabels: Record<string, string> = {
  lose_fat: 'Perder gordura',
  gain_muscle: 'Ganhar massa muscular',
  definition: 'Definição muscular',
  conditioning: 'Melhorar condicionamento',
  maintain: 'Manter peso',
  health: 'Saúde e bem-estar',
};

export const mockExercises: Exercise[] = [
  {
    id: 'ex_bench',
    name: 'Supino reto',
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    instructions: [
      'Deite no banco com os pés firmes no chão.',
      'Segure a barra na largura dos ombros.',
      'Desça controlando até o peito e empurre para cima.',
    ],
    commonMistakes: ['Arquear excessivamente as costas', 'Descer a barra no pescoço'],
    thumbnailColor: '#3D2A55',
  },
  {
    id: 'ex_incline',
    name: 'Supino inclinado',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    instructions: [
      'Ajuste o banco em 30–45°.',
      'Empurre os halteres para cima alinhados ao peito superior.',
    ],
    commonMistakes: ['Inclinação muito alta', 'Abrir demais os cotovelos'],
    thumbnailColor: '#2A3D55',
  },
  {
    id: 'ex_row',
    name: 'Remada curvada',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'barbell',
    instructions: [
      'Incline o tronco mantendo a coluna neutra.',
      'Puxe a barra em direção ao abdômen.',
    ],
    commonMistakes: ['Usar impulso do tronco', 'Arredondar as costas'],
    thumbnailColor: '#2A553D',
  },
  {
    id: 'ex_ohp',
    name: 'Desenvolvimento',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'dumbbell',
    instructions: [
      'Empurre os halteres acima da cabeça sem travar os cotovelos.',
      'Controle a descida até a linha das orelhas.',
    ],
    commonMistakes: ['Arquear a lombar', 'Subir os ombros'],
    thumbnailColor: '#553D2A',
  },
  {
    id: 'ex_lateral',
    name: 'Elevação lateral',
    muscleGroup: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    instructions: [
      'Eleve os braços até a linha dos ombros com leve flexão de cotovelo.',
    ],
    commonMistakes: ['Usar impulso', 'Subir acima da linha dos ombros'],
    thumbnailColor: '#553A55',
  },
  {
    id: 'ex_triceps',
    name: 'Tríceps na polia',
    muscleGroup: 'triceps',
    secondaryMuscles: [],
    equipment: 'cable',
    instructions: [
      'Mantenha os cotovelos fixos ao lado do corpo e estenda os braços.',
    ],
    commonMistakes: ['Abrir os cotovelos', 'Inclinar o tronco'],
    thumbnailColor: '#2A4555',
  },
  {
    id: 'ex_biceps',
    name: 'Rosca direta',
    muscleGroup: 'biceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    instructions: [
      'Flexione os cotovelos sem balançar o corpo.',
      'Controle a descida completa.',
    ],
    commonMistakes: ['Usar impulso', 'Abrir os cotovelos'],
    thumbnailColor: '#453D2A',
  },
  {
    id: 'ex_squat',
    name: 'Agachamento livre',
    muscleGroup: 'legs',
    secondaryMuscles: ['glutes', 'abs'],
    equipment: 'barbell',
    instructions: [
      'Posicione a barra no trapézio e abra os pés na largura dos ombros.',
      'Desça até as coxas ficarem paralelas ao chão e suba empurrando o chão.',
    ],
    commonMistakes: ['Joelho caindo para dentro', 'Subir o calcanhar'],
    thumbnailColor: '#2F4A3A',
  },
  {
    id: 'ex_rdl',
    name: 'Levantamento terra romeno',
    muscleGroup: 'legs',
    secondaryMuscles: ['glutes', 'back'],
    equipment: 'barbell',
    instructions: [
      'Com joelhos levemente flexionados, empurre o quadril para trás.',
      'Desça a barra próxima às pernas e volte contraindo glúteos.',
    ],
    commonMistakes: ['Arredondar a lombar', 'Flexionar demais os joelhos'],
    thumbnailColor: '#3A4A2F',
  },
  {
    id: 'ex_hip_thrust',
    name: 'Hip thrust',
    muscleGroup: 'glutes',
    secondaryMuscles: ['legs'],
    equipment: 'barbell',
    instructions: [
      'Apoie as costas no banco e a barra sobre o quadril.',
      'Empurre o quadril para cima até alinhar tronco e coxas.',
    ],
    commonMistakes: ['Hiperextender a lombar', 'Não completar a extensão'],
    thumbnailColor: '#4A2F3A',
  },
  {
    id: 'ex_pulldown',
    name: 'Puxada frontal',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'cable',
    instructions: [
      'Puxe a barra em direção ao peito mantendo o peito aberto.',
      'Controle a subida sem soltar os ombros.',
    ],
    commonMistakes: ['Usar impulso do tronco', 'Encolher os ombros'],
    thumbnailColor: '#2F3A4A',
  },
  {
    id: 'ex_crunch',
    name: 'Abdominal crunch',
    muscleGroup: 'abs',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    instructions: [
      'Deite com joelhos flexionados e eleve o tronco sem puxar o pescoço.',
    ],
    commonMistakes: ['Puxar a cabeça', 'Usar impulso das pernas'],
    thumbnailColor: '#3A3A4A',
  },
  {
    id: 'ex_bike',
    name: 'Bike ergométrica',
    muscleGroup: 'cardio',
    secondaryMuscles: ['legs'],
    equipment: 'machine',
    instructions: [
      'Mantenha cadência constante e postura ereta por 15–20 minutos.',
    ],
    commonMistakes: ['Inclinar demais o tronco', 'Cadência irregular'],
    thumbnailColor: '#2A4A55',
  },
  {
    id: 'ex_pushup',
    name: 'Flexão de braço',
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
    instructions: [
      'Corpo alinhado, desça o peito próximo ao chão e empurre para cima.',
    ],
    commonMistakes: ['Quadril caindo', 'Abrir demais os cotovelos'],
    thumbnailColor: '#4A3A2A',
  },
  {
    id: 'ex_lunges',
    name: 'Afundo caminhando',
    muscleGroup: 'legs',
    secondaryMuscles: ['glutes'],
    equipment: 'dumbbell',
    instructions: [
      'Dê um passo à frente e desça até o joelho de trás quase tocar o chão.',
    ],
    commonMistakes: ['Joelho passar muito da ponta do pé', 'Tronco inclinado'],
    thumbnailColor: '#3A552A',
  },
];

export const muscleGroupLabels: Record<string, string> = {
  chest: 'Peito',
  back: 'Costas',
  legs: 'Pernas',
  shoulders: 'Ombro',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  glutes: 'Glúteos',
  abs: 'Abdômen',
  cardio: 'Cardio',
};

export const equipmentLabels: Record<string, string> = {
  machine: 'Máquina',
  dumbbell: 'Halter',
  barbell: 'Barra',
  cable: 'Cabo',
  bodyweight: 'Peso corporal',
};

export type CalendarEventType =
  | 'workout'
  | 'rest'
  | 'diet'
  | 'weight'
  | 'habit'
  | 'pr';

export type CalendarEvent = {
  id: string;
  date: string;
  type: CalendarEventType;
  title: string;
  detail?: string;
};

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'c1', date: '2026-08-05', type: 'workout', title: 'Superiores A', detail: '55 min' },
  { id: 'c2', date: '2026-08-05', type: 'weight', title: 'Peso registrado', detail: '72,5 kg' },
  { id: 'c3', date: '2026-08-06', type: 'rest', title: 'Descanso ativo' },
  { id: 'c4', date: '2026-08-07', type: 'workout', title: 'Inferiores B', detail: '50 min' },
  { id: 'c5', date: '2026-08-07', type: 'pr', title: 'Novo PR', detail: 'Agachamento 70 kg' },
  { id: 'c6', date: '2026-08-08', type: 'workout', title: 'Superiores B', detail: '52 min' },
  { id: 'c7', date: '2026-08-08', type: 'pr', title: 'Novo PR', detail: 'Supino 80 kg' },
  { id: 'c8', date: '2026-08-09', type: 'diet', title: 'Meta de proteína', detail: '150 g' },
  { id: 'c9', date: '2026-08-09', type: 'habit', title: 'Água 2 L' },
  { id: 'c10', date: '2026-08-10', type: 'rest', title: 'Descanso' },
  { id: 'c11', date: '2026-08-11', type: 'workout', title: 'Superiores A', detail: '55 min' },
  { id: 'c12', date: '2026-08-11', type: 'weight', title: 'Peso registrado', detail: '72,0 kg' },
  { id: 'c13', date: '2026-08-11', type: 'habit', title: 'Treino + sono' },
];

export type ProgressPhotoSet = {
  id: string;
  date: string;
  note: string;
  frontColor: string;
  sideColor: string;
  backColor: string;
};

export const mockProgressPhotos: ProgressPhotoSet[] = [
  {
    id: 'pp1',
    date: '2026-06-15',
    note: 'Início do ciclo de definição',
    frontColor: '#3A3A48',
    sideColor: '#323240',
    backColor: '#2C2C38',
  },
  {
    id: 'pp2',
    date: '2026-08-11',
    note: 'Após 8 semanas consistentes',
    frontColor: '#2A3D55',
    sideColor: '#2A4555',
    backColor: '#2A553D',
  },
];

export const mockExerciseHistory: Record<
  string,
  { date: string; weightKg: number; reps: number; sets: number }[]
> = {
  ex_bench: [
    { date: '2026-07-20', weightKg: 55, reps: 12, sets: 4 },
    { date: '2026-07-27', weightKg: 57.5, reps: 12, sets: 4 },
    { date: '2026-08-03', weightKg: 60, reps: 12, sets: 4 },
    { date: '2026-08-08', weightKg: 80, reps: 5, sets: 1 },
  ],
  ex_squat: [
    { date: '2026-07-22', weightKg: 60, reps: 10, sets: 4 },
    { date: '2026-07-29', weightKg: 65, reps: 10, sets: 4 },
    { date: '2026-08-05', weightKg: 70, reps: 8, sets: 4 },
  ],
};

const byId = Object.fromEntries(mockExercises.map((e) => [e.id, e]));

export const mockTodayWorkout: WorkoutPlan = {
  id: 'workout_superiores_a',
  name: 'Superiores A',
  estimatedMinutes: 55,
  muscleFocus: ['Peito', 'Costas', 'Ombros', 'Braços'],
  exercises: [
    {
      exerciseId: 'ex_bench',
      exercise: byId.ex_bench,
      sets: 4,
      reps: 12,
      restSeconds: 60,
      previousWeightKg: 60,
      suggestedWeightKg: 62,
      completed: false,
    },
    {
      exerciseId: 'ex_incline',
      exercise: byId.ex_incline,
      sets: 3,
      reps: 10,
      restSeconds: 60,
      previousWeightKg: 18,
      suggestedWeightKg: 20,
      completed: false,
    },
    {
      exerciseId: 'ex_row',
      exercise: byId.ex_row,
      sets: 4,
      reps: 10,
      restSeconds: 75,
      previousWeightKg: 50,
      suggestedWeightKg: 52.5,
      completed: false,
    },
    {
      exerciseId: 'ex_ohp',
      exercise: byId.ex_ohp,
      sets: 3,
      reps: 10,
      restSeconds: 60,
      previousWeightKg: 16,
      suggestedWeightKg: 16,
      completed: false,
    },
    {
      exerciseId: 'ex_lateral',
      exercise: byId.ex_lateral,
      sets: 3,
      reps: 15,
      restSeconds: 45,
      previousWeightKg: 8,
      suggestedWeightKg: 8,
      completed: false,
    },
    {
      exerciseId: 'ex_triceps',
      exercise: byId.ex_triceps,
      sets: 3,
      reps: 12,
      restSeconds: 45,
      previousWeightKg: 25,
      suggestedWeightKg: 27.5,
      completed: false,
    },
    {
      exerciseId: 'ex_biceps',
      exercise: byId.ex_biceps,
      sets: 3,
      reps: 12,
      restSeconds: 45,
      previousWeightKg: 25,
      suggestedWeightKg: 25,
      completed: false,
    },
  ],
};

export const mockDailyNutrition: DailyNutrition = {
  date: '2026-08-11',
  consumed: {
    calories: 1850,
    proteinG: 118,
    carbsG: 180,
    fatG: 58,
  },
  target: {
    calories: 2270,
    proteinG: 150,
    carbsG: 220,
    fatG: 70,
  },
  waterLiters: 1.7,
  waterGoalLiters: 2.5,
  meals: [
    {
      id: 'meal_breakfast',
      type: 'breakfast',
      name: 'Café da manhã',
      time: '08:00',
      logged: true,
      items: [
        {
          id: 'f1',
          name: 'Omelete de claras',
          quantity: 150,
          unit: 'g',
          calories: 180,
          proteinG: 28,
          carbsG: 2,
          fatG: 6,
        },
        {
          id: 'f2',
          name: 'Aveia com frutas',
          quantity: 80,
          unit: 'g',
          calories: 290,
          proteinG: 10,
          carbsG: 48,
          fatG: 6,
        },
      ],
    },
    {
      id: 'meal_lunch',
      type: 'lunch',
      name: 'Almoço',
      time: '13:00',
      logged: true,
      items: [
        {
          id: 'f3',
          name: 'Frango grelhado',
          quantity: 150,
          unit: 'g',
          calories: 248,
          proteinG: 46,
          carbsG: 0,
          fatG: 6,
        },
        {
          id: 'f4',
          name: 'Arroz integral',
          quantity: 120,
          unit: 'g',
          calories: 150,
          proteinG: 3,
          carbsG: 32,
          fatG: 1,
        },
        {
          id: 'f5',
          name: 'Salada verde',
          quantity: 100,
          unit: 'g',
          calories: 35,
          proteinG: 2,
          carbsG: 5,
          fatG: 1,
        },
      ],
    },
  ],
};

export const mockDietPlan: DietPlan = {
  id: 'diet_ai_1',
  title: 'Plano de definição',
  createdAt: '2026-08-11',
  targets: {
    calories: 2100,
    proteinG: 150,
    carbsG: 200,
    fatG: 70,
  },
  meals: [
    {
      id: 'plan_breakfast',
      type: 'breakfast',
      name: 'Café da manhã',
      time: '08:00',
      logged: false,
      items: [
        {
          id: 'pf1',
          name: 'Omelete de claras',
          quantity: 180,
          unit: 'g',
          calories: 210,
          proteinG: 32,
          carbsG: 2,
          fatG: 7,
        },
        {
          id: 'pf2',
          name: 'Aveia com frutas',
          quantity: 70,
          unit: 'g',
          calories: 250,
          proteinG: 8,
          carbsG: 42,
          fatG: 5,
        },
      ],
    },
    {
      id: 'plan_snack_am',
      type: 'snack_am',
      name: 'Lanche',
      time: '10:30',
      logged: false,
      items: [
        {
          id: 'pf3',
          name: 'Iogurte natural',
          quantity: 170,
          unit: 'g',
          calories: 110,
          proteinG: 12,
          carbsG: 10,
          fatG: 2,
        },
        {
          id: 'pf4',
          name: 'Banana',
          quantity: 1,
          unit: 'un',
          calories: 90,
          proteinG: 1,
          carbsG: 23,
          fatG: 0,
        },
      ],
    },
    {
      id: 'plan_lunch',
      type: 'lunch',
      name: 'Almoço',
      time: '13:00',
      logged: false,
      items: [
        {
          id: 'pf5',
          name: 'Peito de frango',
          quantity: 150,
          unit: 'g',
          calories: 248,
          proteinG: 46,
          carbsG: 0,
          fatG: 6,
        },
        {
          id: 'pf6',
          name: 'Arroz',
          quantity: 150,
          unit: 'g',
          calories: 195,
          proteinG: 4,
          carbsG: 42,
          fatG: 0,
        },
        {
          id: 'pf7',
          name: 'Brócolis',
          quantity: 100,
          unit: 'g',
          calories: 35,
          proteinG: 3,
          carbsG: 7,
          fatG: 0,
        },
      ],
    },
    {
      id: 'plan_snack_pm',
      type: 'snack_pm',
      name: 'Lanche da tarde',
      time: '16:30',
      logged: false,
      items: [
        {
          id: 'pf8',
          name: 'Whey protein',
          quantity: 30,
          unit: 'g',
          calories: 120,
          proteinG: 24,
          carbsG: 2,
          fatG: 1,
        },
        {
          id: 'pf9',
          name: 'Castanhas',
          quantity: 20,
          unit: 'g',
          calories: 120,
          proteinG: 4,
          carbsG: 4,
          fatG: 10,
        },
      ],
    },
    {
      id: 'plan_dinner',
      type: 'dinner',
      name: 'Jantar',
      time: '20:00',
      logged: false,
      items: [
        {
          id: 'pf10',
          name: 'Salmão grelhado',
          quantity: 140,
          unit: 'g',
          calories: 290,
          proteinG: 32,
          carbsG: 0,
          fatG: 18,
        },
        {
          id: 'pf11',
          name: 'Batata-doce',
          quantity: 150,
          unit: 'g',
          calories: 129,
          proteinG: 2,
          carbsG: 30,
          fatG: 0,
        },
        {
          id: 'pf12',
          name: 'Salada mista',
          quantity: 120,
          unit: 'g',
          calories: 45,
          proteinG: 2,
          carbsG: 6,
          fatG: 2,
        },
      ],
    },
  ],
};

export const mockWeightHistory: WeightPoint[] = [
  { date: '2026-07-12', weightKg: 77.2 },
  { date: '2026-07-19', weightKg: 76.1 },
  { date: '2026-07-26', weightKg: 75.0 },
  { date: '2026-08-02', weightKg: 73.8 },
  { date: '2026-08-09', weightKg: 72.5 },
  { date: '2026-08-11', weightKg: 72.0 },
];

export const mockMeasurements: BodyMeasurement[] = [
  {
    date: '2026-08-11',
    weightKg: 72,
    waistCm: 74,
    abdomenCm: 78,
    chestCm: 92,
    armCm: 31,
    thighCm: 56,
    hipCm: 98,
    calfCm: 35,
  },
];

export const mockPRs: PersonalRecord[] = [
  {
    id: 'pr1',
    exerciseName: 'Supino reto',
    weightKg: 80,
    reps: 5,
    date: '2026-08-08',
  },
  {
    id: 'pr2',
    exerciseName: 'Remada curvada',
    weightKg: 70,
    reps: 6,
    date: '2026-08-05',
  },
];

export const mockHabits: Habit[] = [
  {
    id: 'h1',
    title: 'Beber 2L de água',
    icon: 'droplet',
    targetLabel: '2,0 L',
    completed: true,
    streak: 7,
  },
  {
    id: 'h2',
    title: 'Treinar',
    icon: 'dumbbell',
    targetLabel: '1 sessão',
    completed: false,
    streak: 4,
  },
  {
    id: 'h3',
    title: 'Dormir 8h',
    icon: 'moon',
    targetLabel: '8h',
    completed: true,
    streak: 5,
  },
  {
    id: 'h4',
    title: 'Meditar',
    icon: 'brain',
    targetLabel: '10 min',
    completed: false,
    streak: 2,
  },
  {
    id: 'h5',
    title: 'Consumir frutas',
    icon: 'apple',
    targetLabel: '2 porções',
    completed: true,
    streak: 6,
  },
  {
    id: 'h6',
    title: 'Caminhar',
    icon: 'footprints',
    targetLabel: '6.000 passos',
    completed: false,
    streak: 3,
  },
];

export const mockInsights: AIInsight[] = [
  {
    id: 'ins1',
    category: 'progression',
    title: 'PERFORMA AI',
    message: 'Você aumentou seu volume de treino em 8% esta semana.',
  },
  {
    id: 'ins2',
    category: 'protein',
    title: 'Proteína',
    message: 'Você atingiu sua meta de proteína em 5 dos últimos 7 dias.',
  },
  {
    id: 'ins3',
    category: 'consistency',
    title: 'Consistência',
    message: 'Você treinou 4 vezes esta semana. Mantenha o ritmo.',
  },
];

export const shoppingList = [
  { id: 's1', category: 'Proteínas', name: 'Peito de frango', qty: '1,2 kg', checked: false },
  { id: 's2', category: 'Proteínas', name: 'Salmão', qty: '600 g', checked: false },
  { id: 's3', category: 'Proteínas', name: 'Claras de ovo', qty: '1 L', checked: true },
  { id: 's4', category: 'Carboidratos', name: 'Arroz', qty: '1 kg', checked: false },
  { id: 's5', category: 'Carboidratos', name: 'Batata-doce', qty: '1,5 kg', checked: false },
  { id: 's6', category: 'Carboidratos', name: 'Aveia', qty: '500 g', checked: true },
  { id: 's7', category: 'Frutas', name: 'Banana', qty: '8 un', checked: false },
  { id: 's8', category: 'Vegetais', name: 'Brócolis', qty: '600 g', checked: false },
  { id: 's9', category: 'Laticínios', name: 'Iogurte natural', qty: '6 un', checked: false },
  { id: 's10', category: 'Outros', name: 'Castanhas', qty: '200 g', checked: false },
];
