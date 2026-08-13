import { Tabs } from 'expo-router';
import { Apple, Dumbbell, Home, LineChart, User } from 'lucide-react-native';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppShell } from '@/hooks/useAppShell';
import { colors } from '@/theme';

const ICON_STROKE = 1.75;

function TabLabel({
  label,
  color,
  compact,
}: {
  label: string;
  color: string | undefined;
  compact: boolean;
}) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.85}
      style={[
        styles.label,
        compact && styles.labelCompact,
        { color: color ?? colors.tabInactive },
      ]}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { tabBarStyle, contentWidth } = useAppShell();
  const compactLabels = contentWidth < 380;

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
          height: 58 + Math.max(insets.bottom, 6),
          paddingTop: 4,
          paddingBottom: Math.max(insets.bottom, 6),
          paddingHorizontal: 0,
          elevation: 0,
          shadowOpacity: 0,
          ...tabBarStyle,
        },
        tabBarItemStyle: {
          flex: 1,
          paddingHorizontal: 0,
          minWidth: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarLabel: ({ color }) => (
            <TabLabel label="Início" color={String(color)} compact={compactLabels} />
          ),
          tabBarIcon: ({ color }) => (
            <Home color={color} size={compactLabels ? 20 : 22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Treino',
          tabBarLabel: ({ color }) => (
            <TabLabel label="Treino" color={String(color)} compact={compactLabels} />
          ),
          tabBarIcon: ({ color }) => (
            <Dumbbell color={color} size={compactLabels ? 20 : 22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrição',
          tabBarLabel: ({ color }) => (
            <TabLabel
              label={compactLabels ? 'Nutri' : 'Nutrição'}
              color={String(color)}
              compact={compactLabels}
            />
          ),
          tabBarIcon: ({ color }) => (
            <Apple color={color} size={compactLabels ? 20 : 22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
          tabBarLabel: ({ color }) => (
            <TabLabel label="Evolução" color={String(color)} compact={compactLabels} />
          ),
          tabBarIcon: ({ color }) => (
            <LineChart color={color} size={compactLabels ? 20 : 22} strokeWidth={ICON_STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: ({ color }) => (
            <TabLabel label="Perfil" color={String(color)} compact={compactLabels} />
          ),
          tabBarIcon: ({ color }) => (
            <User color={color} size={compactLabels ? 20 : 22} strokeWidth={ICON_STROKE} />
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
    marginTop: 1,
    textAlign: 'center',
    width: '100%',
  },
  labelCompact: {
    fontSize: 9,
    letterSpacing: -0.35,
  },
});
