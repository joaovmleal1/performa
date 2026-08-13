import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

export function PageHeading({
  title,
  subtitle,
  eyebrow,
  right,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.pageHeading}>
      <View style={styles.pageCopy}>
        {eyebrow ? (
          <AppText variant="caption" color={colors.primary} style={styles.eyebrow}>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="h1">{title}</AppText>
        {subtitle ? (
          <AppText variant="body" muted>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
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

export function IconTile({
  icon,
  title,
  subtitle,
  onPress,
  accent = 'green',
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
      style={({ pressed }) => [
        styles.tile,
        accent === 'purple' && styles.tilePurple,
        accent === 'blue' && styles.tileBlue,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View
        style={[
          styles.tileIcon,
          accent === 'purple' && { backgroundColor: colors.secondaryMuted },
          accent === 'blue' && { backgroundColor: 'rgba(92,140,255,0.16)' },
        ]}
      >
        {icon}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyMedium">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" muted numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.8} />
    </Pressable>
  );
}

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
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyMedium" color={destructive ? colors.error : colors.text}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" muted>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="label" muted>
          {value}
        </AppText>
      ) : null}
      {onPress ? (
        <ChevronRight
          size={18}
          color={destructive ? colors.error : colors.textMuted}
          strokeWidth={1.8}
        />
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

const styles = StyleSheet.create({
  pageHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  pageCopy: { flex: 1, gap: spacing.xs },
  eyebrow: {
    fontFamily: 'Sora_600SemiBold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    minHeight: 76,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,255,133,0.18)',
    backgroundColor: colors.surfaceMedium,
  },
  tilePurple: { borderColor: 'rgba(123,92,255,0.25)' },
  tileBlue: { borderColor: 'rgba(92,140,255,0.22)' },
  tileIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  listRow: {
    minHeight: 58,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  listBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowPressed: { opacity: 0.68 },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillSuccess: { backgroundColor: colors.primaryMuted },
  pillPurple: { backgroundColor: colors.secondaryMuted },
  pillWarning: { backgroundColor: 'rgba(255,202,58,0.14)' },
});
