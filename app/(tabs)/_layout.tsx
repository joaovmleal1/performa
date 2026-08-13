import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Apple, Dumbbell, Home, LineChart, User } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
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
      minimumFontScale={0.8}
      style={[styles.label, focused && styles.labelActive, { color }]}
    >
      {label}
    </Text>
  );
}

function ShellTabBar(props: BottomTabBarProps) {
  const { useShell } = useAppShell();
  return (
    <View pointerEvents="box-none" style={styles.tabBarHost}>
      <View
        style={[
          styles.tabBarShell,
          useShell ? { width: APP_SHELL_MAX } : styles.tabBarFull,
        ]}
      >
        <BottomTabBar {...props} />
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <Tabs
      tabBar={(props) => <ShellTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: layout.bottomNavHeight - 8 + bottomPad,
          paddingTop: 8,
          paddingBottom: bottomPad,
          paddingHorizontal: 4,
          elevation: 0,
          shadowOpacity: 0,
          position: 'relative',
          width: '100%',
          left: 0,
          right: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          paddingHorizontal: 2,
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
  tabBarHost: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  tabBarShell: {
    overflow: 'hidden',
    backgroundColor: colors.backgroundElevated,
  },
  tabBarFull: {
    width: '100%',
  },
  label: {
    fontFamily: 'Sora_500Medium',
    fontSize: 10,
    letterSpacing: -0.2,
    marginTop: 2,
    textAlign: 'center',
    width: '100%',
  },
  labelActive: {
    fontFamily: 'Sora_600SemiBold',
  },
});
