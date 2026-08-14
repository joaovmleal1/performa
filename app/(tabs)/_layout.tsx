import { Tabs } from 'expo-router';
import { Apple, Dumbbell, Home, LineChart, User } from 'lucide-react-native';
import { Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_SHELL_MAX, useAppShell } from '@/hooks/useAppShell';
import { colors, layout } from '@/theme';

const ICON_STROKE = 1.85;

function TabLabel({
  label,
  focused,
  color,
}: {
  label: string;
  focused: boolean;
  color: string;
}) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
      style={[styles.label, focused && styles.labelActive, { color }]}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { useShell, shellLeft, tabBarStyle: shellTabBar } = useAppShell();
  const bottomPad = Math.max(insets.bottom, 10);

  const webShellTweaks =
    Platform.OS === 'web' && useShell
      ? ({
          left: shellLeft,
          width: APP_SHELL_MAX,
          maxWidth: APP_SHELL_MAX,
          right: 'auto' as const,
          marginLeft: 0,
          marginRight: 0,
          alignSelf: 'flex-start' as const,
        } as const)
      : {};

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        sceneStyle: {
          backgroundColor: colors.background,
          ...(Platform.OS === 'web'
            ? ({ flex: 1, width: '100%' } as object)
            : null),
        },
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: layout.bottomNavHeight - 8 + bottomPad,
          paddingTop: 8,
          paddingBottom: bottomPad,
          paddingHorizontal: 2,
          elevation: 0,
          shadowOpacity: 0,
          ...shellTabBar,
          ...webShellTweaks,
        },
        tabBarItemStyle: {
          flex: 1,
          paddingHorizontal: 0,
          minWidth: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Início" focused={focused} color={String(color)} />
          ),
          tabBarIcon: ({ color }) => (
            <Home color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Treino',
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Treino" focused={focused} color={String(color)} />
          ),
          tabBarIcon: ({ color }) => (
            <Dumbbell color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrição',
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Nutrição" focused={focused} color={String(color)} />
          ),
          tabBarIcon: ({ color }) => (
            <Apple color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Progresso" focused={focused} color={String(color)} />
          ),
          tabBarIcon: ({ color }) => (
            <LineChart color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Perfil" focused={focused} color={String(color)} />
          ),
          tabBarIcon: ({ color }) => (
            <User color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Sora_500Medium',
    fontSize: 9,
    letterSpacing: -0.35,
    marginTop: 2,
    textAlign: 'center',
    width: '100%',
  },
  labelActive: {
    fontFamily: 'Sora_600SemiBold',
  },
});
