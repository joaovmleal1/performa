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

## Técnica (como fazer / como não fazer)

Seção **Técnica** com 400+ vídeos educativos do pack `+400 Animazioni` (certo × errado, erros comuns e guias).

- Rota: `/technique`
- Catálogo: `data/form/catalog.json`
- Atalhos: Início e Treino → “Como fazer e como não fazer”

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

## Coach Especialista

Agente de suporte e periodização em `/ai` (`services/coach-agent.ts`), com RAG local + opcional **OpenRouter**.

Base de conhecimento (`data/knowledge/`):

- cânone interno (EF / fisioterapia esportiva / musculação)
- literatura web curada (ACSM 2026, Schoenfeld, NSCA taper/deload, IOC/BJSM load)
- *Guida Completa Massa Muscolare* (Brunaccioni / V Athlete–InVictus)
- *Allenamento a Casa* (Fisico Spartano, via Dhoze)

### OpenRouter

1. Crie a key em https://openrouter.ai/keys  
2. Cole em **Perfil → Configurar OpenRouter** (ou `EXPO_PUBLIC_OPENROUTER_API_KEY` no `.env`)  
3. Escolha o modelo (padrão: `openai/gpt-4o-mini`)

Sem key, o Coach continua no modo local. Com key, cada pergunta envia trechos RAG como contexto ao LLM.

## Fluxo

Splash → Onboarding → Login → Avaliação inicial → Tabs
(Início / Treino / Nutrição / Progresso / Perfil)

Na avaliação inicial perguntamos:
- se a pessoa **já faz dieta**, **quer montar com o PERFORMA** ou **agora não** (desbloqueia a montagem em Nutrição)
- se quer ativar o **modo preparação** (esporte/competição → periodização completa)

Nutrição → Dieta IA (se desbloqueada) → Entrevista → Geração → Resultado → Plano  
Treino → Sessão com séries, carga e descanso · Modo preparação em `/preparation`
