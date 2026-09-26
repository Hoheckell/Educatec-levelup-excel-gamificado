import React, { useState } from 'react';
import { Mission, AccessibilitySettings } from '../types';
import { 
  Sparkles, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  FileSpreadsheet, 
  PlusCircle, 
  RefreshCw, 
  Eye,
  Award
} from 'lucide-react';

interface Props {
  onPublishMission: (newMission: Mission) => void;
  activeMission: Mission;
  settings: AccessibilitySettings;
  onAnnounce: (msg: string) => void;
}

export const ProfessorPanel: React.FC<Props> = ({
  onPublishMission,
  activeMission,
  settings,
  onAnnounce
}) => {
  const [content, setContent] = useState<string>('Fórmulas SOMA, MÉDIA, SE, MÁXIMO e MÍNIMO');
  const [objective, setObjective] = useState<string>('Capacitar o aluno a tabular dados trimestrais de vendas, calcular métricas estatísticas e avaliar metas comerciais com lógica condicional.');
  const [criteria, setCriteria] = useState<string>('Uso de fórmulas dinâmicas (sem valores digitados manualmente), preenchimento correto dos intervalos e elaboração de justificativa gerencial.');
  const [rubricTopic, setRubricTopic] = useState<string>('Controle de Vendas e Desempenho Trimestral');
  const [difficulty, setDifficulty] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedMission, setGeneratedMission] = useState<Mission | null>(activeMission);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setFeedbackMsg(null);
    onAnnounce('Iniciando geração pedagógica da missão com IA...');

    try {
      const res = await fetch('/api/generate-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          objective,
          criteria,
          rubricTopic,
          difficulty
        })
      });

      const data = await res.json();
      if (data.success && data.mission) {
        setGeneratedMission(data.mission);
        setFeedbackMsg(`Missão gerada com sucesso via ${data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Motor Educatech'}!`);
        onAnnounce('Missão pedagógica gerada e pronta para revisão.');
      } else {
        setFeedbackMsg('Não foi possível gerar com IA no momento. Usando modelo padronizado.');
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg('Erro na conexão. Modelo salvo localmente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    if (generatedMission) {
      onPublishMission(generatedMission);
      setFeedbackMsg('Missão publicada na Central de Missões do Aluno com sucesso!');
      onAnnounce('Missão publicada para os alunos.');
    }
  };

  const handleLoadTemplate = (type: 'vendas' | 'estoque') => {
    if (type === 'vendas') {
      setContent('Fórmulas SOMA, MÉDIA, SE, MÁXIMO e MÍNIMO');
      setObjective('Apuração do fechamento comercial do 1º trimestre e verificação de premiação por metas.');
      setCriteria('Cálculo do total por representante com SOMA, apuração da meta com SE, média geral e identificação de maior/menor venda.');
      setRubricTopic('Controle de Vendas da Canindé Distribuidora');
      setDifficulty('Iniciante');
    } else {
      setContent('Fórmula SE Condicional, SOMA de Estoque e MÉDIA de Segurança');
      setObjective('Gerenciar inventário do armazém da Canindé Distribuidora e emitir alertas automáticos de reposição de suprimentos.');
      setCriteria('Comparação do estoque atual com estoque mínimo via SE e totalização das sacarias disponíveis.');
      setRubricTopic('Gestão de Estoque e Suprimentos do Sertão');
      setDifficulty('Intermediário');
    }
  };

  return (
    <div 
      id="professor-panel-root"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Panel Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
            <Sliders className="w-3.5 h-3.5" />
            <span>Painel de Criação e Rúbrica Pedagógica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Configuração de missões
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Defina o conteúdo, os objetivos e o nível de dificuldade. O sistema estrutura o exercício com a planilha inicial, os diálogos de apoio e a rubrica de correção.
          </p>

          {/* Didactic bridge card */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
            <span className="text-amber-400 font-bold">Didática acessível:</span>
            <span>O sistema apresenta o safe-fail como "segunda chance" e a Taxonomia de Bloom como etapas práticas de raciocínio, facilitando o entendimento dos alunos.</span>
          </div>
        </div>

        {/* Quick Templates Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleLoadTemplate('vendas')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            📋 Modelo: Controle de Vendas
          </button>
          <button
            type="button"
            onClick={() => handleLoadTemplate('estoque')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            📦 Modelo: Estoque do Sertão
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div 
          role="status" 
          className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Grid: Teacher Inputs (Left) + Generated Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            1. Parâmetros pedagógicos do exercício
          </h2>

          <div>
            <label htmlFor="input-conteudo-excel" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Conteúdo do Excel / funções solicitadas:
            </label>
            <input
              id="input-conteudo-excel"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ex: Fórmulas SOMA, MÉDIA, SE, MÁXIMO, MÍNIMO"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="input-objetivo-pedagogico" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Objetivo de aprendizagem (o que o aluno deve saber fazer):
            </label>
            <textarea
              id="input-objetivo-pedagogico"
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Descreva o propósito prático do exercício..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="input-criterios-avaliacao" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Critérios de avaliação e resultado esperado:
            </label>
            <textarea
              id="input-criterios-avaliacao"
              rows={2}
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Ex: Uso obrigatório de sintaxe de fórmulas, precisão no resultado e coerência da justificativa..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="select-dificuldade" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nível de dificuldade:
              </label>
              <select
                id="select-dificuldade"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div>
              <label htmlFor="input-rubrica-topico" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tópico curricular:
              </label>
              <input
                id="input-rubrica-topico"
                type="text"
                value={rubricTopic}
                onChange={(e) => setRubricTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* AI Generation Trigger */}
          <div className="pt-2">
            <button
              id="btn-generate-ai-mission"
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all focus:ring-2 focus:ring-emerald-400"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gerando Missão Padronizada com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Gerar Missão com IA (Gemini 3.8 Flash)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Mission Preview & Bloom Rubric */}
        <div className="lg:col-span-7 space-y-4">
          {generatedMission ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                    Prévia do Exercício Padronizado
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                    {generatedMission.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Empresa: {generatedMission.companyContext}
                  </p>
                </div>

                <button
                  id="btn-publish-mission-to-students"
                  type="button"
                  onClick={handlePublish}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Missão</span>
                </button>
              </div>

              {/* NPCs Briefings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Demanda do Seu Juvenildo:
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                    "{generatedMission.dialogues.juvenildoIntro}"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                  <span className="font-bold text-amber-950 dark:text-amber-200 block mb-1">
                    Dica do Zequinha (segunda chance):
                  </span>
                  <p className="text-[11px] text-amber-900 dark:text-amber-300">
                    "{generatedMission.dialogues.zequinhaIntro}"
                  </p>
                </div>
              </div>

              {/* Checklist Items preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Critérios de correção da planilha:
                </h4>
                <div className="space-y-1.5">
                  {generatedMission.checklist.map((c, i) => (
                    <div
                      key={c.id || i}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300 shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{c.instruction}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-bold uppercase shrink-0">
                        {c.bloomLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloom Taxonomy Rubric preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-500" />
                  Rubrica por nível de aprendizagem:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {Object.entries(generatedMission.bloomCriteria).map(([lvl, crit]) => (
                    <div key={lvl} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                      <strong className="uppercase text-purple-700 dark:text-purple-300 block mb-0.5">
                        {lvl}:
                      </strong>
                      <span className="text-slate-600 dark:text-slate-400 leading-snug">
                        {crit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
              Nenhuma missão em prévia. Configure os parâmetros ao lado e clique em Gerar com IA.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
