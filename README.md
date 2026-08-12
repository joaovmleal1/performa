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

## Estrutura

```
app/                 # rotas (auth, evaluation, tabs, workout, nutrition, habits)
components/ui/       # design system
components/brand/    # logo PERFORMA
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
