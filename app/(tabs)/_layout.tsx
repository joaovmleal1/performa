import { Tabs } from 'expo-router';
import { Apple, Dumbbell, Home, LineChart, User } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppShell } from '@/hooks/useAppShell';
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
      minimumFontScale={0.85}
      style={[styles.label, focused && styles.labelActive, { color }]}
    >
      {label}
    </Text>
  );
}

function TabIcon({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconActive]}>
      {children}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { tabBarStyle } = useAppShell();
  const bottomPad = Math.max(insets.bottom, 10);

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
          height: layout.bottomNavHeight - 8 + bottomPad,
          paddingTop: 8,
          paddingBottom: bottomPad,
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Home color={color} size={22} strokeWidth={ICON_STROKE} />
            </TabIcon>
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Dumbbell color={color} size={22} strokeWidth={ICON_STROKE} />
            </TabIcon>
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Apple color={color} size={22} strokeWidth={ICON_STROKE} />
            </TabIcon>
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <LineChart color={color} size={22} strokeWidth={ICON_STROKE} />
            </TabIcon>
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <User color={color} size={22} strokeWidth={ICON_STROKE} />
            </TabIcon>
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
    letterSpacing: -0.15,
    marginTop: 2,
    textAlign: 'center',
    width: '100%',
  },
  labelActive: {
    fontFamily: 'Sora_600SemiBold',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
