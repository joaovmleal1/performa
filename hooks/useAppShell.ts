import { Platform, useWindowDimensions } from 'react-native';

/** Phone shell no desktop — largura suficiente para 5 labels PT */
export const APP_SHELL_MAX = 430;

export function useAppShell() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const useShell = isWeb && width > APP_SHELL_MAX + 48;
  const contentWidth = useShell ? APP_SHELL_MAX : width;
  const shellLeft = useShell ? Math.max(0, Math.round((width - APP_SHELL_MAX) / 2)) : 0;

  return {
    isWeb,
    useShell,
    viewportWidth: width,
    contentWidth,
    shellLeft,
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
          position: 'absolute' as const,
          left: shellLeft,
          width: APP_SHELL_MAX,
          right: 'auto' as unknown as number,
          maxWidth: APP_SHELL_MAX,
        }
      : {
          position: 'absolute' as const,
          left: 0,
          right: 0,
          width: '100%' as const,
        },
  };
}
