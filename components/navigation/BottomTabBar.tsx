import {
  Activity,
  Apple,
  Home,
  UserRound,
  Dumbbell,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { colors, layout, spacing } from '@/theme';

type TabRoute = {
  key: string;
  name: string;
  params?: object;
};

type TabDescriptor = {
  options: { title?: string };
};

type BottomTabBarProps = {
  state: {
    index: number;
    routes: TabRoute[];
  };
  descriptors: Record<string, TabDescriptor>;
  navigation: {
    emit: (event: {
      type: string;
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
};

const icons = {
  index: Home,
  workout: Dumbbell,
  nutrition: Apple,
  progress: Activity,
  profile: UserRound,
} as const;

const labels: Record<string, string> = {
  index: 'Início',
  workout: 'Treino',
  nutrition: 'Nutrição',
  progress: 'Progresso',
  profile: 'Perfil',
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = labels[route.name] ?? options.title ?? route.name;
        const Icon = icons[route.name as keyof typeof icons] ?? Home;
        const color = focused ? colors.tabActive : colors.tabInactive;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={label}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
            style={styles.item}
          >
            <Icon color={color} size={22} strokeWidth={focused ? 2.4 : 2} />
            <AppText
              variant="caption"
              style={{ color, marginTop: 4, fontSize: 11 }}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing.sm,
    minHeight: layout.bottomNavHeight,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.minTouchTarget,
  },
});
