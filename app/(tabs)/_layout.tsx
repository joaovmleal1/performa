import { Tabs } from 'expo-router';
import { Apple, Dumbbell, Home, LineChart, User } from 'lucide-react-native';
import { Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

const ICON_STROKE = 1.75;

function TabLabel({ label, color }: { label: string; color: string }) {
  return (
    <Text numberOfLines={1} style={[styles.label, { color }]}>
      {label}
    </Text>
  );
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
          backgroundColor: colors.surfaceDark,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 60 + Math.max(insets.bottom, 4),
          paddingTop: 4,
          paddingBottom: Math.max(insets.bottom, 4),
          ...(Platform.OS === 'web'
            ? {
                maxWidth: 430,
                alignSelf: 'center',
                width: '100%',
              }
            : null),
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
          minWidth: 0,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarLabel: ({ color }) => <TabLabel label="Início" color={color} />,
          tabBarIcon: ({ color }) => (
            <Home color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Treino',
          tabBarLabel: ({ color }) => <TabLabel label="Treino" color={color} />,
          tabBarIcon: ({ color }) => (
            <Dumbbell color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrição',
          tabBarLabel: ({ color }) => <TabLabel label="Nutrição" color={color} />,
          tabBarIcon: ({ color }) => (
            <Apple color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
          tabBarLabel: ({ color }) => <TabLabel label="Progresso" color={color} />,
          tabBarIcon: ({ color }) => (
            <LineChart color={color} size={22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: ({ color }) => <TabLabel label="Perfil" color={color} />,
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
    fontSize: 10,
    letterSpacing: -0.2,
    marginTop: 2,
  },
});
