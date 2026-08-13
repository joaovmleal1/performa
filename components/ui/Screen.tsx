import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppShell } from '@/hooks/useAppShell';
import { colors, layout, spacing } from '@/theme';

export function Screen({
  children,
  scroll,
  style,
  contentStyle,
  edges = ['top', 'left', 'right'],
  padded = true,
}: {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  padded?: boolean;
}) {
  const { screenStyle } = useAppShell();

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[
        padded && styles.padding,
        styles.scrollContent,
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded && styles.padding, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.safe, screenStyle, style]}>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  padding: {
    paddingHorizontal: layout.screenPadding,
  },
  scrollContent: {
    paddingBottom: spacing['6xl'],
    flexGrow: 1,
  },
});
