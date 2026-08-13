import { Platform, useWindowDimensions } from 'react-native';

/** Largura do phone shell no desktop web */
export const APP_SHELL_MAX = 430;

export function useAppShell() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const useShell = isWeb && width > APP_SHELL_MAX + 48;
  const contentWidth = useShell ? APP_SHELL_MAX : width;
  const shellLeft = useShell ? Math.max(0, (width - APP_SHELL_MAX) / 2) : 0;

  return {
    isWeb,
    useShell,
    viewportWidth: width,
    contentWidth,
    shellLeft,
    /** Telas (Stack/auth): coluna central no desktop */
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
    /**
     * Tab bar absoluta no RN Web: NÃO usar left+right juntos com width
     * (isso empurra a barra para a direita). Só left + width.
     */
    tabBarStyle: useShell
      ? {
          position: 'absolute' as const,
          left: shellLeft,
          width: APP_SHELL_MAX,
          right: 'auto' as unknown as number,
          maxWidth: APP_SHELL_MAX,
          alignSelf: 'auto' as const,
        }
      : {
          position: 'absolute' as const,
          left: 0,
          right: 0,
          width: '100%' as const,
          maxWidth: '100%' as const,
        },
    /** Wrapper full-bleed atrás do shell (gutters escuros) */
    desktopChromeStyle: useShell
      ? {
          flex: 1,
          width: '100%' as const,
          backgroundColor: '#080B10',
          alignItems: 'center' as const,
        }
      : { flex: 1, width: '100%' as const },
  };
}
