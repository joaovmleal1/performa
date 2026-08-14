import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppShell } from '@/hooks/useAppShell';
import { colors, layout, spacing } from '@/theme';

export function Screen({
  children,
  scroll,
  style,
  contentStyle,
  edges = ['top', 'left', 'right'],
  padded = true,
  /** Reserve espaço da tab bar absoluta (usar nas telas de `(tabs)`) */
  tabBarInset = false,
}: {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  padded?: boolean;
  tabBarInset?: boolean;
}) {
  const { screenStyle } = useAppShell();
  const insets = useSafeAreaInsets();

  // Altura real da tab bar em `_layout`: (bottomNavHeight - 8) + max(inset, 10)
  const tabBarHeight = layout.bottomNavHeight - 8 + Math.max(insets.bottom, 10);
  const bottomPad = tabBarInset
    ? tabBarHeight + spacing['2xl']
    : spacing['3xl'] + Math.max(insets.bottom, 8);

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[
        padded && styles.padding,
        styles.scrollContent,
        { paddingBottom: bottomPad },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flex,
        padded && styles.padding,
        tabBarInset && { paddingBottom: bottomPad },
        contentStyle,
      ]}
    >
      {children}
    </View>
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
    flexGrow: 1,
  },
});
