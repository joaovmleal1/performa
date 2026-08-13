import { Platform, useWindowDimensions } from 'react-native';

import { layout } from '@/theme';

/** Shell desktop; no mobile = 100% */
export const APP_SHELL_MAX = layout.maxContentWidth;

export function useAppShell() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const useShell = isWeb && width > APP_SHELL_MAX + 40;
  const contentWidth = useShell ? APP_SHELL_MAX : width;

  return {
    isWeb,
    useShell,
    viewportWidth: width,
    contentWidth,
    screenStyle: useShell
      ? {
          width: APP_SHELL_MAX,
          maxWidth: APP_SHELL_MAX,
          alignSelf: 'center' as const,
        }
      : {
          width: '100%' as const,
          maxWidth: '100%' as const,
          alignSelf: 'stretch' as const,
        },
    tabBarStyle: useShell
      ? {
          width: APP_SHELL_MAX,
          maxWidth: APP_SHELL_MAX,
          alignSelf: 'center' as const,
          left: (width - APP_SHELL_MAX) / 2,
          right: (width - APP_SHELL_MAX) / 2,
        }
      : {
          width: '100%' as const,
          maxWidth: '100%' as const,
          alignSelf: 'stretch' as const,
          left: 0,
          right: 0,
        },
  };
}
