import { Image } from 'expo-image';
import {
  Check,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppText, Input, Screen, ScreenHeader } from '@/components/ui';
import {
  formCatalog,
  formMuscleLabels,
  formTypeLabels,
  type FormLesson,
  type FormMuscleGroup,
  type FormType,
} from '@/data/form';
import { useAppRouter } from '@/hooks/useAppRouter';
import { colors, radius, spacing } from '@/theme';

const MUSCLES = Object.keys(formMuscleLabels) as FormMuscleGroup[];
const TYPES = Object.keys(formTypeLabels) as FormType[];

const TYPE_SHORT: Record<FormType | 'all', string> = {
  all: 'Todos',
  both: 'Certo × errado',
  correct: 'Correto',
  incorrect: 'Erro',
  guide: 'Guia',
};

export default function TechniqueLibraryScreen() {
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<FormMuscleGroup | 'all'>('all');
  const [formType, setFormType] = useState<FormType | 'all'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftMuscle, setDraftMuscle] = useState<FormMuscleGroup | 'all'>('all');
  const [draftType, setDraftType] = useState<FormType | 'all'>('all');

  const activeFilterCount =
    (formType !== 'all' ? 1 : 0) + (muscle !== 'all' ? 1 : 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return formCatalog.filter((lesson) => {
      const matchesQuery =
        !q ||
        lesson.name.toLowerCase().includes(q) ||
        lesson.summary.toLowerCase().includes(q) ||
        formMuscleLabels[lesson.muscleGroup].toLowerCase().includes(q);
      const matchesMuscle = muscle === 'all' || lesson.muscleGroup === muscle;
      const matchesType = formType === 'all' || lesson.formType === formType;
      return matchesQuery && matchesMuscle && matchesType;
    });
  }, [query, muscle, formType]);

  const openFilters = () => {
    setDraftMuscle(muscle);
    setDraftType(formType);
    setFiltersOpen(true);
  };

  const applyFilters = () => {
    setMuscle(draftMuscle);
    setFormType(draftType);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setMuscle('all');
    setFormType('all');
    setDraftMuscle('all');
    setDraftType('all');
  };

  return (
    <Screen padded={false}>
      <ScreenHeader title="Técnica" showBack />

      <View style={styles.content}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          initialNumToRender={10}
          windowSize={8}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.headerBlock}>
              <View style={styles.titleRow}>
                <AppText variant="body" muted style={{ flex: 1 }}>
                  Como fazer e como não fazer
                </AppText>
                <AppText variant="caption" color={colors.primary}>
                  {filtered.length} vídeos
                </AppText>
              </View>

              <Input
                placeholder="Buscar exercício"
                value={query}
                onChangeText={setQuery}
                leftIcon={<Search size={18} color={colors.textMuted} />}
              />

              <View style={styles.toolbar}>
                <Pressable
                  onPress={openFilters}
                  style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.85 }]}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir filtros"
                >
                  <SlidersHorizontal size={16} color={colors.onPrimary} />
                  <AppText variant="label" color={colors.onPrimary}>
                    Filtros
                  </AppText>
                  {activeFilterCount > 0 ? (
                    <View style={styles.filterCount}>
                      <AppText variant="caption" color={colors.onPrimary}>
                        {activeFilterCount}
                      </AppText>
                    </View>
                  ) : (
                    <ChevronDown size={16} color={colors.onPrimary} />
                  )}
                </Pressable>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.quickTypes}
                >
                  {(['all', ...TYPES] as const).map((type) => {
                    const selected = formType === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setFormType(type)}
                        style={[styles.quickChip, selected && styles.quickChipSelected]}
                      >
                        <AppText
                          variant="caption"
                          color={selected ? colors.onPrimary : colors.textSecondary}
                        >
                          {TYPE_SHORT[type]}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {activeFilterCount > 0 ? (
                <View style={styles.activeRow}>
                  {formType !== 'all' ? (
                    <ActivePill
                      label={formTypeLabels[formType]}
                      onClear={() => setFormType('all')}
                    />
                  ) : null}
                  {muscle !== 'all' ? (
                    <ActivePill
                      label={formMuscleLabels[muscle]}
                      onClear={() => setMuscle('all')}
                    />
                  ) : null}
                  <Pressable onPress={clearFilters} hitSlop={8}>
                    <AppText variant="caption" color={colors.primary}>
                      Limpar
                    </AppText>
                  </Pressable>
                </View>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Filter size={28} color={colors.textMuted} />
              <AppText muted center>
                Nenhum vídeo com esses filtros.
              </AppText>
              <AppButton label="Limpar filtros" variant="ghost" onPress={clearFilters} />
            </View>
          }
          renderItem={({ item }) => (
            <TechniqueCard
              lesson={item}
              onPress={() => router.push(`/technique/${item.id}`)}
            />
          )}
        />
      </View>

      <Modal
        visible={filtersOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setFiltersOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setFiltersOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <AppText variant="h3">Filtros</AppText>
            <Pressable onPress={() => setFiltersOpen(false)} hitSlop={12}>
              <X size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <AppText variant="label" muted style={styles.sheetSection}>
            Tipo de vídeo
          </AppText>
          <View style={styles.sheetChips}>
            <SheetChip
              label="Todos"
              selected={draftType === 'all'}
              onPress={() => setDraftType('all')}
            />
            {TYPES.map((type) => (
              <SheetChip
                key={type}
                label={formTypeLabels[type]}
                selected={draftType === type}
                onPress={() => setDraftType(type)}
              />
            ))}
          </View>

          <AppText variant="label" muted style={styles.sheetSection}>
            Grupo muscular
          </AppText>
          <View style={styles.sheetChips}>
            <SheetChip
              label="Todos"
              selected={draftMuscle === 'all'}
              onPress={() => setDraftMuscle('all')}
            />
            {MUSCLES.map((m) => (
              <SheetChip
                key={m}
                label={formMuscleLabels[m]}
                selected={draftMuscle === m}
                onPress={() => setDraftMuscle(m)}
              />
            ))}
          </View>

          <View style={styles.sheetActions}>
            <AppButton
              label="Limpar"
              variant="ghost"
              onPress={() => {
                setDraftType('all');
                setDraftMuscle('all');
              }}
              style={{ flex: 1 }}
            />
            <AppButton label="Aplicar" onPress={applyFilters} style={{ flex: 1 }} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function TechniqueCard({
  lesson,
  onPress,
}: {
  lesson: FormLesson;
  onPress: () => void;
}) {
  const status = statusFor(lesson.formType);
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${lesson.name}, ${formTypeLabels[lesson.formType]}`}
    >
      <View style={styles.thumbWrap}>
        <Image
          source={{ uri: lesson.thumbnailUrl }}
          style={styles.thumb}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View style={[styles.statusDot, { backgroundColor: status.bg }]}>
          {status.icon}
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.badges}>
          <Badge label={formTypeLabels[lesson.formType]} tone={status.tone} />
          <Badge label={formMuscleLabels[lesson.muscleGroup]} tone="neutral" />
        </View>
        <AppText variant="bodyMedium" numberOfLines={2}>
          {lesson.name}
        </AppText>
        <AppText variant="caption" muted numberOfLines={2}>
          {lesson.summary}
        </AppText>
      </View>
    </Pressable>
  );
}

function statusFor(formType: FormType): {
  tone: 'ok' | 'danger' | 'neutral';
  bg: string;
  icon: ReactNode;
} {
  if (formType === 'incorrect') {
    return {
      tone: 'danger',
      bg: colors.error,
      icon: <X size={12} color="#fff" strokeWidth={3} />,
    };
  }
  if (formType === 'correct' || formType === 'both') {
    return {
      tone: 'ok',
      bg: colors.primary,
      icon: <Check size={12} color={colors.onPrimary} strokeWidth={3} />,
    };
  }
  return {
    tone: 'neutral',
    bg: colors.secondary,
    icon: <SlidersHorizontal size={11} color="#fff" />,
  };
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
        ? colors.errorMuted
        : colors.surfaceHighlight;
  const fg =
    tone === 'ok' ? colors.primary : tone === 'danger' ? colors.error : colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <AppText variant="caption" color={fg} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

function ActivePill({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <Pressable onPress={onClear} style={styles.activePill}>
      <AppText variant="caption" color={colors.text}>
        {label}
      </AppText>
      <X size={12} color={colors.textMuted} />
    </Pressable>
  );
}

function SheetChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.sheetChip, selected && styles.sheetChipSelected]}
    >
      <AppText
        variant="caption"
        color={selected ? colors.onPrimary : colors.textSecondary}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  headerBlock: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  filterCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  quickTypes: {
    gap: 8,
    paddingRight: spacing.lg,
    alignItems: 'center',
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  quickChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['5xl'],
    gap: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing['3xl'],
  },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  thumbWrap: {
    width: 92,
    height: 118,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  thumb: { width: '100%', height: '100%' },
  statusDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 6, justifyContent: 'center', minWidth: 0 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    maxWidth: '100%',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    maxHeight: '78%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sheetSection: { marginTop: spacing.sm },
  sheetChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sheetChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  sheetChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
