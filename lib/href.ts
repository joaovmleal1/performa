import { type Href } from 'expo-router';

/** Cast seguro enquanto as rotas novas ainda não estão no typed routes gerado. */
export function href(path: string): Href {
  return path as Href;
}
