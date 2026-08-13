import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Avatar,
  Card,
  Screen,
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
      <View style={styles.header}>
        <Avatar name={name} size={72} />
        <AppText variant="h1" style={{ marginTop: spacing.md }}>
          {name}
        </AppText>
        <AppText variant="body" muted>
          @{user?.username ?? 'performa'}
        </AppText>
      </View>

      <Card style={styles.section}>
        <Row label="E-mail" value={user?.email ?? '—'} />
        <Row label="Objetivo" value={goalLabels[user?.goal ?? 'definition'] ?? '—'} />
        <Row label="Peso" value={`${user?.weightKg ?? '—'} kg`} />
        <Row label="Altura" value={`${user?.heightCm ?? '—'} cm`} />
        <Row label="Experiência" value={user?.experience ?? '—'} />
        <Row label="Treinos/semana" value={`${user?.trainingDaysPerWeek ?? '—'}`} />
        <Row label="Sequência" value={`${user?.streakDays ?? 0} dias`} />
      </Card>

      <AppButton
        label="Hábitos diários"
        variant="secondary"
        onPress={() => router.push('/habits')}
      />
      <AppButton
        label="Calendário"
        variant="secondary"
        onPress={() => router.push('/calendar')}
        style={{ marginTop: spacing.sm }}
      />
      <AppButton
        label="Coach Especialista"
        variant="ai"
        onPress={() => router.push('/ai')}
        style={{ marginTop: spacing.sm }}
      />
      <AppButton
        label="Configurar OpenRouter"
        variant="secondary"
        onPress={() => router.push('/ai/settings')}
        style={{ marginTop: spacing.sm }}
      />
      <AppButton
        label="Biblioteca de exercícios"
        variant="ghost"
        onPress={() => router.push('/exercises')}
        style={{ marginTop: spacing.sm }}
      />

      <AppButton
        label="Sair da conta"
        variant="danger"
        onPress={() => {
          logout();
          router.replace('/(auth)/login');
        }}
        style={{ marginTop: spacing.md }}
      />
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xl },
  section: { gap: spacing.md, marginBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
    paddingVertical: spacing.sm,
  },
});
