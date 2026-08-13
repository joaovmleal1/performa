import { Check, Play, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { formCatalog } from '@/data/form';
import { useAppRouter } from '@/hooks/useAppRouter';
import { colors, radius, spacing } from '@/theme';

type Props = {
  /** Compacto para listas densas */
  compact?: boolean;
};

export function TechniquePromoCard({ compact }: Props) {
  const router = useAppRouter();
  const bothCount = formCatalog.filter((l) => l.formType === 'both').length;
  const total = formCatalog.length;

  return (
    <Card
      accent="green"
      onPress={() => router.push('/technique')}
      accessibilityLabel="Abrir técnica: certo e errado"
      style={compact ? styles.compact : undefined}
    >
      <View style={styles.row}>
        <View style={styles.badgePair}>
          <View style={[styles.badge, styles.badgeOk]}>
            <Check size={14} color={colors.onPrimary} strokeWidth={2.5} />
          </View>
          <View style={[styles.badge, styles.badgeBad]}>
            <X size={14} color={colors.white} strokeWidth={2.5} />
          </View>
        </View>
        <View style={styles.copy}>
          <AppText variant="h3">Certo × Errado</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {compact
              ? `${total} vídeos de técnica`
              : `Veja a execução certa e os erros comuns · ${bothCount} comparativos · ${total} vídeos`}
          </AppText>
        </View>
        <View style={styles.play}>
          <Play size={16} color={colors.onPrimary} fill={colors.onPrimary} />
        </View>
      </View>
      {!compact ? (
        <View style={styles.cta}>
          <AppText variant="label" color={colors.onPrimary}>
            Aprender técnica
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  compact: { paddingVertical: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badgePair: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOk: {
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  badgeBad: {
    backgroundColor: colors.error,
    marginLeft: -8,
  },
  copy: { flex: 1, gap: 2 },
  play: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
});
