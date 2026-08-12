import { Href, useRouter } from 'expo-router';

/** Atalho tipado para rotas novas antes do Expo regenerar os tipos. */
export function useAppRouter() {
  const router = useRouter();
  return {
    ...router,
    push: (href: string) => router.push(href as Href),
    replace: (href: string) => router.replace(href as Href),
  };
}
