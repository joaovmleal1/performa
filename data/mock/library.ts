import type { Equipment, Exercise, MuscleGroup } from '@/types';

/** Exercícios adicionais para a biblioteca (além dos do treino de hoje). */
export const libraryExercises: Exercise[] = [
  {
    id: 'ex_squat',
    name: 'Agachamento livre',
    muscleGroup: 'legs',
    secondaryMuscles: ['glutes'],
    equipment: 'barbell',
    instructions: [
      'Barra apoiada no trapézio, pés na largura dos ombros.',
      'Desça até as coxas ficarem paralelas ao chão.',
      'Empurre o chão mantendo o tronco estável.',
    ],
    commonMistakes: ['Joelhos caindo para dentro', 'Subir os calcanhares'],
    thumbnailColor: '#2F3A55',
  },
  {
    id: 'ex_rdl',
    name: 'Levantamento terra romeno',
    muscleGroup: 'legs',
    secondaryMuscles: ['glutes', 'back'],
    equipment: 'barbell',
    instructions: [
      'Quadril vai para trás com joelhos levemente flexionados.',
      'Desça a barra próximo às pernas.',
      'Retorne contraindo glúteos e posteriores.',
    ],
    commonMistakes: ['Arredondar a lombar', 'Flexionar demais os joelhos'],
    thumbnailColor: '#3A5532',
  },
  {
    id: 'ex_hipthrust',
    name: 'Elevação de quadril',
    muscleGroup: 'glutes',
    secondaryMuscles: ['legs'],
    equipment: 'barbell',
    instructions: [
      'Costas apoiadas no banco, barra sobre o quadril.',
      'Empurre o quadril até a extensão completa.',
      'Segure 1 segundo no topo.',
    ],
    commonMistakes: ['Hiperextender a lombar', 'Empurrar só com os quadríceps'],
    thumbnailColor: '#55324A',
  },
  {
    id: 'ex_latpulldown',
    name: 'Puxada alta',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'cable',
    instructions: [
      'Puxe a barra até a clavícula.',
      'Contraia as escápulas no final do movimento.',
    ],
    commonMistakes: ['Inclinar o tronco demais', 'Usar impulso'],
    thumbnailColor: '#324A55',
  },
  {
    id: 'ex_legpress',
    name: 'Leg press',
    muscleGroup: 'legs',
    secondaryMuscles: ['glutes'],
    equipment: 'machine',
    instructions: [
      'Pés na plataforma na largura dos ombros.',
      'Desça controlando até ~90° nos joelhos.',
      'Empurre sem travar os joelhos no topo.',
    ],
    commonMistakes: ['Amplitude incompleta', 'Joelhos para dentro'],
    thumbnailColor: '#4A5532',
  },
  {
    id: 'ex_plank',
    name: 'Prancha',
    muscleGroup: 'abs',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    instructions: [
      'Apoie antebraços e pontas dos pés.',
      'Mantenha o corpo alinhado por 30–60s.',
    ],
    commonMistakes: ['Quadril alto demais', 'Deixar a lombar cair'],
    thumbnailColor: '#553A32',
  },
  {
    id: 'ex_bike',
    name: 'Bike ergométrica',
    muscleGroup: 'cardio',
    secondaryMuscles: ['legs'],
    equipment: 'machine',
    instructions: [
      'Ajuste o banco e mantenha cadência constante.',
      'Alterne zonas de intensidade conforme o plano.',
    ],
    commonMistakes: ['Postura encolhida', 'Cadência irregular'],
    thumbnailColor: '#2A4555',
  },
  {
    id: 'ex_pushup',
    name: 'Flexão de braço',
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
    instructions: [
      'Corpo alinhado, mãos um pouco além da linha dos ombros.',
      'Desça o peito perto do chão e empurre.',
    ],
    commonMistakes: ['Quadril caindo', 'Abrir demais os cotovelos'],
    thumbnailColor: '#3D2A55',
  },
];

export const muscleFilterLabels: Record<MuscleGroup, string> = {
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

export const equipmentFilterLabels: Record<Equipment, string> = {
  machine: 'Máquina',
  dumbbell: 'Halter',
  barbell: 'Barra',
  cable: 'Cabo',
  bodyweight: 'Peso corporal',
};

export type CalendarDayStatus =
  | 'trained'
  | 'rest'
  | 'diet'
  | 'weight'
  | 'habit'
  | 'pr';

export interface CalendarDay {
  date: string;
  statuses: CalendarDayStatus[];
}

/** Calendário de agosto/2026 alinhado ao mock da Amanda */
export const mockCalendarDays: CalendarDay[] = [
  { date: '2026-08-01', statuses: ['rest', 'diet'] },
  { date: '2026-08-02', statuses: ['trained', 'diet', 'weight'] },
  { date: '2026-08-03', statuses: ['trained', 'diet', 'habit'] },
  { date: '2026-08-04', statuses: ['rest', 'diet'] },
  { date: '2026-08-05', statuses: ['trained', 'diet', 'pr'] },
  { date: '2026-08-06', statuses: ['trained', 'diet', 'habit'] },
  { date: '2026-08-07', statuses: ['rest', 'diet', 'weight'] },
  { date: '2026-08-08', statuses: ['trained', 'diet', 'pr'] },
  { date: '2026-08-09', statuses: ['trained', 'diet', 'weight'] },
  { date: '2026-08-10', statuses: ['rest', 'habit'] },
  { date: '2026-08-11', statuses: ['trained', 'diet', 'weight', 'habit'] },
];

export interface ProgressPhotoSet {
  id: string;
  date: string;
  label: string;
  angles: {
    front: string;
    side: string;
    back: string;
  };
}

export const mockProgressPhotos: ProgressPhotoSet[] = [
  {
    id: 'photo_before',
    date: '2026-07-11',
    label: 'Antes',
    angles: {
      front: '#3A3A45',
      side: '#32323C',
      back: '#2A2A33',
    },
  },
  {
    id: 'photo_after',
    date: '2026-08-11',
    label: 'Depois',
    angles: {
      front: '#2F3D45',
      side: '#3A2F45',
      back: '#2F4538',
    },
  },
];

export interface FoodAlternative {
  name: string;
  reason: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export const foodAlternatives: Record<string, FoodAlternative[]> = {
  'Arroz': [
    { name: 'Batata cozida', reason: 'Carboidrato similar por porção', calories: 130, proteinG: 2, carbsG: 30, fatG: 0 },
    { name: 'Macarrão integral', reason: 'Mantém energia para o treino', calories: 160, proteinG: 6, carbsG: 32, fatG: 1 },
    { name: 'Mandioca', reason: 'Alternativa densa em carboidrato', calories: 160, proteinG: 1, carbsG: 38, fatG: 0 },
    { name: 'Cuscuz', reason: 'Preparo rápido e familiar', calories: 140, proteinG: 4, carbsG: 28, fatG: 1 },
    { name: 'Quinoa', reason: 'Mais proteína vegetal', calories: 150, proteinG: 6, carbsG: 26, fatG: 2 },
  ],
  'Batata-doce': [
    { name: 'Arroz', reason: 'Troca clássica de carboidrato', calories: 160, proteinG: 3, carbsG: 35, fatG: 0 },
    { name: 'Inhame', reason: 'Perfil semelhante de amido', calories: 120, proteinG: 2, carbsG: 28, fatG: 0 },
    { name: 'Aveia', reason: 'Boa opção pré-treino', calories: 150, proteinG: 5, carbsG: 27, fatG: 3 },
  ],
  'Peito de frango grelhado': [
    { name: 'Peito de peru', reason: 'Proteína magra equivalente', calories: 135, proteinG: 29, carbsG: 0, fatG: 1 },
    { name: 'Tilápia', reason: 'Proteína magra de peixe', calories: 128, proteinG: 26, carbsG: 0, fatG: 3 },
    { name: 'Ovos', reason: 'Proteína versátil', calories: 140, proteinG: 12, carbsG: 1, fatG: 10 },
    { name: 'Tofu firme', reason: 'Opção vegetariana', calories: 120, proteinG: 14, carbsG: 3, fatG: 7 },
  ],
  'Aveia': [
    { name: 'Tapioca', reason: 'Preparo rápido', calories: 140, proteinG: 0, carbsG: 34, fatG: 0 },
    { name: 'Pão integral', reason: 'Praticidade no café', calories: 140, proteinG: 5, carbsG: 24, fatG: 2 },
  ],
  'Salmão': [
    { name: 'Sardinha', reason: 'Ômega-3 acessível', calories: 180, proteinG: 22, carbsG: 0, fatG: 10 },
    { name: 'Atum', reason: 'Proteína magra', calories: 130, proteinG: 28, carbsG: 0, fatG: 1 },
  ],
};

export interface ExerciseHistoryPoint {
  date: string;
  weightKg: number;
  reps: number;
}

export const exerciseUserHistory: Record<string, ExerciseHistoryPoint[]> = {
  ex_bench: [
    { date: '2026-07-14', weightKg: 55, reps: 12 },
    { date: '2026-07-28', weightKg: 57.5, reps: 12 },
    { date: '2026-08-04', weightKg: 60, reps: 12 },
    { date: '2026-08-08', weightKg: 80, reps: 5 },
  ],
  ex_row: [
    { date: '2026-07-20', weightKg: 45, reps: 10 },
    { date: '2026-08-01', weightKg: 50, reps: 10 },
    { date: '2026-08-05', weightKg: 70, reps: 6 },
  ],
};
