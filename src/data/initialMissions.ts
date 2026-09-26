import { Badge, Mission, StoreItem } from '../types';

export const INITIAL_MISSION: Mission = {
  id: 'missao-caninde-01',
  title: 'Controle de Vendas da Canindé Distribuidora',
  topic: 'Fórmulas essenciais: SOMA, MÉDIA, SE, MÁXIMO e MÍNIMO',
  companyContext: 'Canindé Distribuidora — atacado de alimentos e bebidas. Fechamento de contas do primeiro trimestre de vendas.',
  difficulty: 'Iniciante',
  rewardXp: 350,
  rewardCoins: 120,
  dialogues: {
    juvenildoIntro: 'Bom dia! Sou Juvenildo Canindé, gerente-geral da distribuidora. O Zequinha me avisou que você veio do EducaTech. Precisamos fechar as contas do primeiro trimestre das quatro rotas de vendas. Calcule o total de cada vendedor, a média da equipe e use a fórmula SE para conferir quem bateu a meta de R$ 15.000. Por fim, aponte a maior e a menor venda para a premiação.',
    zequinhaIntro: 'Opa! Zequinha por aqui. Fique tranquilo: se esquecer um parêntese ou errar a fórmula, aqui tem segunda chance e sua nota não cai. A gente confere junto e você tenta de novo até acertar tudo. Dica prática: toda fórmula começa com "=". Para somar as vendas do Tiago de janeiro a março, digite =SOMA(B4:D4). Vamos nessa!',
    zequinhaTip: 'Dica do Zequinha: para a meta em F4, use =SE(E4>=15000; "Atingiu"; "Abaixo"). Lembre de usar ponto e vírgula (;) para separar os argumentos e aspas duplas no texto.',
    juvenildoReviewSuccess: 'Contas conferidas. Os números da planilha batem com as notas fiscais da distribuidora. Bom trabalho nas fórmulas e na justificativa.',
    safeFailFeedback: 'Dê uma olhada com calma nas células destacadas. Você pode corrigir as fórmulas na segunda chance sem perder ponto.'
  },
  checklist: [
    {
      id: 'c1',
      instruction: 'Calcular o total do 1º vendedor (Tiago Lima) na célula E4 usando =SOMA(B4:D4)',
      requiredFormula: 'SOMA',
      targetCell: 'E4',
      bloomLevel: 'Aplicar',
      hint: 'Digite =SOMA(B4:D4) e aperte Enter na célula E4.'
    },
    {
      id: 'c2',
      instruction: 'Calcular os totais dos outros vendedores (E5, E6 e E7) usando a função =SOMA',
      requiredFormula: 'SOMA',
      targetCell: 'E5:E7',
      bloomLevel: 'Aplicar',
      hint: 'Para Ivone (E5) use =SOMA(B5:D5), para Raimundo (E6) =SOMA(B6:D6) e para Socorro (E7) =SOMA(B7:D7).'
    },
    {
      id: 'c3',
      instruction: 'Verificar se cada vendedor bateu a meta (>= R$ 15.000) na coluna F usando a fórmula =SE',
      requiredFormula: 'SE',
      targetCell: 'F4:F7',
      bloomLevel: 'Analisar',
      hint: 'Em F4 use =SE(E4>=15000; "Atingiu"; "Abaixo"). Repita nas linhas 5, 6 e 7.'
    },
    {
      id: 'c4',
      instruction: 'Calcular o total geral da distribuidora na célula E9 somando todos os vendedores =SOMA(E4:E7)',
      requiredFormula: 'SOMA',
      targetCell: 'E9',
      bloomLevel: 'Entender',
      hint: 'Em E9 digite =SOMA(E4:E7).'
    },
    {
      id: 'c5',
      instruction: 'Calcular a média de vendas da equipe na célula E10 usando =MÉDIA(E4:E7)',
      requiredFormula: 'MÉDIA',
      targetCell: 'E10',
      bloomLevel: 'Analisar',
      hint: 'Em E10 digite =MÉDIA(E4:E7) ou =MEDIA(E4:E7).'
    },
    {
      id: 'c6',
      instruction: 'Identificar a maior venda em E11 (=MÁXIMO(E4:E7)) e a menor venda em E12 (=MÍNIMO(E4:E7))',
      requiredFormula: 'MÁXIMO/MÍNIMO',
      targetCell: 'E11:E12',
      bloomLevel: 'Avaliar',
      hint: 'Em E11 use =MÁXIMO(E4:E7) e em E12 use =MÍNIMO(E4:E7).'
    }
  ],
  bloomCriteria: {
    lembrar: 'Identifica os nomes e a sintaxe das funções: SOMA, MÉDIA, SE, MÁXIMO e MÍNIMO.',
    entender: 'Entende que intervalos como B4:D4 agrupam meses seguidos e que a fórmula SE testa as metas.',
    aplicar: 'Aplica as fórmulas direto nas células para calcular os valores, sem digitar números prontos.',
    analisar: 'Compara os resultados e vê quem superou a meta de 15 mil e quem ficou abaixo.',
    avaliar: 'Explica ao gerente a decisão tomada a partir dos números da tabela.',
    criar: 'Sugere ações práticas para a equipe de vendas com base no resultado apurado.'
  },
  initialGrid: {
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    headers: ['Representante Comercial', 'Janeiro (R$)', 'Fevereiro (R$)', 'Março (R$)', 'Total Trimestre', 'Status da Meta (>= 15.000)'],
    rows: [
      ['Tiago Lima (Cariri)', '4500', '5100', '6200', '', ''],
      ['Ivone Bezerra (Sertão Central)', '5200', '4900', '5400', '', ''],
      ['Raimundo Nonato (Litoral)', '3800', '4200', '3900', '', ''],
      ['Socorro Dantas (Sobral)', '6100', '5800', '6400', '', ''],
      ['---', '---', '---', '---', '---', '---'],
      ['TOTAL GERAL CANINDÉ', '', '', '', '', ''],
      ['MÉDIA POR REPRESENTANTE', '', '', '', '', ''],
      ['MAIOR VENDA DO TRIMESTRE', '', '', '', '', ''],
      ['MENOR VENDA DO TRIMESTRE', '', '', '', '', '']
    ]
  }
};

export const SECONDARY_MISSIONS: Mission[] = [
  {
    id: 'missao-estoque-02',
    title: 'Gestão de Estoque do Sertão',
    topic: 'Condicionais e estoque mínimo: SE, SOMA e MÉDIA',
    companyContext: 'Canindé Distribuidora — armazém de suprimentos, grãos e bebidas.',
    difficulty: 'Intermediário',
    rewardXp: 400,
    rewardCoins: 140,
    dialogues: {
      juvenildoIntro: 'O armazém precisa de controle diário. Com o ritmo de entregas no interior, não podemos deixar faltar milho, feijão ou rapadura. Calcule os saldos e use a fórmula SE para avisar se precisamos comprar com urgência ou se o estoque está regular.',
      zequinhaIntro: 'Prancheta na mão! Se o estoque atual for menor que o mínimo, acionamos a compra. Se errar alguma fórmula, use a segunda chance para ajustar tudo com calma.',
      zequinhaTip: 'Fórmula direta: =SE(C4<D4; "Comprar Urgente"; "Estoque Regular"). Atenção às aspas no texto!',
      juvenildoReviewSuccess: 'Conferência aprovada. Com esses números, evitamos atrasos nas entregas para os comércios parceiros.',
      safeFailFeedback: 'Revise as quantidades e a comparação lógica. Ajuste na segunda chance com nota cheia.'
    },
    checklist: [
      {
        id: 'e1',
        instruction: 'Calcular o estoque total na célula C8 usando =SOMA(C4:C7)',
        requiredFormula: 'SOMA',
        targetCell: 'C8',
        bloomLevel: 'Aplicar',
        hint: 'Some as quantidades de todos os produtos.'
      },
      {
        id: 'e2',
        instruction: 'Calcular a média de estoque de segurança em D9 com =MÉDIA(D4:D7)',
        requiredFormula: 'MÉDIA',
        targetCell: 'D9',
        bloomLevel: 'Analisar',
        hint: 'Use a função MÉDIA nos valores de estoque mínimo de referência.'
      },
      {
        id: 'e3',
        instruction: 'Avaliar o status de reposição em E4:E7 usando =SE(C4<D4; "Comprar"; "Regular")',
        requiredFormula: 'SE',
        targetCell: 'E4:E7',
        bloomLevel: 'Avaliar',
        hint: 'Compare a quantidade atual (coluna C) com o estoque mínimo (coluna D).'
      }
    ],
    bloomCriteria: {
      lembrar: 'Lembra como montar o teste lógico com o operador menor (<).',
      entender: 'Entende a relação entre estoque atual e ponto de reposição.',
      aplicar: 'Usa a fórmula SE para gerar os avisos de compra.',
      analisar: 'Identifica quais itens correm risco de falta no armazém.',
      avaliar: 'Define quais compras são prioritárias com base nos números.',
      criar: 'Propõe um plano simples de reposição para o armazém da distribuidora.'
    },
    initialGrid: {
      columns: ['A', 'B', 'C', 'D', 'E'],
      headers: ['Item em Estoque', 'Unidade', 'Quantidade Atual', 'Estoque Mínimo', 'Status de Reposição'],
      rows: [
        ['Feijão de Corda (Saco 50kg)', 'Sacaria', '85', '120', ''],
        ['Arroz da Terra (Saco 30kg)', 'Sacaria', '210', '150', ''],
        ['Farinha de Mandioca (Saco 50kg)', 'Sacaria', '45', '90', ''],
        ['Rapadura Artesanal (Cx 20un)', 'Caixa', '180', '100', ''],
        ['TOTAL EM ESTOQUE', '', '', '', ''],
        ['MÉDIA DE SEGURANÇA', '', '', '', '']
      ]
    }
  }
];

export const BADGES: Badge[] = [
  {
    id: 'badge-soma',
    name: 'Mestre da SOMA',
    description: 'Calculou os totais com exatidão usando a fórmula =SOMA com os intervalos corretos.',
    icon: 'Sigma',
    bloomLevel: 'Aplicar'
  },
  {
    id: 'badge-media',
    name: 'Detetive de Médias',
    description: 'Calculou a média da equipe com a fórmula =MÉDIA.',
    icon: 'TrendingUp',
    bloomLevel: 'Analisar'
  },
  {
    id: 'badge-se',
    name: 'Lógica Afiada (SE)',
    description: 'Usou a fórmula =SE para testar metas e condições no negócio.',
    icon: 'GitCompare',
    bloomLevel: 'Avaliar'
  },
  {
    id: 'badge-max-min',
    name: 'Olho Clínico (Máx/Mín)',
    description: 'Encontrou o maior e o menor valor de venda da tabela.',
    icon: 'Target',
    bloomLevel: 'Analisar'
  },
  {
    id: 'badge-safe-fail',
    name: 'Persistência de Ouro (Aprender com o Erro)',
    description: 'Aproveitou a segunda chance para ajustar fórmulas e aprender na prática.',
    icon: 'ShieldCheck',
    bloomLevel: 'Entender'
  },
  {
    id: 'badge-auditor-caninde',
    name: 'Auditor Canindé',
    description: 'Concluiu a planilha com exatidão e justificou as recomendações ao gerente.',
    icon: 'Award',
    bloomLevel: 'Criar'
  }
];

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'item-dica-ouro',
    name: 'Dicas de fórmula do Zequinha',
    category: 'ferramenta',
    price: 40,
    description: 'Mostra atalhos práticos e preenchimento guiado com exemplos visuais na planilha.',
    icon: 'Scroll',
    effect: 'Ativa dicas rápidas de fórmulas na tela'
  },
  {
    id: 'item-cafe-juvenildo',
    name: 'Café coado do Juvenildo',
    category: 'perk',
    price: 60,
    description: 'Café forte para dar um gás: rende +25% de XP nas próximas 3 missões.',
    icon: 'Coffee',
    effect: '+25% de XP bônus em todas as atividades'
  },
  {
    id: 'item-auditor-lente',
    name: 'Lente de fórmulas',
    category: 'ferramenta',
    price: 80,
    description: 'Destaca em verde suave as células que usam fórmulas dinâmicas.',
    icon: 'Eye',
    effect: 'Destaque visual para células com cálculos'
  },
  {
    id: 'item-certificado-merito',
    name: 'Distintivo de mérito',
    category: 'visual',
    price: 100,
    description: 'Distintivo no perfil que indica conclusões com boa justificativa.',
    icon: 'Sparkles',
    effect: 'Emblema no perfil e selo na planilha entregue'
  },
  {
    id: 'item-modo-leitor-voz',
    name: 'Leitor de voz assistiva',
    category: 'acessibilidade',
    price: 30,
    description: 'Ajusta a fala automática para leitura dos enunciados e das dicas.',
    icon: 'Volume2',
    effect: 'Narração de voz mais clara para leitura de tela'
  }
];
