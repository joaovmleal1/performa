import { Tabs } from 'expo-router';
import { Apple, Dumbbell, Home, LineChart, User } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

const ICON_STROKE = 1.85;

function TabIcon({ focused, children }: { focused: boolean; children: ReactNode }) {
  return <View style={[styles.icon, focused && styles.iconActive]}>{children}</View>;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 62 + Math.max(insets.bottom, 8),
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          ...(Platform.OS === 'web'
            ? {
                maxWidth: 520,
                alignSelf: 'center',
                borderLeftWidth: StyleSheet.hairlineWidth,
                borderRightWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
              }
            : null),
        },
        tabBarLabelStyle: {
          fontFamily: 'Sora_500Medium',
          fontSize: 11,
          letterSpacing: 0.2,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Home color={color} size={size - 2} strokeWidth={ICON_STROKE} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Treino',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Dumbbell color={color} size={size - 2} strokeWidth={ICON_STROKE} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrição',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Apple color={color} size={size - 2} strokeWidth={ICON_STROKE} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <LineChart color={color} size={size - 2} strokeWidth={ICON_STROKE} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <User color={color} size={size - 2} strokeWidth={ICON_STROKE} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 34,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: colors.primaryMuted,
  },
});
