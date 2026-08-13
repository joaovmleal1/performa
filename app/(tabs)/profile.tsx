import {
  Bell,
  CircleHelp,
  Dumbbell,
  Flame,
  LogOut,
  Settings2,
  Target,
  UserRound,
  Utensils,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { PerformaMark } from '@/components/brand/PerformaLogo';
import {
  AppText,
  Avatar,
  Card,
  ListRow,
  ProgressBar,
  Screen,
} from '@/components/ui';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuthStore } from '@/stores/auth-store';
import { colors, spacing } from '@/theme';

/** Tela 15 — Perfil */
export default function ProfileScreen() {
  const router = useAppRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const name = user?.fullName ?? user?.name ?? 'Amanda Silva';
  const username = user?.username ?? 'amandasilva';
  const level = 12;
  const xp = 1230;
  const xpTarget = 2000;

  return (
    <Screen scroll>
      <View style={styles.brandRow}>
        <PerformaMark size={28} />
        <AppText variant="label" style={styles.brandWord}>
          PERFORMA
        </AppText>
      </View>

      <View style={styles.identity}>
        <Avatar name={name} size={96} />
        <AppText variant="h1" center style={{ marginTop: spacing.lg }}>
          {name}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} center>
          @{username}
        </AppText>
      </View>

      <Card style={styles.levelCard}>
        <AppText variant="label" color={colors.secondary}>
          Nível {level}
        </AppText>
        <ProgressBar
          progress={xp / xpTarget}
          color={colors.secondary}
          height={6}
          trackColor={colors.surfaceElevated}
        />
        <AppText variant="caption" color={colors.textMuted}>
          {xp.toLocaleString('pt-BR')} / {xpTarget.toLocaleString('pt-BR')} XP
        </AppText>
      </Card>

      <Card accent="green" style={styles.evoCard}>
        <View style={styles.evoRow}>
          <Flame size={20} color={colors.primary} strokeWidth={1.85} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyMedium">Você está evoluindo!</AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Continue firme e alcance seus objetivos.
            </AppText>
          </View>
        </View>
      </Card>

      <Card style={styles.menu} padded={false}>
        <ListRow
          icon={<UserRound size={20} color={colors.primary} strokeWidth={1.85} />}
          title="Dados pessoais"
          onPress={() => {}}
        />
        <ListRow
          icon={<Target size={20} color={colors.secondary} strokeWidth={1.85} />}
          title="Metas"
          onPress={() => {}}
        />
        <ListRow
          icon={<Settings2 size={20} color={colors.primary} strokeWidth={1.85} />}
          title="Preferências"
          onPress={() => {}}
        />
        <ListRow
          icon={<Dumbbell size={20} color={colors.secondary} strokeWidth={1.85} />}
          title="Treino"
          onPress={() => router.push('/(tabs)/workout')}
        />
        <ListRow
          icon={<Utensils size={20} color={colors.primary} strokeWidth={1.85} />}
          title="Nutrição"
          onPress={() => router.push('/(tabs)/nutrition')}
        />
        <ListRow
          icon={<Bell size={20} color={colors.secondary} strokeWidth={1.85} />}
          title="Notificações"
          onPress={() => {}}
        />
        <ListRow
          icon={<CircleHelp size={20} color={colors.primary} strokeWidth={1.85} />}
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
  identity: { alignItems: 'center', marginBottom: spacing.xl },
  levelCard: { gap: spacing.sm, marginBottom: spacing.md },
  evoCard: { marginBottom: spacing.lg },
  evoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menu: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  logout: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
});
