import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  HelpCircle,
  LogOut,
  Repeat2,
  Scale,
  Target,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { PerformaMark } from '@/components/brand/PerformaLogo';
import {
  AppText,
  Avatar,
  Card,
  ListRow,
  PageHeading,
  Screen,
  StatusPill,
} from '@/components/ui';
import { goalLabels } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuthStore } from '@/stores/auth-store';
import { colors, spacing } from '@/theme';

export default function ProfileScreen() {
  const router = useAppRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const name = user?.fullName ?? user?.name ?? 'Atleta';

  return (
    <Screen scroll>
      <PageHeading
        eyebrow="Conta"
        title="Perfil"
        subtitle="Seus dados, metas e preferências."
        right={<PerformaMark size={38} />}
      />

      <Card style={styles.identity}>
        <Avatar name={name} size={68} />
        <View style={styles.identityCopy}>
          <AppText variant="h2">{name}</AppText>
          <AppText variant="caption" muted>
            @{user?.username ?? 'performa'} · {user?.email ?? '—'}
          </AppText>
          <StatusPill
            label={`${user?.streakDays ?? 0} dias de sequência`}
            tone="success"
          />
        </View>
      </Card>

      <AppText variant="label" muted style={styles.sectionLabel}>
        SEU PLANO
      </AppText>
      <Card style={styles.group}>
        <ListRow
          icon={<Target size={18} color={colors.primary} />}
          title="Objetivo"
          value={goalLabels[user?.goal ?? 'definition'] ?? '—'}
        />
        <ListRow
          icon={<Scale size={18} color={colors.secondary} />}
          title="Medidas"
          value={`${user?.weightKg ?? '—'} kg · ${user?.heightCm ?? '—'} cm`}
        />
        <ListRow
          icon={<Repeat2 size={18} color={colors.info} />}
          title="Rotina"
          value={`${user?.trainingDaysPerWeek ?? '—'} treinos/sem`}
          last
        />
      </Card>

      <AppText variant="label" muted style={styles.sectionLabel}>
        RECURSOS
      </AppText>
      <Card style={styles.group}>
        <ListRow
          icon={<Repeat2 size={18} color={colors.primary} />}
          title="Hábitos diários"
          onPress={() => router.push('/habits')}
        />
        <ListRow
          icon={<CalendarDays size={18} color={colors.secondary} />}
          title="Calendário"
          onPress={() => router.push('/calendar')}
        />
        <ListRow
          icon={<BookOpen size={18} color={colors.info} />}
          title="Biblioteca de exercícios"
          onPress={() => router.push('/exercises')}
        />
        <ListRow
          icon={<HelpCircle size={18} color={colors.primary} />}
          title="Ajuda e suporte"
          onPress={() => router.push('/ai')}
          last
        />
      </Card>

      <Pressable
        onPress={() => {
          logout();
          router.replace('/(auth)/login');
        }}
        accessibilityRole="button"
        style={({ pressed }) => [styles.logout, pressed && { opacity: 0.65 }]}
      >
        <LogOut size={18} color={colors.error} />
        <AppText variant="bodyMedium" color={colors.error}>
          Sair da conta
        </AppText>
        <ChevronRight size={18} color={colors.error} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  identityCopy: { flex: 1, gap: spacing.xs },
  sectionLabel: {
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  group: {
    paddingVertical: 0,
    marginBottom: spacing.lg,
  },
  logout: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
