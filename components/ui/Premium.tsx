import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

/** Saudação do dashboard — board 04 */
export function Greeting({
  name,
  subtitle,
}: {
  name: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.greeting}>
      <AppText variant="h1">Olá, {name}!</AppText>
      {subtitle ? (
        <AppText variant="body" color={colors.textSecondary}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

/** Título de tela sem eyebrow de marketing */
export function ScreenTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.screenTitle}>
      <View style={styles.screenTitleCopy}>
        <AppText variant="h1">{title}</AppText>
        {subtitle ? (
          <AppText variant="body" color={colors.textSecondary}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** @deprecated use ScreenTitle / Greeting */
export function PageHeading({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  right?: ReactNode;
}) {
  return <ScreenTitle title={title} subtitle={subtitle} right={right} />;
}

export function SectionHeading({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <AppText variant="h3">{title}</AppText>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <AppText variant="label" color={colors.primary}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

/**
 * Linha de menu no estilo do board:
 * ícone outline sem caixa colorida · texto · valor · chevron
 */
export function ListRow({
  icon,
  title,
  value,
  subtitle,
  onPress,
  destructive,
  last,
}: {
  icon?: ReactNode;
  title: string;
  value?: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
  last?: boolean;
}) {
  const content = (
    <>
      {icon ? <View style={styles.rowIcon}>{icon}</View> : null}
      <View style={styles.rowCopy}>
        <AppText variant="body" color={destructive ? colors.error : colors.text}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="label" color={colors.textMuted}>
          {value}
        </AppText>
      ) : null}
      {onPress && !destructive ? (
        <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.75} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ pressed }) => [
          styles.listRow,
          !last && styles.listBorder,
          pressed && styles.rowPressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.listRow, !last && styles.listBorder]}>{content}</View>;
}

export function StatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'success' | 'purple' | 'warning' | 'neutral';
}) {
  return (
    <View
      style={[
        styles.pill,
        tone === 'success' && styles.pillSuccess,
        tone === 'purple' && styles.pillPurple,
        tone === 'warning' && styles.pillWarning,
      ]}
    >
      <AppText
        variant="caption"
        color={
          tone === 'success'
            ? colors.primary
            : tone === 'purple'
              ? colors.secondary
              : tone === 'warning'
                ? colors.warning
                : colors.textSecondary
        }
      >
        {label}
      </AppText>
    </View>
  );
}

/** Mantido só para compat; não usar em layouts novos */
export function IconTile({
  icon,
  title,
  subtitle,
  onPress,
  style,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  accent?: 'green' | 'purple' | 'blue';
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.legacyTile, pressed && styles.rowPressed, style]}
    >
      {icon}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyMedium">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textMuted} numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  greeting: {
    gap: spacing.xs,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  screenTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  screenTitleCopy: { flex: 1, gap: spacing.xs },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  listRow: {
    minHeight: 52,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  listBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, gap: 2 },
  rowPressed: { opacity: 0.65 },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMedium,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillSuccess: { backgroundColor: colors.primaryMuted },
  pillPurple: { backgroundColor: colors.secondaryMuted },
  pillWarning: { backgroundColor: 'rgba(255,202,58,0.14)' },
  legacyTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
});
