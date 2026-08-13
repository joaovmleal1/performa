import {
  Bell,
  BookOpen,
  CalendarDays,
  HelpCircle,
  LogOut,
  Repeat2,
  Scale,
  Target,
  UserRound,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Avatar,
  Card,
  ListRow,
  Screen,
  ScreenTitle,
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
      <ScreenTitle title="Perfil" />

      <Card style={styles.identity}>
        <Avatar name={name} size={72} />
        <AppText variant="h2" center>
          {name}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} center>
          @{user?.username ?? 'performa'} · {user?.streakDays ?? 0} dias de sequência
        </AppText>
        <AppButton
          label="Ver meu perfil"
          variant="secondary"
          size="md"
          onPress={() => router.push('/(tabs)/progress')}
        />
      </Card>

      <Card style={styles.group}>
        <ListRow
          icon={<UserRound size={18} color={colors.primary} strokeWidth={1.85} />}
          title="Dados pessoais"
          value={`${user?.weightKg ?? '—'} kg`}
          onPress={() => {}}
        />
        <ListRow
          icon={<Target size={18} color={colors.primary} strokeWidth={1.85} />}
          title="Objetivo"
          value={goalLabels[user?.goal ?? 'definition'] ?? '—'}
        />
        <ListRow
          icon={<Scale size={18} color={colors.secondary} strokeWidth={1.85} />}
          title="Medidas"
          value={`${user?.heightCm ?? '—'} cm`}
        />
        <ListRow
          icon={<Bell size={18} color={colors.info} strokeWidth={1.85} />}
          title="Notificações"
          onPress={() => {}}
          last
        />
      </Card>

      <Card style={styles.group}>
        <ListRow
          icon={<Repeat2 size={18} color={colors.primary} strokeWidth={1.85} />}
          title="Hábitos diários"
          onPress={() => router.push('/habits')}
        />
        <ListRow
          icon={<CalendarDays size={18} color={colors.secondary} strokeWidth={1.85} />}
          title="Calendário"
          onPress={() => router.push('/calendar')}
        />
        <ListRow
          icon={<BookOpen size={18} color={colors.info} strokeWidth={1.85} />}
          title="Biblioteca de exercícios"
          onPress={() => router.push('/exercises')}
        />
        <ListRow
          icon={<HelpCircle size={18} color={colors.primary} strokeWidth={1.85} />}
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
        <LogOut size={18} color={colors.error} strokeWidth={1.85} />
        <AppText variant="bodyMedium" color={colors.error}>
          Sair da conta
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  group: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  logout: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
