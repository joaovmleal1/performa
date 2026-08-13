import { Platform, useWindowDimensions } from 'react-native';

/** Largura do “phone shell” só no desktop web. No mobile, usa 100%. */
export const APP_SHELL_MAX = 430;

export function useAppShell() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  /** Viewport maior que o shell → centraliza coluna de app */
  const useShell = isWeb && width > APP_SHELL_MAX + 24;
  const contentWidth = useShell ? APP_SHELL_MAX : width;

  return {
    isWeb,
    useShell,
    viewportWidth: width,
    contentWidth,
    /** Estilo para telas (Screen) */
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
    /** Estilo da tab bar — largura explícita evita colapso no RN Web */
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
