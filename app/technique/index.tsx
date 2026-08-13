import { Image } from 'expo-image';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Chip, Input, Screen, ScreenHeader } from '@/components/ui';
import {
  formCatalog,
  formMuscleLabels,
  formTypeLabels,
  type FormMuscleGroup,
  type FormType,
} from '@/data/form';
import { useAppRouter } from '@/hooks/useAppRouter';
import { colors, radius, spacing } from '@/theme';

const MUSCLES = Object.keys(formMuscleLabels) as FormMuscleGroup[];
const TYPES = Object.keys(formTypeLabels) as FormType[];

export default function TechniqueLibraryScreen() {
  const router = useAppRouter();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<FormMuscleGroup | 'all'>('all');
  const [formType, setFormType] = useState<FormType | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return formCatalog.filter((lesson) => {
      const matchesQuery =
        !q ||
        lesson.name.toLowerCase().includes(q) ||
        lesson.summary.toLowerCase().includes(q);
      const matchesMuscle = muscle === 'all' || lesson.muscleGroup === muscle;
      const matchesType = formType === 'all' || lesson.formType === formType;
      return matchesQuery && matchesMuscle && matchesType;
    });
  }, [query, muscle, formType]);

  return (
    <Screen padded={false}>
      <ScreenHeader title="Técnica" showBack />
      <View style={styles.content}>
        <AppText variant="body" muted>
          Aprenda como fazer — e como não fazer — cada exercício.
        </AppText>
        <AppText variant="caption" muted>
          {filtered.length} vídeos educativos
        </AppText>

        <Input
          placeholder="Buscar exercício ou técnica"
          value={query}
          onChangeText={setQuery}
          leftIcon={<Search size={18} color={colors.textMuted} />}
        />

        <AppText variant="label" muted style={styles.filterLabel}>
          Tipo
        </AppText>
        <View style={styles.chips}>
          <Chip label="Todos" selected={formType === 'all'} onPress={() => setFormType('all')} />
          {TYPES.map((type) => (
            <Chip
              key={type}
              label={formTypeLabels[type]}
              selected={formType === type}
              onPress={() => setFormType(type)}
            />
          ))}
        </View>

        <AppText variant="label" muted style={styles.filterLabel}>
          Grupo muscular
        </AppText>
        <View style={styles.chips}>
          <Chip label="Todos" selected={muscle === 'all'} onPress={() => setMuscle('all')} />
          {MUSCLES.map((m) => (
            <Chip
              key={m}
              label={formMuscleLabels[m]}
              selected={muscle === m}
              onPress={() => setMuscle(m)}
            />
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          windowSize={8}
          ListEmptyComponent={
            <AppText muted center>
              Nenhum vídeo encontrado.
            </AppText>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/technique/${item.id}`)}
              accessibilityRole="button"
            >
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.thumb}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <View style={styles.cardBody}>
                <View style={styles.badges}>
                  <Badge
                    label={formTypeLabels[item.formType]}
                    tone={
                      item.formType === 'incorrect'
                        ? 'danger'
                        : item.formType === 'correct' || item.formType === 'both'
                          ? 'ok'
                          : 'neutral'
                    }
                  />
                  <Badge label={formMuscleLabels[item.muscleGroup]} tone="neutral" />
                </View>
                <AppText variant="bodyMedium">{item.name}</AppText>
                <AppText variant="caption" muted>
                  {item.summary}
                </AppText>
              </View>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: 'ok' | 'danger' | 'neutral';
}) {
  const bg =
    tone === 'ok'
      ? colors.primaryMuted
      : tone === 'danger'
        ? 'rgba(255,80,80,0.15)'
        : colors.surfaceHighlight;
  const fg =
    tone === 'ok' ? colors.primary : tone === 'danger' ? '#FF6B6B' : colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <AppText variant="caption" color={fg}>
        {label}
      </AppText>
    </View>
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
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  thumb: {
    width: 88,
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  cardBody: { flex: 1, gap: 4, justifyContent: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 2 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
});
