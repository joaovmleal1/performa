# Auditoria visual — PERFORMA

| ROTA | REFERÊNCIA | ESTADO ATUAL | DIFERENÇAS PRINCIPAIS | AÇÃO |
|------|------------|--------------|----------------------|------|
| `/` splash redirect | Splash marca | Sem splash dedicada | Falta marca central + loading | Criar/ajustar splash |
| `/(auth)/onboarding` | 01–03 | Carousel genérico | Headline sem verde destacado; CTA circular faltando no 1–2 | Reconstruir |
| `/(auth)/login` | 02 | Form básico | Sem social login; sem “Bem-vindo”; tokens antigos | Reconstruir |
| `/(auth)/register` | 06 | Form básico | Layout/checkbox/CTA | Alinhar |
| `/(evaluation)` | 03 + fluxos | Multi-step OK | Cards/seleção/números grandes; tokens | Reconstruir UI |
| `/(tabs)` | 04 Dashboard | Cards genéricos | Saudação, avatar, ring calorias, insight | Reconstruir |
| `/(tabs)/workout` | 05 | Lista + promo técnica | Exercise rows + CTA full | Reconstruir |
| `/workout/session` | 06 | Logger OK | Hierarquia carga/reps; descanso | Reconstruir |
| `/(tabs)/nutrition` | 07 | Macros OK | Tabs Resumo/Refeições/Macros; ring | Reconstruir |
| `/nutrition/ai-*` | 08–10 | Fluxo existe | Orb gradient; entrevista; resultado | Reconstruir |
| `/nutrition/meal-plan` | 11 | Lista | Dias + fotos + kcal | Reconstruir |
| `/(tabs)/progress` | 12 | Chart simples | Tabs; peso grande; área chart | Reconstruir |
| `/habits` | 13 | Lista | Checks verdes; CTA novo | Reconstruir |
| `/(tabs)/profile` | 15 | Menu limpo | Nível/XP; card evolução; ícones | Reconstruir |
| Tab bar | Bottom nav | Truncava / shell | Altura 76–88; inactive #777A84 | Ajustar |

Tokens atuais (`#121217`, cards `#2A2A33`) **divergem** dos oficiais (`#080B10`, cards `#12161D`).
