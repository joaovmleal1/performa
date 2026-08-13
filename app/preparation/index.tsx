import { Flag, Target } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  Chip,
  Input,
  Screen,
  ScreenHeader,
} from '@/components/ui';
import { loadLabels, phaseKindLabels } from '@/lib/periodization';
import { useAuthStore } from '@/stores/auth-store';
import { colors, radius, spacing } from '@/theme';
import { useMemo, useState } from 'react';

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

export default function PreparationScreen() {
  const user = useAuthStore((s) => s.user);
  const activatePreparationMode = useAuthStore((s) => s.activatePreparationMode);
  const deactivatePreparationMode = useAuthStore((s) => s.deactivatePreparationMode);

  const [sport, setSport] = useState(user?.preparationSport ?? '');
  const [competitionName, setCompetitionName] = useState(user?.competitionName ?? '');
  const [competitionDate, setCompetitionDate] = useState(user?.competitionDate ?? '');

  const plan = user?.periodization;
  const active = Boolean(user?.preparationMode && plan);

  const canSave = useMemo(
    () => Boolean(sport.trim() && competitionName.trim() && /^\d{4}-\d{2}-\d{2}$/.test(competitionDate)),
    [sport, competitionName, competitionDate],
  );

  return (
    <Screen scroll>
      <ScreenHeader title="Modo preparação" showBack />

      <AppText variant="body" muted style={{ marginBottom: spacing.lg }}>
        Ative para montar a periodização completa até a sua competição.
      </AppText>

      {active && plan ? (
        <Card accent="purple" style={styles.hero}>
          <View style={styles.heroRow}>
            <Flag size={18} color={colors.secondary} />
            <AppText variant="h3">Preparação ativa</AppText>
          </View>
          <AppText variant="bodyMedium">{plan.competitionName}</AppText>
          <AppText variant="caption" muted>
            {plan.sport} · prova em {plan.competitionDate} · {plan.totalWeeks} semanas
          </AppText>
        </Card>
      ) : null}

      <Card style={styles.form}>
        <AppText variant="h3">Esporte ou modalidade</AppText>
        <View style={styles.chips}>
          {SPORT_SUGGESTIONS.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={sport === item}
              onPress={() => setSport(item)}
            />
          ))}
        </View>
        <Input
          label="Esporte (personalizado)"
          placeholder="Ex.: Powerlifting"
          value={SPORT_SUGGESTIONS.includes(sport) ? '' : sport}
          onChangeText={setSport}
        />
        <Input
          label="Competição"
          placeholder="Nome da prova ou campeonato"
          value={competitionName}
          onChangeText={setCompetitionName}
        />
        <Input
          label="Data da competição"
          placeholder="AAAA-MM-DD"
          value={competitionDate}
          onChangeText={setCompetitionDate}
          autoCapitalize="none"
        />
        <AppButton
          label={active ? 'Atualizar periodização' : 'Ativar modo preparação'}
          disabled={!canSave}
          onPress={() =>
            activatePreparationMode({
              sport,
              competitionName,
              competitionDate,
            })
          }
        />
        {active ? (
          <AppButton
            label="Desativar modo preparação"
            variant="ghost"
            onPress={deactivatePreparationMode}
          />
        ) : null}
      </Card>

      {plan ? (
        <View style={styles.timeline}>
          <View style={styles.heroRow}>
            <Target size={18} color={colors.primary} />
            <AppText variant="h3">Periodização completa</AppText>
          </View>
          {plan.phases.map((phase, index) => (
            <Card key={phase.id} style={styles.phase}>
              <AppText variant="caption" color={colors.primary}>
                Fase {index + 1} · {phaseKindLabels[phase.kind]} · {phase.weeks} sem
              </AppText>
              <AppText variant="bodyMedium">{phase.name}</AppText>
              <AppText variant="caption" muted>
                {phase.focus}
              </AppText>
              <AppText variant="caption" muted>
                Volume {loadLabels[phase.volume]} · Intensidade {loadLabels[phase.intensity]}
              </AppText>
              {phase.notes.map((note) => (
                <AppText key={note} variant="caption" muted>
                  • {note}
                </AppText>
              ))}
            </Card>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.sm, marginBottom: spacing.lg },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  form: { gap: spacing.md, marginBottom: spacing.xl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeline: { gap: spacing.sm, paddingBottom: spacing['4xl'] },
  phase: {
    gap: 6,
    borderRadius: radius.md,
  },
});

