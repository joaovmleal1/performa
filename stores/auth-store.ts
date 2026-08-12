import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mockUser } from '@/data/mock';
import type { UserProfile } from '@/types';

type AuthState = {
  isHydrated: boolean;
  hasSeenOnboarding: boolean;
  hasCompletedEvaluation: boolean;
  hasCompletedAssessment: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  setHydrated: (value: boolean) => void;
  hydrate: () => Promise<void>;
  completeOnboarding: () => void;
  login: (email: string, _password: string) => Promise<void>;
  register: (name: string, email: string, _password: string) => Promise<void>;
  completeEvaluation: (partial?: Partial<UserProfile>) => void;
  completeAssessment: (partial?: Partial<UserProfile>) => void;
  logout: () => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  skipToApp: () => void;
};

function withNames(partial: Partial<UserProfile>, fallback: UserProfile): UserProfile {
  const name = partial.name ?? partial.fullName ?? fallback.name;
  return {
    ...fallback,
    ...partial,
    name,
    fullName: partial.fullName ?? partial.name ?? name,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      hasSeenOnboarding: false,
      hasCompletedEvaluation: false,
      hasCompletedAssessment: false,
      isAuthenticated: false,
      user: null,
      setHydrated: (value) => set({ isHydrated: value }),
      hydrate: async () => {
        set({ isHydrated: true });
      },
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      login: async (email) => {
        await new Promise((r) => setTimeout(r, 500));
        set({
          isAuthenticated: true,
          user: withNames({ email }, mockUser),
          hasCompletedEvaluation: true,
          hasCompletedAssessment: true,
        });
      },
      register: async (name, email) => {
        await new Promise((r) => setTimeout(r, 600));
        set({
          isAuthenticated: true,
          hasCompletedEvaluation: false,
          hasCompletedAssessment: false,
          user: withNames(
            {
              name,
              fullName: name,
              email,
              username: name.toLowerCase().replace(/\s+/g, '.'),
            },
            mockUser,
          ),
        });
      },
      completeEvaluation: (partial = {}) => {
        const current = get().user ?? mockUser;
        set({
          hasCompletedEvaluation: true,
          hasCompletedAssessment: true,
          user: withNames({ ...partial, assessmentCompleted: true }, current),
        });
      },
      completeAssessment: (partial = {}) => {
        get().completeEvaluation(partial);
      },
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
      updateUser: (partial) => {
        const current = get().user;
        if (!current) return;
        set({ user: withNames(partial, current) });
      },
      skipToApp: () =>
        set({
          isAuthenticated: true,
          hasSeenOnboarding: true,
          hasCompletedEvaluation: true,
          hasCompletedAssessment: true,
          user: mockUser,
        }),
    }),
    {
      name: 'performa-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
        hasCompletedEvaluation: state.hasCompletedEvaluation,
        hasCompletedAssessment: state.hasCompletedAssessment,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
