# PERFORMA

Aplicativo premium de **treino + nutrição + hábitos + progresso + IA**.

## Stack

- Expo SDK 57 + React Native
- TypeScript
- Expo Router
- Zustand
- TanStack Query
- React Hook Form + Zod
- Sora (Google Fonts)
- Supabase (camada pronta para conexão)

## Rodar

```bash
npm install
npx expo start
```

Atalho demo no login: **Entrar com dados demo (Amanda)**.

## Biblioteca de exercícios

~700 exercícios com **GIF de execução** do pack no Google Drive (peito, costas, ombros, braços, inferiores, abdômen).

1. Baixe as mídias para o app (uma vez):

```bash
npm run download:exercises
```

Isso grava os GIFs em `public/exercises/` (servidos localmente pelo Expo). Metadados ficam em `data/exercises/catalog.json`.

Onde ver no app: **Treino → Biblioteca de exercícios** (lista + detalhe com GIF) e na **sessão de treino**.

## Estrutura

```
app/                 # rotas (auth, evaluation, tabs, workout, nutrition, habits)
components/ui/       # design system
components/brand/    # logo PERFORMA
data/exercises/      # catálogo + GIFs (URLs) de execução
data/mock/           # dados coerentes (Amanda Silva)
stores/              # estado (auth, evaluation, workout, nutrition, habits)
theme/               # tokens de cor, tipografia, spacing
types/               # entidades do domínio
```

## Fluxo

Splash → Onboarding → Login → Avaliação inicial → Tabs
(Início / Treino / Nutrição / Progresso / Perfil)

Nutrição → Dieta IA → Entrevista → Geração → Resultado → Plano
Treino → Sessão com séries, carga e descanso
