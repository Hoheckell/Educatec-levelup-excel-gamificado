import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString()
  });
});

// Teacher AI Mission Generator Endpoint
app.post('/api/generate-mission', async (req: Request, res: Response) => {
  const { content, objective, criteria, rubricTopic } = req.body;

  const prompt = `Você é um orientador pedagógico de Excel/Planilhas ambientado na 'Canindé Distribuidora', comércio atacadista do Nordeste.
Personagens:
- Juvenildo Canindé (Gerente experiente, direto, respeitoso, focado na rotina da empresa)
- Zequinha Silva (Estagiário dedicado, bem-humorado, parceiro e com dicas práticas de fórmulas)

Diretrizes de redação em português brasileiro (humanizer-pt-br):
- Escreva de forma direta, clara e humana.
- Elimine clichês de IA, frases feitas, linguagem de marketing e termos vagos (nada de 'cenário', 'crucial', 'fundamental', 'além disso').
- As falas dos personagens devem soar como pessoas reais conversando no trabalho.
- Títulos e textos em caixa baixa (apenas primeira letra e nomes próprios em maiúscula).

Parâmetros informados pelo professor:
- Conteúdo do Excel: ${content || 'Fórmulas SOMA, MÉDIA, SE, MÁXIMO, MÍNIMO'}
- Objetivo Pedagógico: ${objective || 'Capacitar o aluno a analisar dados de vendas e tomar decisões'}
- Critérios do Professor: ${criteria || 'Uso correto das fórmulas, exatidão nos cálculos, interpretação dos resultados'}
- Tópico da Rúbrica: ${rubricTopic || 'Controle de Vendas e Desempenho'}

Retorne APENAS um JSON válido (sem blocos markdown adicionais, sem crases extras) com a seguinte estrutura:
{
  "id": "missao-personalizada-${Date.now()}",
  "title": "Título da Missão",
  "topic": "Tópico curricular",
  "companyContext": "Contexto do problema empresarial na Canindé Distribuidora",
  "difficulty": "Iniciante | Intermediário | Avançado",
  "rewardXp": 350,
  "rewardCoins": 120,
  "dialogues": {
    "juvenildoIntro": "Fala de Juvenildo explicando o problema do negócio de forma direta e acolhedora",
    "zequinhaIntro": "Fala descontraída de Zequinha incentivando o aluno e lembrando de uma fórmula chave",
    "zequinhaTip": "Dica prática de atalho ou sintaxe de fórmula",
    "juvenildoReviewSuccess": "Parecer sóbrio e positivo de Juvenildo confirmando os números",
    "safeFailFeedback": "Feedback construtivo sem punição incentivando a revisão na segunda chance"
  },
  "checklist": [
    {
      "id": "c1",
      "instruction": "Instrução clara para o aluno",
      "requiredFormula": "SOMA ou MÉDIA ou SE ou MÁXIMO ou MÍNIMO",
      "targetCell": "Ex: E4",
      "bloomLevel": "Lembrar | Entender | Aplicar | Analisar | Avaliar | Criar",
      "hint": "Dica prática do Zequinha"
    }
  ],
  "bloomCriteria": {
    "lembrar": "Critério de memorização de sintaxes e nomes de funções",
    "entender": "Critério de compreensão do propósito de cada cálculo",
    "aplicar": "Critério de aplicação correta das fórmulas na planilha",
    "analisar": "Critério de análise comparativa de dados e metas",
    "avaliar": "Critério de julgamento crítico e justificativa prática",
    "criar": "Critério de propor soluções a partir dos números da planilha"
  },
  "initialGrid": {
    "columns": ["A", "B", "C", "D", "E", "F"],
    "headers": ["Item/Vendedor", "Jan", "Fev", "Mar", "Total", "Situação"],
    "rows": [
      ["Tiago Lima", "4500", "5100", "6200", "", ""],
      ["Ivone Bezerra", "5200", "4900", "5400", "", ""],
      ["Raimundo Nonato", "3800", "4200", "3900", "", ""],
      ["Socorro Dantas", "6100", "5800", "6400", "", ""],
      ["TOTAL GERAL", "", "", "", "", ""],
      ["MÉDIA EQUIPE", "", "", "", "", ""],
      ["MAIOR VENDA", "", "", "", "", ""],
      ["MENOR VENDA", "", "", "", "", ""]
    ]
  }
}`;

  const ai = getGeminiClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ success: true, mission: parsed, source: 'gemini-3.8-flash' });
      }
    } catch (err) {
      console.warn('Gemini generate-mission fallback due to error:', err);
    }
  }

  // Robust Rule-Based Generator fallback
  const fallbackMission = {
    id: `missao-${Date.now()}`,
    title: `Missão Educatech: ${content || 'Controle de Vendas da Canindé Distribuidora'}`,
    topic: content || 'Fórmulas SOMA, MÉDIA, SE, MÁXIMO e MÍNIMO',
    companyContext: 'Canindé Distribuidora — fechamento de vendas do trimestre e premiação da equipe comercial.',
    difficulty: 'Intermediário',
    rewardXp: 300,
    rewardCoins: 100,
    dialogues: {
      juvenildoIntro: `Bom dia! Sou Juvenildo Canindé, gerente da distribuidora. Cada número no relatório nos ajuda a tomar decisões justas. Analise a planilha e aplique as fórmulas pedidas.`,
      zequinhaIntro: 'Opa! Zequinha na área. Fique tranquilo: se errar na fórmula, a segunda chance garante que você refaça sem desconto de nota. Vamos lá!',
      zequinhaTip: 'Lembre-se: toda fórmula no Excel começa com o sinal de igual (=). Exemplo: =SOMA(B4:D4) ou =SE(E4>=15000; "Atingiu"; "Abaixo").',
      juvenildoReviewSuccess: 'Contas conferidas. Os números batem com os relatórios da distribuidora. Bom trabalho!',
      safeFailFeedback: 'Errar faz parte do treino. Ajuste as fórmulas na planilha e tente de novo na segunda chance com nota cheia.'
    },
    checklist: [
      {
        id: 'c1',
        instruction: 'Calcular o total de vendas de Tiago Lima na célula E4 usando =SOMA(B4:D4)',
        requiredFormula: 'SOMA',
        targetCell: 'E4',
        bloomLevel: 'Aplicar',
        hint: 'Use =SOMA(B4:D4) para somar os três meses de Tiago.'
      },
      {
        id: 'c2',
        instruction: 'Calcular o total de vendas dos outros vendedores (E5 a E7) usando =SOMA',
        requiredFormula: 'SOMA',
        targetCell: 'E5:E7',
        bloomLevel: 'Aplicar',
        hint: 'Repita a fórmula de soma para Ivone (E5), Raimundo (E6) e Socorro (E7).'
      },
      {
        id: 'c3',
        instruction: 'Verificar na coluna F (F4 a F7) se cada vendedor atingiu a meta de R$ 15.000 usando =SE',
        requiredFormula: 'SE',
        targetCell: 'F4:F7',
        bloomLevel: 'Analisar',
        hint: 'Fórmula recomendada: =SE(E4>=15000; "Atingiu"; "Abaixo")'
      },
      {
        id: 'c4',
        instruction: 'Calcular o total geral da distribuidora na célula E8 com =SOMA(E4:E7)',
        requiredFormula: 'SOMA',
        targetCell: 'E8',
        bloomLevel: 'Entender',
        hint: 'Some todos os totais individuais para obter o total geral da empresa.'
      },
      {
        id: 'c5',
        instruction: 'Calcular a média de vendas da equipe na célula E9 usando =MÉDIA(E4:E7)',
        requiredFormula: 'MÉDIA',
        targetCell: 'E9',
        bloomLevel: 'Analisar',
        hint: 'Use =MÉDIA(E4:E7) para achar a média trimestral por representante.'
      },
      {
        id: 'c6',
        instruction: 'Identificar a maior venda na célula E10 com =MÁXIMO(E4:E7) e a menor em E11 com =MÍNIMO(E4:E7)',
        requiredFormula: 'MÁXIMO/MÍNIMO',
        targetCell: 'E10:E11',
        bloomLevel: 'Avaliar',
        hint: 'Em E10 use =MÁXIMO(E4:E7) e em E11 use =MÍNIMO(E4:E7).'
      }
    ],
    bloomCriteria: {
      lembrar: 'Identifica a sintaxe e os nomes das fórmulas básicas (=SOMA, =MÉDIA, =SE, =MÁXIMO, =MÍNIMO).',
      entender: 'Entende a lógica dos intervalos de células e dos testes condicionais.',
      aplicar: 'Insere fórmulas válidas nas células correspondentes calculando os valores corretos.',
      analisar: 'Compara quais vendedores bateram a meta de vendas do período.',
      avaliar: 'Escreve justificativa prática avaliando a consistência dos dados produzidos.',
      criar: 'Propõe recomendações diretas para a distribuidora com base nos resultados.'
    },
    initialGrid: {
      columns: ['A', 'B', 'C', 'D', 'E', 'F'],
      headers: ['Representante', 'Janeiro (R$)', 'Fevereiro (R$)', 'Março (R$)', 'Total Trimestre', 'Status Meta (>= 15k)'],
      rows: [
        ['Tiago Lima', '4500', '5100', '6200', '', ''],
        ['Ivone Bezerra', '5200', '4900', '5400', '', ''],
        ['Raimundo Nonato', '3800', '4200', '3900', '', ''],
        ['Socorro Dantas', '6100', '5800', '6400', '', ''],
        ['TOTAL GERAL', '', '', '', '', ''],
        ['MÉDIA EQUIPE', '', '', '', '', ''],
        ['MAIOR VENDA', '', '', '', '', ''],
        ['MENOR VENDA', '', '', '', '', '']
      ]
    }
  };

  res.json({ success: true, mission: fallbackMission, source: 'rules-engine' });
});

// Artifact Evaluation according to Bloom's Taxonomy
app.post('/api/evaluate-artifact', async (req: Request, res: Response) => {
  const { sheetValues, formulasUsed, checklistResults, justification, missionTitle } = req.body;

  const prompt = `Você é um orientador que avalia o aprendizado do aluno em planilhas de escritório na missão "${missionTitle || 'Controle de Vendas'}".
Avalie o raciocínio em seis aspectos práticos:
1. Lembrar as Fórmulas (sintaxe como =SOMA, =MÉDIA, =SE)
2. Entender a Lógica (quais colunas e intervalos usar)
3. Fazer as Contas (execução correta nas células)
4. Analisar os Números (quem atingiu a meta ou itens críticos)
5. Dar sua Opinião (justificativa do aluno para o gerente Juvenildo)
6. Propor Soluções (recomendações práticas para a distribuidora)

Diretrizes de redação em português brasileiro (humanizer-pt-br):
- Escreva em português brasileiro natural, direto e humano, sem rodeios.
- Evite clichês de IA ('cenário', 'crucial', 'fundamental', 'além disso', 'em constante evolução', 'vale destacar').
- Sem linguagem promocional ou autoajuda vaga. Fale de dados concretos e ações reais.
- O feedback do Juvenildo deve ser direto e profissional; o do Zequinha deve ser parceiro e prático.
- Lembre que o aluno pode corrigir na segunda chance sem qualquer desconto de nota.

Dados submetidos pelo aluno:
- Fórmulas usadas: ${JSON.stringify(formulasUsed || {})}
- Itens do Checklist atendidos: ${JSON.stringify(checklistResults || [])}
- Justificativa do aluno: "${justification || 'Sem justificativa preenchida'}"
- Amostra de valores calculados: ${JSON.stringify(sheetValues || {})}

Retorne APENAS um JSON válido no formato:
{
  "score": 92,
  "passed": true,
  "bloomAnalysis": {
    "lembrar": { "score": 95, "feedback": "Lembrou a estrutura e os nomes das fórmulas solicitadas." },
    "entender": { "score": 90, "feedback": "Entendeu a lógica dos intervalos para apurar o trimestre." },
    "aplicar": { "score": 95, "feedback": "Inseriu as fórmulas corretamente nas células da planilha." },
    "analisar": { "score": 88, "feedback": "Verificou corretamente quem bateu a meta de vendas." },
    "avaliar": { "score": 85, "feedback": "Explicou com clareza o que os números representam." },
    "criar": { "score": 80, "feedback": "Sugeriu ações coerentes com o resultado apurado." }
  },
  "juvenildoComment": "Parecer sóbrio e profissional de Juvenildo Canindé sobre a planilha",
  "zequinhaComment": "Comentário descontraído e parceiro do estagiário Zequinha Silva",
  "safeFailNotes": "Orientação prática caso o aluno queira revisar na segunda chance",
  "earnedXp": 320,
  "earnedCoins": 110,
  "suggestedBadges": ["Mestre da SOMA", "Lógica Afiada (SE)"]
}`;

  const ai = getGeminiClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ success: true, evaluation: parsed, source: 'gemini-3.8-flash' });
      }
    } catch (err) {
      console.warn('Gemini evaluation fallback due to error:', err);
    }
  }

  // Deterministic pedagogical rule-based assessment fallback
  const completedCount = Array.isArray(checklistResults)
    ? checklistResults.filter((c: { completed?: boolean }) => c.completed).length
    : 0;
  const totalCount = Array.isArray(checklistResults) && checklistResults.length > 0 ? checklistResults.length : 6;
  const ratio = totalCount > 0 ? completedCount / totalCount : 0.8;
  const hasJustification = justification && justification.trim().length > 20;

  const score = Math.round(ratio * 70 + (hasJustification ? 25 : 10) + 5);
  const passed = score >= 60;

  const fallbackEval = {
    score,
    passed,
    bloomAnalysis: {
      lembrar: {
        score: Math.min(100, Math.round(ratio * 90 + 10)),
        feedback: 'Identificou as fórmulas necessárias para os cálculos solicitados.'
      },
      entender: {
        score: Math.min(100, Math.round(ratio * 85 + 12)),
        feedback: 'Compreendeu os intervalos de células da planilha trimestral.'
      },
      aplicar: {
        score: Math.min(100, Math.round(ratio * 95)),
        feedback: `${completedCount} de ${totalCount} cálculos concluídos com fórmulas dinâmicas.`
      },
      analisar: {
        score: Math.min(100, Math.round(ratio * 80 + 15)),
        feedback: 'Comparou o desempenho dos vendedores em relação à meta da empresa.'
      },
      avaliar: {
        score: hasJustification ? 88 : 65,
        feedback: hasJustification
          ? 'Justificativa clara, conectada aos dados da planilha.'
          : 'Vale detalhar melhor sua recomendação ao gerente com base nos números.'
      },
      criar: {
        score: Math.min(100, Math.round(score * 0.9)),
        feedback: 'Proposta prática pronta para a tomada de decisão do gerente.'
      }
    },
    juvenildoComment: passed
      ? 'Muito bom trabalho. Os cálculos estão organizados e os totais conferem com os números do trimestre.'
      : 'Ainda restam valores pendentes na planilha. Revise as fórmulas com calma antes de fechar o relatório. Você pode tentar de novo sem qualquer pressa.',
    zequinhaComment: passed
      ? 'Boa, mandou bem demais! Até o Seu Juvenildo concordou com as contas aqui na gerência.'
      : 'Tranquilo, errar fórmula no começo acontece com todo mundo. Dá uma olhada nas células que apontei e tenta de novo!',
    safeFailNotes: passed
      ? 'Relatório validado. Se quiser, complemente a justificativa para treinar sua argumentação.'
      : 'Dica: veja se todas as fórmulas começam com = e se os intervalos cobrem os três meses (ex: B4:D4). Ajuste na planilha e envie novamente.',
    earnedXp: passed ? 350 : 150,
    earnedCoins: passed ? 120 : 50,
    suggestedBadges: passed ? ['Mestre da SOMA', 'Detetive de Médias', 'Persistência de Ouro (Aprender com o Erro)'] : ['Persistência de Ouro (Aprender com o Erro)']
  };

  res.json({ success: true, evaluation: fallbackEval, source: 'rules-engine' });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EducaTech Planilhas running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
