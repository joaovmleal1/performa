import { Image } from 'expo-image';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Chip, Input, Screen, ScreenHeader } from '@/components/ui';
import { getExerciseGifUrl } from '@/data/exercises';
import {
  equipmentLabels,
  mockExercises,
  muscleGroupLabels,
} from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import type { Equipment, MuscleGroup } from '@/types';
import { colors, radius, spacing } from '@/theme';

const MUSCLES = Object.keys(muscleGroupLabels) as MuscleGroup[];
const EQUIPMENT = Object.keys(equipmentLabels) as Equipment[];

export default function ExerciseLibraryScreen() {
  const router = useAppRouter();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all');
  const [equipment, setEquipment] = useState<Equipment | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockExercises.filter((ex) => {
      const matchesQuery = !q || ex.name.toLowerCase().includes(q);
      const matchesMuscle = muscle === 'all' || ex.muscleGroup === muscle;
      const matchesEquipment = equipment === 'all' || ex.equipment === equipment;
      return matchesQuery && matchesMuscle && matchesEquipment;
    });
  }, [query, muscle, equipment]);

  return (
    <Screen padded={false}>
      <ScreenHeader title="Biblioteca" showBack />
      <View style={styles.content}>
        <Input
          placeholder="Buscar exercício"
          value={query}
          onChangeText={setQuery}
          leftIcon={<Search size={18} color={colors.textMuted} />}
        />

        <AppText variant="caption" muted>
          {filtered.length} exercícios com GIF de execução
        </AppText>

        <AppText variant="label" muted style={styles.filterLabel}>
          Grupo muscular
        </AppText>
        <View style={styles.chips}>
          <Chip
            label="Todos"
            selected={muscle === 'all'}
            onPress={() => setMuscle('all')}
          />
          {MUSCLES.map((m) => (
            <Chip
              key={m}
              label={muscleGroupLabels[m]}
              selected={muscle === m}
              onPress={() => setMuscle(m)}
            />
          ))}
        </View>

        <AppText variant="label" muted style={styles.filterLabel}>
          Equipamento
        </AppText>
        <View style={styles.chips}>
          <Chip
            label="Todos"
            selected={equipment === 'all'}
            onPress={() => setEquipment('all')}
          />
          {EQUIPMENT.map((e) => (
            <Chip
              key={e}
              label={equipmentLabels[e]}
              selected={equipment === e}
              onPress={() => setEquipment(e)}
            />
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={16}
          windowSize={8}
          ListEmptyComponent={
            <AppText muted center>
              Nenhum exercício encontrado.
            </AppText>
          }
          renderItem={({ item }) => {
            const gif =
              getExerciseGifUrl(item) ??
              item.gifUrl ??
              `/exercises/${item.id}.gif`;
            return (
              <Pressable
                style={styles.row}
                onPress={() => router.push(`/exercises/${item.id}`)}
                accessibilityRole="button"
              >
                <Image
                  source={{ uri: gif }}
                  style={styles.thumb}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  recyclingKey={item.id}
                />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyMedium">{item.name}</AppText>
                  <AppText variant="caption" muted>
                    {muscleGroupLabels[item.muscleGroup]} · {equipmentLabels[item.equipment]}
                  </AppText>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterLabel: { marginTop: spacing.sm },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing['5xl'],
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: '#fff',
  },
});
