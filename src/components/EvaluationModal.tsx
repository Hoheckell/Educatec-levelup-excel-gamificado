import React, { useEffect } from 'react';
import { BloomEvaluation, AccessibilitySettings } from '../types';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Coins, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface Props {
  evaluation: BloomEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
  onReviseSafeFail: () => void;
  settings: AccessibilitySettings;
  onSpeak: (text: string) => void;
  onAnnounce: (msg: string) => void;
}

export const EvaluationModal: React.FC<Props> = ({
  evaluation,
  isOpen,
  onClose,
  onReviseSafeFail,
  settings,
  onSpeak,
  onAnnounce
}) => {
  if (!isOpen || !evaluation) return null;

  useEffect(() => {
    if (evaluation.passed) {
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onAnnounce(`Avaliação concluída com sucesso! Nota ${evaluation.score} de 100. Você recebeu ${evaluation.earnedXp} XP e ${evaluation.earnedCoins} Moedas Canindé.`);
    } else {
      onAnnounce(`Segunda Chance disponível: Nota ${evaluation.score}. Você pode revisar sua planilha sem perda de pontos e conquistar nota 100!`);
    }
  }, [evaluation]);

  const bloomKeys = [
    { key: 'lembrar' as const, label: '1. Lembrar as Fórmulas', color: 'bg-blue-500', desc: 'Reconheceu o nome e a sintaxe de =SOMA, =MÉDIA, =SE' },
    { key: 'entender' as const, label: '2. Entender a Lógica', color: 'bg-cyan-500', desc: 'Compreendeu os intervalos e o objetivo de cada cálculo' },
    { key: 'aplicar' as const, label: '3. Fazer as Contas', color: 'bg-emerald-500', desc: 'Digitou e calculou as fórmulas na planilha' },
    { key: 'analisar' as const, label: '4. Analisar os Números', color: 'bg-amber-500', desc: 'Identificou quem bateu a meta e a dispersão dos dados' },
    { key: 'avaliar' as const, label: '5. Dar sua Opinião', color: 'bg-purple-500', desc: 'Escreveu sua justificativa para a diretoria' },
    { key: 'criar' as const, label: '6. Propor Soluções', color: 'bg-rose-500', desc: 'Sugeriu ações práticas para a Canindé Distribuidora' }
  ];

  return (
    <div 
      id="evaluation-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evaluation-modal-title"
      className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div 
        id="evaluation-modal-container"
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden my-auto transition-colors ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-700'
        }`}
      >
        {/* Banner Header */}
        <div className={`p-6 text-white text-center relative ${
          evaluation.passed 
            ? 'bg-gradient-to-r from-emerald-700 via-[#0f4a27] to-teal-800' 
            : 'bg-gradient-to-r from-amber-700 via-amber-800 to-orange-800'
        }`}>
          <div className="max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider mb-2 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Resultado da sua missão • Canindé Distribuidora</span>
            </div>

            <h2 id="evaluation-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {evaluation.passed ? 'Planilha aprovada!' : 'Segunda chance para corrigir'}
            </h2>

            <p className="text-sm text-emerald-100/90 mt-1">
              Confira as etapas avaliadas no fechamento das contas:
            </p>

            {/* Score circle / badge */}
            <div className="mt-4 inline-flex items-baseline gap-1 px-5 py-2 rounded-2xl bg-white/20 backdrop-blur border border-white/30">
              <span className="text-3xl sm:text-4xl font-black font-mono">
                {evaluation.score}
              </span>
              <span className="text-sm font-bold text-white/80">/ 100 pontos</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Rewards Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500 text-amber-950 font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Moedas Canindé</span>
                <span className="font-bold text-lg text-amber-600 dark:text-amber-400">+{evaluation.earnedCoins}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 text-white font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">XP Pedagógico</span>
                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">+{evaluation.earnedXp} XP</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 col-span-2 sm:col-span-1 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Status da Missão</span>
                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                  {evaluation.passed ? 'Aprovado' : 'Segunda Chance Disponível'}
                </span>
              </div>
            </div>
          </div>

          {/* NPC Feedback Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Juvenildo Canindé */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold text-xs">
                      JC
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      Parecer do Gerente Juvenildo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(`Juvenildo Canindé avalia: ${evaluation.juvenildoComment}`)}
                    className="p-1 rounded text-slate-500 hover:text-emerald-600"
                    title="Ouvir parecer de Juvenildo"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{evaluation.juvenildoComment}"
                </p>
              </div>
            </div>

            {/* Zequinha Silva */}
            <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-xs">
                      ZS
                    </div>
                    <span className="font-bold text-xs text-amber-950 dark:text-amber-200">
                      Comentário do Estagiário Zequinha
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(`Zequinha Silva comenta: ${evaluation.zequinhaComment}`)}
                    className="p-1 rounded text-amber-800 hover:text-amber-900 dark:text-amber-200"
                    title="Ouvir comentário do Zequinha"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  "{evaluation.zequinhaComment}"
                </p>
              </div>
            </div>
          </div>

          {/* Taxonomia de Bloom Breakdown (Escadinha do Excel) */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Desempenho nas etapas de aprendizado
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Como medimos seu progresso: analisamos se você lembrou as fórmulas, entendeu a lógica, calculou os valores corretos, interpretou os resultados e propôs melhorias.
              </p>
            </div>

            <div className="space-y-2.5">
              {bloomKeys.map(({ key, label, color, desc }) => {
                const item = evaluation.bloomAnalysis[key] || { score: 80, feedback: 'Avaliado com sucesso' };
                return (
                  <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 font-bold">{label}</strong>
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 ml-2 hidden sm:inline font-medium">({desc})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {item.score}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full ${color} transition-all duration-500`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-700 dark:text-slate-200 italic font-medium">
                      {item.feedback}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggested Badges */}
          {evaluation.suggestedBadges && evaluation.suggestedBadges.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Conquistas Desbloqueadas nesta Missão:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {evaluation.suggestedBadges.map((bName) => (
                  <span
                    key={bName}
                    className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/40 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {bName}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
            Segunda chance: você pode revisar e ajustar a planilha quantas vezes quiser.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onReviseSafeFail}
              className="flex-1 sm:flex-initial px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors focus:ring-2 focus:ring-amber-400"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Corrigir na Planilha (Segunda Chance)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors focus:ring-2 focus:ring-emerald-400"
            >
              <span>Concluir & Voltar à Central</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
