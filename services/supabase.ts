/**
 * Camada de serviços pronta para Supabase.
 * Troque os mocks por chamadas reais quando as envs estiverem configuradas.
 */

export const supabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  isConfigured() {
    return Boolean(this.url && this.anonKey);
  },
};

export async function fetchCurrentSession() {
  // Placeholder — integrar @supabase/supabase-js
  return null;
}

export async function signInWithEmail(_email: string, _password: string) {
  throw new Error('Supabase ainda não configurado. Use o fluxo mockado do authStore.');
}

export async function signUpWithEmail(_email: string, _password: string) {
  throw new Error('Supabase ainda não configurado. Use o fluxo mockado do authStore.');
}
