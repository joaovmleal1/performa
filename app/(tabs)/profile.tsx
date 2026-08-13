import {
  Bell,
  BookOpen,
  CalendarDays,
  HelpCircle,
  Repeat2,
  Scale,
  Target,
  UserRound,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { PerformaMark } from '@/components/brand/PerformaLogo';
import {
  AppButton,
  AppText,
  Avatar,
  Card,
  ListRow,
  Screen,
} from '@/components/ui';
import { goalLabels } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuthStore } from '@/stores/auth-store';
import { colors, spacing } from '@/theme';

const ICON = {
  size: 20,
  color: colors.textSecondary,
  strokeWidth: 1.75,
} as const;

export default function ProfileScreen() {
  const router = useAppRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const name = user?.fullName ?? user?.name ?? 'Atleta';

  return (
    <Screen scroll>
      <View style={styles.brandRow}>
        <PerformaMark size={28} />
        <AppText variant="label" style={styles.brandWord}>
          PERFORMA
        </AppText>
      </View>

      <View style={styles.identity}>
        <Avatar name={name} size={88} />
        <AppText variant="h1" center style={styles.name}>
          {name}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} center>
          @{user?.username ?? 'performa'}
        </AppText>
        <AppText variant="label" color={colors.primary} center style={styles.streak}>
          {user?.streakDays ?? 0} dias de sequência
        </AppText>
        <AppButton
          label="Ver meu perfil"
          size="md"
          onPress={() => router.push('/(tabs)/progress')}
          style={styles.cta}
        />
      </View>

      <Card style={styles.menu}>
        <ListRow
          icon={<UserRound {...ICON} />}
          title="Dados pessoais"
          value={`${user?.weightKg ?? '—'} kg`}
          onPress={() => {}}
        />
        <ListRow
          icon={<Target {...ICON} />}
          title="Objetivo"
          value={goalLabels[user?.goal ?? 'definition'] ?? '—'}
          onPress={() => {}}
        />
        <ListRow
          icon={<Scale {...ICON} />}
          title="Medidas"
          value={`${user?.heightCm ?? '—'} cm`}
          onPress={() => {}}
        />
        <ListRow
          icon={<Bell {...ICON} />}
          title="Notificações"
          onPress={() => {}}
        />
        <ListRow
          icon={<Repeat2 {...ICON} />}
          title="Hábitos diários"
          onPress={() => router.push('/habits')}
        />
        <ListRow
          icon={<CalendarDays {...ICON} />}
          title="Calendário"
          onPress={() => router.push('/calendar')}
        />
        <ListRow
          icon={<BookOpen {...ICON} />}
          title="Biblioteca de exercícios"
          onPress={() => router.push('/exercises')}
        />
        <ListRow
          icon={<HelpCircle {...ICON} />}
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
        style={({ pressed }) => [styles.logout, pressed && { opacity: 0.6 }]}
      >
        <AppText variant="bodyMedium" color={colors.error}>
          Sair da conta
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing['2xl'],
  },
  brandWord: {
    letterSpacing: 2,
    color: colors.white,
    fontStyle: 'italic',
    fontFamily: 'Sora_800ExtraBold',
  },
  identity: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  name: {
    marginTop: spacing.lg,
  },
  streak: {
    marginTop: spacing.sm,
  },
  cta: {
    marginTop: spacing.xl,
    maxWidth: 280,
  },
  menu: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  logout: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
});
