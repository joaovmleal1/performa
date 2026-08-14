import { ChevronLeft } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors, hitSlop, layout, spacing } from '@/theme';

import { AppText } from './Text';

export function ScreenHeader({
  title,
  subtitle,
  showBack,
  right,
  onBack,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
  onBack?: () => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={hitSlop.md}
            onPress={() => (onBack ? onBack() : router.back())}
            style={styles.back}
          >
            <ChevronLeft color={colors.white} size={24} strokeWidth={1.85} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.center}>
          <AppText variant="h3" center>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" tone="muted" center>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 56,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: layout.screenPadding,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.surfaceMedium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backPlaceholder: { width: layout.minTouchTarget },
  center: { flex: 1, paddingHorizontal: spacing.sm },
  right: {
    minWidth: layout.minTouchTarget,
    alignItems: 'flex-end',
  },
});
