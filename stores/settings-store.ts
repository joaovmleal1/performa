import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_OPENROUTER_MODEL } from '@/services/openrouter';

type SettingsState = {
  openRouterApiKey: string;
  openRouterModel: string;
  preferCloudCoach: boolean;
  setOpenRouterApiKey: (key: string) => void;
  setOpenRouterModel: (model: string) => void;
  setPreferCloudCoach: (value: boolean) => void;
  clearOpenRouterApiKey: () => void;
  hasOpenRouterKey: () => boolean;
  resolveApiKey: () => string;
};

function envApiKey(): string {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_OPENROUTER_API_KEY) {
    return String(process.env.EXPO_PUBLIC_OPENROUTER_API_KEY).trim();
  }
  return '';
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      openRouterApiKey: '',
      openRouterModel: DEFAULT_OPENROUTER_MODEL,
      preferCloudCoach: true,
      setOpenRouterApiKey: (key) => set({ openRouterApiKey: key.trim() }),
      setOpenRouterModel: (model) => set({ openRouterModel: model }),
      setPreferCloudCoach: (value) => set({ preferCloudCoach: value }),
      clearOpenRouterApiKey: () => set({ openRouterApiKey: '' }),
      hasOpenRouterKey: () => Boolean(get().resolveApiKey()),
      resolveApiKey: () => get().openRouterApiKey.trim() || envApiKey(),
    }),
    {
      name: 'performa-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        openRouterApiKey: s.openRouterApiKey,
        openRouterModel: s.openRouterModel,
        preferCloudCoach: s.preferCloudCoach,
      }),
    },
  ),
);
