/**
 * Base de conhecimento especialista PERFORMA Coach.
 * Sintetiza princípios consolidados de educação física, fisioterapia esportiva
 * e musculação (ACSM, NSCA, Bompa, Issurin, Schoenfeld, Helms, etc.)
 * para recuperação local (RAG) sem inventar dados do aluno.
 *
 * Nota: não substitui profissional de saúde. É suporte à periodização e educação.
 */
export type KnowledgeChunk = {
  id: string;
  source: string;
  title: string;
  domain: string;
  tags: string[];
  content: string;
};

export const expertCanon: KnowledgeChunk[] = [
  {
    id: 'canon_principles_01',
    source: 'canon_ef',
    title: 'Princípios do treinamento',
    domain: 'training_science',
    tags: ['periodization', 'progression', 'volume', 'intensity', 'recovery'],
    content:
      'Princípios fundamentais: especificidade (treine o que quer melhorar), sobrecarga progressiva (aumente estímulo ao longo do tempo), recuperação (adaptação ocorre no descanso), individualidade (idade, experiência, lesões e calendário mudam o plano), variação (mude volume/intensidade/exercícios para evitar estagnação) e reversibilidade (o que não é mantido se perde). Periodização organiza esses princípios no tempo.',
  },
  {
    id: 'canon_periodization_01',
    source: 'canon_ef',
    title: 'Modelos de periodização',
    domain: 'periodization',
    tags: ['periodization', 'volume', 'intensity'],
    content:
      'Periodização linear clássica: volume alto/intensidade baixa no início → volume cai e intensidade sobe até o pico. Periodização ondulatória (DUP): varia intensidade/volume em dias ou semanas. Periodização em blocos (Issurin): concentra capacidades em blocos sequenciais (acumulação → intensificação → realização). Conjugado: treina várias qualidades na mesma semana com ênfase rotativa. Escolha o modelo pelo tempo até a prova, experiência e esporte.',
  },
  {
    id: 'canon_periodization_02',
    source: 'canon_ef',
    title: 'Macro, meso e microciclos',
    domain: 'periodization',
    tags: ['periodization'],
    content:
      'Macrociclo: temporada completa até a competição. Mesociclo: bloco de 2–6 semanas com foco (base, hipertrofia, força, potência, taper). Microciclo: semana típica com distribuição de sessões, densidades e descanso. Inclua deload a cada 4–8 semanas (redução de 30–50% do volume) para gerir fadiga. Semana de competição: volume baixo, ativações técnicas e recuperação prioritária.',
  },
  {
    id: 'canon_hypertrophy_01',
    source: 'canon_ef',
    title: 'Mecanismos de hipertrofia',
    domain: 'hypertrophy',
    tags: ['hypertrophy', 'volume', 'intensity'],
    content:
      'Hipertrofia responde principalmente a tensão mecânica (cargas desafiadoras em amplitude útil), com contribuições de stress metabólico e dano muscular. Faixa prática frequente: 6–20 reps próximas da falha (0–3 RIR). Volume semanal por grupo muscular costuma crescer com a experiência (ex.: ~6–20 séries duras/semana). Frequência 2×/semana por músculo costuma ser eficiente. Progressão: mais carga, reps ou séries ao longo das semanas.',
  },
  {
    id: 'canon_strength_01',
    source: 'canon_ef',
    title: 'Força máxima e potência',
    domain: 'strength',
    tags: ['strength', 'intensity', 'technique'],
    content:
      'Força máxima: cargas altas (≥80–85% 1RM), poucas reps, descanso longo (2–5 min), técnica impecável. Potência: intenção máxima de aceleração com cargas moderadas e qualidade alta. Na intensificação pré-prova, reduza volume acessório e preserve básicos e transferências específicas do esporte. Evite falha constante em básicos pesados para proteger técnica e articulações.',
  },
  {
    id: 'canon_volume_01',
    source: 'canon_ef',
    title: 'Volume, intensidade e densidade',
    domain: 'programming',
    tags: ['volume', 'intensity', 'density', 'progression'],
    content:
      'Volume = séries × reps × carga (ou séries duras/semana). Intensidade de carga = %1RM; intensidade percebida = RPE/RIR/proximidade da falha. Densidade = trabalho por unidade de tempo (intervalos curtos aumentam densidade). Progressões úteis: +carga mantendo reps; +reps na mesma carga; +séries; reduzir descanso (densidade); melhorar técnica/amplitude. Não progresse tudo ao mesmo tempo — escolha 1–2 alavancas por mesociclo.',
  },
  {
    id: 'canon_rir_01',
    source: 'canon_ef',
    title: 'Buffer vs falha (RIR)',
    domain: 'programming',
    tags: ['intensity', 'hypertrophy', 'strength'],
    content:
      'Falha muscular contínua eleva fadiga e risco técnico, especialmente em compostos pesados. Buffer (1–3 RIR) permite acumular volume de qualidade. Use falha com mais parcimônia em isoladores e no fim da sessão. Em blocos de força (baixas reps), priorize buffer técnico. Em blocos de hipertrofia, aproxime-se mais da falha nas últimas séries. Monitore sinais de overreaching: queda de performance, sono ruim, dor articular persistente.',
  },
  {
    id: 'canon_splits_01',
    source: 'canon_ef',
    title: 'Splits e frequência',
    domain: 'programming',
    tags: ['frequency', 'hypertrophy'],
    content:
      'Full body (2–4×/sem): ótimo para iniciantes e poucas sessões. Upper/Lower (4×): bom equilíbrio volume/frequência. Push/Pull/Legs (3–6×): alto volume por músculo. Bro-split (1× músculo/sem) exige volume alto no dia e recuperação longa — menos ideal para maioria. Ajuste split aos dias disponíveis e à recuperação. Em preparação esportiva, preserve 1–2 dias para especificidade do esporte.',
  },
  {
    id: 'canon_physio_01',
    source: 'canon_physio',
    title: 'Prevenção e gestão de dor',
    domain: 'physiotherapy',
    tags: ['injury_prevention', 'technique', 'recovery'],
    content:
      'Dor aguda intensa, irradiada, edema importante ou perda de força: pare e busque avaliação profissional. Dor muscular de início tardio (DOMS) é comum 24–72h após estímulo novo. Estratégias preventivas: progressão gradual de carga, técnica, aquecimento específico, amplitude controlada, sono e gestão de volume. Em tendinopatias, muitas vezes se usa carga isométrica/progressiva sob orientação — não force amplitude dolorosa “por ego”.',
  },
  {
    id: 'canon_physio_02',
    source: 'canon_physio',
    title: 'Postura, core e estabilidade',
    domain: 'physiotherapy',
    tags: ['injury_prevention', 'technique', 'bodyweight'],
    content:
      'Postura dinâmica importa mais que “postura perfeita estática”. Treine controle de coluna neutra sob carga, respiração e bracing. Core não é só abdominal: inclui anti-extensão, anti-rotação e anti-inclinação (prancha, dead bug, pallof, bird-dog). Rotinas curtas diárias de mobilidade de tórax, quadril e tornozelo melhoram qualidade de agachamento/levantamentos. Em home training, priorize padrões: empurrar, puxar, agachar, hingar, carregar e core.',
  },
  {
    id: 'canon_technique_01',
    source: 'canon_ef',
    title: 'Técnica e seleção de exercícios',
    domain: 'technique',
    tags: ['technique', 'hypertrophy', 'strength'],
    content:
      'Escolha exercícios que o aluno execute com controle e amplitude útil. Compostos (agachamento, hinge, empurrar, puxar) formam a base; isoladores preenchem volume. Varie ângulos e equipamentos para cobrir faixas de comprimento muscular. Corrija erros comuns: joelho valgizando, lombar arredondada no hinge, cotovelos excessivamente abertos no peito, encolher ombros na puxada. Prefira vídeo/GIF de referência e feedback de RIR técnico.',
  },
  {
    id: 'canon_taper_01',
    source: 'canon_ef',
    title: 'Polimento (taper) e pico',
    domain: 'periodization',
    tags: ['periodization', 'recovery', 'intensity'],
    content:
      'Taper típico: reduzir volume 40–60% nas últimas 7–14 dias, manter algum estímulo de intensidade/técnica para não “apagar” o sistema nervoso. Pico: poucas sessões de alta qualidade, muito descanso, nutrição e rotina estáveis. Semana da prova: ativações leves, mobilidade, ensaio técnico e gestão de estresse. Evite testar 1RM novos ou volumes altos perto da competição.',
  },
  {
    id: 'canon_nutrition_01',
    source: 'canon_ef',
    title: 'Nutrição de suporte ao treino',
    domain: 'nutrition',
    tags: ['nutrition', 'hypertrophy', 'recovery'],
    content:
      'Proteína diária frequente em faixas de ~1,6–2,2 g/kg para hipertrofia (individualizar). Em ganho de massa: superávit moderado. Em definição: déficit moderado preservando proteína e volume de treino inteligente. Carboidratos sustentam performance em treinos densos; gorduras apoiam hormônios (não zerar). Hidratação e sono (7–9h) são multiplicadores de adaptação. Ajuste refeições ao horário do treino.',
  },
  {
    id: 'canon_sport_01',
    source: 'canon_ef',
    title: 'Preparação esportiva e especificidade',
    domain: 'sport_prep',
    tags: ['periodization', 'strength', 'technique'],
    content:
      'Na preparação para esporte/competição: 1) mantenha força estrutural, 2) aumente especificidade do gesto conforme a data aproxima, 3) gerencie fadiga residual. Esportes de combate: força + potência + gas tank. Corrida/endurance: base aeróbia + força de suporte + taper. Estéticos/bodybuilding: volume regional + pico de conditioning. Sempre alinhe mesociclos ao calendário da prova e aos dias disponíveis do aluno.',
  },
  {
    id: 'canon_monitoring_01',
    source: 'canon_ef',
    title: 'Monitoramento e ajuste',
    domain: 'coaching',
    tags: ['recovery', 'progression', 'volume'],
    content:
      'Ajuste o plano com dados: cargas, RPE/RIR, adesão, sono, dor, humor e performance. Se o aluno erra meta de sono/recovery, corte volume antes de cortar consistência. Se estagnar 2–3 microciclos, mude progressão ou exercício. Se dor articular cresce, reduza amplitude/carga e troque variação. O melhor programa é o que o aluno consegue cumprir com qualidade técnica.',
  },
  {
    id: 'canon_home_01',
    source: 'canon_ef',
    title: 'Treino em casa e HIIT',
    domain: 'home_training',
    tags: ['bodyweight', 'conditioning', 'hypertrophy'],
    content:
      'Sem equipamentos: use progressões de alavanca (flexão inclinada → no solo → diamante/archer), unilateralidade (afundo, split squat), tempo sob tensão e densidade. HIIT melhora conditioning, mas não substitui sobrecarga progressiva para hipertrofia máxima. Combine blocos de força/técnica com intervalos curtos. Em postura/rotinas rápidas: 5–10 min diários de mobilidade + ativação batem longas sessões irregulares.',
  },
  {
    id: 'canon_ethics_01',
    source: 'canon_ef',
    title: 'Escopo e segurança do coach AI',
    domain: 'coaching',
    tags: ['injury_prevention'],
    content:
      'O agente PERFORMA Coach educa e estrutura treinos com base em evidências e no perfil do aluno. Não diagnostica doenças, não prescreve medicamentos e não substitui médico/fisioterapeuta/treinador presencial. Em sinais de alerta (dor aguda, tontura, dor no peito, lesão recente), oriente procurar profissional. Sempre declare incerteza quando faltarem dados do aluno.',
  },
];
