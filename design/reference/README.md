# PERFORMA — Source of Truth Visual

As imagens e o board nesta pasta são a **fonte da verdade visual**.

## Arquivo principal

- `00-board-source-of-truth.png` — board completo com identidade + mockups 01–15

## Spec de tokens (obrigatória)

Ver também o brief de reconstrução pixel-perfect. Tokens canônicos:

| Token | Valor |
|-------|--------|
| Background | `#080B10` / `#0B0E14` |
| Surface sec. | `#101319` |
| Cards | `#12161D` / `#161A22` |
| Elevated | `#1A1E27` |
| Border | `rgba(255,255,255,0.09)` |
| Primary | `#00FF85` |
| Purple | `#7B5CFF` |
| Text | `#FFFFFF` / `#A4A6AF` / `#6F727C` |
| Font | Sora |

## Mapeamento rota ↔ referência

| # | Referência | Rota |
|---|------------|------|
| 01 | Onboarding | `/(auth)/onboarding` |
| 02 | Login / Cadastro | `/(auth)/login`, `/(auth)/register` |
| 03 | Avaliação | `/(evaluation)` |
| 04 | Dashboard | `/(tabs)` |
| 05 | Treino | `/(tabs)/workout` |
| 06 | Execução | `/workout/session` |
| 07 | Nutrição | `/(tabs)/nutrition` |
| 08–10 | Dieta IA | `/nutrition/ai-*` |
| 11 | Plano alimentar | `/nutrition/meal-plan` |
| 12 | Progresso | `/(tabs)/progress` |
| 13 | Hábitos | `/habits` |
| 14 | Comunidade | _(não implementada)_ |
| 15 | Perfil | `/(tabs)/profile` |

Screenshots da implementação atual vão em `/design/current/`.
