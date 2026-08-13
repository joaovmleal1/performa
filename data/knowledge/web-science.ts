/**
 * Sintese curada de literatura pública (ACSM, Schoenfeld, NSCA, IOC/BJSM)
 * coletada para alimentar o RAG do PERFORMA Coach.
 * Fontes e links ficam em `origin` / knowledgeSources.
 */
import type { KnowledgeChunk } from './expert-canon';

export const webScienceChunks: KnowledgeChunk[] = [
  {
    id: 'web_acsm_2026_01',
    source: 'web_acsm_2026',
    title: 'ACSM 2026 — Position Stand: resistência em adultos saudáveis',
    domain: 'resistance_training',
    tags: ['acsm', 'strength', 'hypertrophy', 'power', 'frequency', 'volume'],
    content:
      'Position Stand ACSM 2026 (overview de 137 revisões sistemáticas, >30.000 participantes): o maior salto de benefício ocorre ao sair do sedentarismo para qualquer treino de resistência consistente. Treine todos os grupos musculares principais ≥2 dias/semana. Força: cargas ≥80% 1RM, 2–3 séries/exercício, amplitude completa, prioridade no início da sessão. Hipertrofia: volume semanal maior (~≥10 séries/grupo muscular), sobrecarga excêntrica ajuda. Potência: cargas moderadas 30–70% 1RM com intenção de velocidade concêntrica alta e volume baixo-moderado. Adesão supera complexidade do programa.',
  },
  {
    id: 'web_acsm_2026_02',
    source: 'web_acsm_2026',
    title: 'ACSM 2026 — o que muda menos do que se pensa',
    domain: 'resistance_training',
    tags: ['acsm', 'periodization', 'equipment', 'failure'],
    content:
      'No overview ACSM 2026, treinar até a falha momentânea, tipo de equipamento, complexidade do exercício, estrutura de séries, tempo sob tensão, BFR e periodização não mostraram impacto consistente universal nos outcomes primários em adultos saudáveis. Isso não invalida periodização para atletas com calendário competitivo; indica que, para saúde/hipertrofia geral, consistência + progressão + volume/carga adequados ao objetivo pesam mais que micro-otimizações.',
  },
  {
    id: 'web_schoenfeld_volume_01',
    source: 'web_schoenfeld',
    title: 'Schoenfeld — dose-resposta de volume semanal e hipertrofia',
    domain: 'hypertrophy',
    tags: ['hypertrophy', 'volume', 'sets', 'schoenfeld'],
    content:
      'Meta-análise Schoenfeld/Krieger sobre volume semanal: relação dose-resposta graduada — mais séries semanais por músculo tendem a maior hipertrofia (dentro da recuperação). Categorias práticas: <5, 5–9 e 10+ séries/semana. Volumes baixos já geram ganhos; volumes altos amplificam, mas com custo de fadiga. Use volume recuperável: iniciante 6–12 séries/músculo/semana; intermediário frequentemente 10–20; avançado pode precisar mais com deloads.',
  },
  {
    id: 'web_schoenfeld_freq_01',
    source: 'web_schoenfeld',
    title: 'Schoenfeld — frequência e hipertrofia com volume equalizado',
    domain: 'hypertrophy',
    tags: ['hypertrophy', 'frequency', 'schoenfeld'],
    content:
      'Meta-análises de frequência (Schoenfeld et al.): com volume semanal equalizado, treinar o músculo 1× vs 2–3×/semana não muda hipertrofia de forma significativa. Frequência maior ajuda principalmente a distribuir volume alto (qualidade por sessão). Preferência prática: ≥2×/músculo/semana quando o volume for elevado; escolha a divisão (full body, upper/lower, PPL) pela agenda e recuperação do aluno.',
  },
  {
    id: 'web_nsca_period_01',
    source: 'web_nsca',
    title: 'NSCA — periodização e progressão geral→específico',
    domain: 'periodization',
    tags: ['periodization', 'nsca', 'volume', 'intensity'],
    content:
      'Literatura NSCA/S&C Journal: periodização organiza volume/intensidade, progride do geral para o específico do esporte e dissipa fadiga antes da prova. Estratégia depende do nível do atleta e do calendário. Temas comuns: manipular volume-load, usar microciclos somados e taper pré-competição para supercompensação. Iniciante tolera planos simples; avançado precisa de variação planejada e monitoramento.',
  },
  {
    id: 'web_nsca_taper_01',
    source: 'web_nsca',
    title: 'NSCA/evidência — taper para força e performance',
    domain: 'periodization',
    tags: ['taper', 'peak', 'nsca', 'volume', 'intensity'],
    content:
      'Taper eficaz: reduzir volume ~30–70% (meta comum ~40–60%), manter ou ligeiramente aumentar intensidade, preservar frequência ou reduzir pouco. Duração típica 1–2 semanas (às vezes até ~4). Para força máxima: cessação curta 2–7 dias antes da prova pode ajudar; ajustes por levantamento (ex.: deadlift mais longe da prova que bench). Step taper ou progressive taper são as formas mais usadas. Objetivo: cortar fadiga sem perder sharpness neuromuscular.',
  },
  {
    id: 'web_deload_01',
    source: 'web_nsca',
    title: 'Deload em força e physique',
    domain: 'recovery',
    tags: ['deload', 'recovery', 'volume', 'overreaching'],
    content:
      'Deload estruturado típico: 5–7 dias com redução de volume (e às vezes intensidade) para prevenir overreaching não funcional. Após blocos longos/duros, deload pode ser mais longo e incluir 2–5 dias de cessação parcial. Deload reativo (1 sessão/leve) serve quando RPE, sono ou dor pioram. Em physique: mantenha estímulo leve e amplitude; em força: preserve padrões técnicos com menos séries.',
  },
  {
    id: 'web_ioc_load_01',
    source: 'web_ioc_bjsm',
    title: 'IOC/BJSM — gestão de carga e risco de lesão',
    domain: 'injury_prevention',
    tags: ['load', 'injury_prevention', 'rpe', 'acwr'],
    content:
      'Consenso IOC (BJSM): má gestão de carga é fator major de lesão. Monitore carga externa (volume, distância, kg) e interna (sRPE = RPE × duração). Evite picos semanais bruscos; regra prática frequentemente citada: aumentos semanais <10% quando possível. Razão aguda:crônica (ACWR) em faixa ~0,8–1,3 associada a menor risco em vários esportes; >1,5 eleva risco. Individualize: retorno de lesão e baixa crônica elevam vulnerabilidade a picos.',
  },
  {
    id: 'web_rir_rpe_01',
    source: 'web_ioc_bjsm',
    title: 'RPE/RIR para autorregulação de força',
    domain: 'coaching',
    tags: ['rir', 'rpe', 'autoregulation', 'intensity'],
    content:
      'RIR/RPE (Zourdos et al.): RPE 10 = falha; RPE 9 = 1 RIR; RPE 8 = 2 RIR. Use RIR série a série para ajustar carga ao readiness do dia. Session-RPE (Foster) captura carga interna da sessão inteira (~30 min após). Não misture as duas escalas na mesma conversa com o aluno. Hipertrofia típica: 0–3 RIR nas séries duras; força: buffer técnico maior em dias pesados.',
  },
  {
    id: 'web_protein_01',
    source: 'web_nutrition_science',
    title: 'Proteína e energia para hipertrofia/força',
    domain: 'nutrition',
    tags: ['protein', 'calories', 'hypertrophy', 'recovery'],
    content:
      'Evidência consolidada: para praticantes de resistência, proteína frequentemente ~1,6–2,2 g/kg/dia distribuída em refeições; atletas em déficit podem precisar do topo da faixa. Superávit calórico moderado favorece hipertrofia; déficit moderado preserva mais massa se proteína e estímulo de força forem mantidos. Carboidrato peri-treino apoia performance de alto volume. Sono insuficiente reduz adaptações — trate como variável de treino.',
  },
  {
    id: 'web_physio_01',
    source: 'web_physio',
    title: 'Fisioterapia esportiva — dor vs DOMS e modificações',
    domain: 'physiotherapy',
    tags: ['injury_prevention', 'pain', 'mobility', 'technique'],
    content:
      'DOMS 24–72h é esperado após sobrecarga nova; dor articular aguda, irradiada, edema, bloqueio ou perda de força exige avaliação profissional. Estratégias de treino com dor mecânica leve: reduzir amplitude dolorosa, trocar variação, baixar volume, manter padrão contralateral/unilateral seguro, enfatizar controle escapular/core. Fortalecimento progressivo aumenta tolerância de carga tecidual. Mobilidade deve servir ao padrão do exercício, não ser fim isolado.',
  },
  {
    id: 'web_endurance_strength_01',
    source: 'web_nsca',
    title: 'Força no atleta de endurance e times',
    domain: 'sport_prep',
    tags: ['endurance', 'strength', 'periodization', 'team_sport'],
    content:
      'Atletas de corrida/ciclismo/triathlon: força 2×/semana na base melhora economia e resiliência; perto da prova, preserve potência/ativação e corte volume de academia. Em team sports (NSCA): periodize em torno do calendário de jogos; taper de 7–21 dias pode melhorar RSA/potência quando há janela; na temporada congestada use manutenção e gestão de fadiga residual em vez de picos agressivos.',
  },
];
