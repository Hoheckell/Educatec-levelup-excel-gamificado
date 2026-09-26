import React from 'react';
import { Mission, StudentProfile, Badge, AccessibilitySettings } from '../types';
import { 
  Play, 
  Award, 
  Coins, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet, 
  TrendingUp, 
  HelpCircle,
  Users,
  Compass,
  Volume2
} from 'lucide-react';

interface Props {
  missions: Mission[];
  student: StudentProfile;
  badges: Badge[];
  onOpenSpreadsheet: (mission: Mission) => void;
  settings: AccessibilitySettings;
  onSpeak: (text: string) => void;
}

export const MissionsHub: React.FC<Props> = ({
  missions,
  student,
  badges,
  onOpenSpreadsheet,
  settings,
  onSpeak
}) => {
  const currentXpMax = student.level * 500;
  const xpPercentage = Math.min(100, Math.round((student.xp / currentXpMax) * 100));

  return (
    <div id="missions-hub-root" className="max-w-6xl mx-auto space-y-8">
      {/* Hero Atmosphere Banner - Canindé Distribuidora */}
      <section 
        aria-labelledby="hub-hero-title"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f2b48] via-[#143a60] to-[#0f4a27] text-white p-6 sm:p-10 shadow-2xl border border-slate-700/50"
      >
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
            <Compass className="w-3.5 h-3.5" />
            <span>EDUCATECH GAMIFICAÇÃO • Canindé Distribuidora</span>
          </div>

          <h1 id="hub-hero-title" className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Central de missões: gestão de planilhas na rotina da empresa
          </h1>

          <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed max-w-2xl">
            Bem-vindo à Canindé Distribuidora. Aqui você pratica Excel resolvendo tarefas comuns de escritório ao lado do gerente Juvenildo Canindé e do estagiário Zequinha Silva. Se errar uma fórmula, fique tranquilo: a segunda chance é garantida e não desconta nota. Você pode revisar quantas vezes precisar, conferir as dicas do Zequinha e entender cada cálculo com calma.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              id="btn-quick-start-demo-mission"
              type="button"
              onClick={() => onOpenSpreadsheet(missions[0])}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold rounded-xl shadow-lg flex items-center gap-2 text-sm transition-all focus:ring-4 focus:ring-amber-300"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Abrir Planilha: {missions[0]?.title || 'Controle de Vendas'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSpeak('Bem-vindo à Canindé Distribuidora. Abra a planilha para calcular os totais e as metas do primeiro trimestre com o apoio do Seu Juvenildo e do Zequinha.')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 flex items-center gap-2 text-sm transition-all"
              title="Ouvir introdução narrada da central"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir apresentação</span>
            </button>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Student Progress & Gamification Stats Card */}
      <section 
        aria-labelledby="student-stats-heading"
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Nível do aluno</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">Nível {student.level}</span>
            <span className="text-[11px] text-emerald-600 font-bold">Iniciante comercial</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${xpPercentage}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30">
          <span className="text-xs text-amber-800 dark:text-amber-300 block font-medium">Moedas Canindé</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{student.coins}</span>
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 mt-1 block">Para usar na loja pedagógica</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
          <span className="text-xs text-emerald-800 dark:text-emerald-300 block font-medium">XP pedagógico</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{student.xp}</span>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 block">{currentXpMax - student.xp} XP para o nível {student.level + 1}</span>
        </div>

        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/30">
          <span className="text-xs text-blue-800 dark:text-blue-300 block font-medium">Segundas chances</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{student.safeFailRetries}</span>
          </div>
          <span className="text-[10px] text-blue-700 dark:text-blue-400 mt-1 block">Revisões sem desconto de nota</span>
        </div>
      </section>

      {/* Student Friendly Learning Guide - Explains Safe-Fail and Bloom in plain everyday Portuguese */}
      <section 
        aria-labelledby="student-guide-heading"
        className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-emerald-50/40 to-sky-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border-2 border-amber-300/70 dark:border-amber-500/30 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-amber-950 shrink-0 shadow-md">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="student-guide-heading" className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                Como funcionam as notas e as tentativas
              </h2>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                Guia rápido
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Aqui o objetivo é aprender fazendo, no ritmo de uma empresa real. Veja os pontos principais:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Box 1: Safe-Fail explained for student */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-850 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-amber-950 font-black text-xs flex items-center justify-center">1</span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-amber-900 dark:text-amber-300">
                    Segunda chance sem desconto de nota
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Se você esquecer um parêntese, errar a sintaxe ou deixar valores em branco, não há punição. O Zequinha indica o que faltou, você reabre a planilha e ajusta as fórmulas até acertar.
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Segunda chance ilimitada para aprender de verdade</span>
                </div>
              </div>

              {/* Box 2: Bloom's Taxonomy explained for student */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-850 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">2</span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-emerald-900 dark:text-emerald-300">
                    Como avaliamos seu progresso
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Não olhamos apenas se o número final bateu. Acompanhamos seis etapas do trabalho:
                </p>
                <ol className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <li><strong>1. Lembrar:</strong> conhecer o nome das fórmulas (<code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">=SOMA</code>, <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">=SE</code>).</li>
                  <li><strong>2. Entender:</strong> saber o que a conta faz e quais colunas usar.</li>
                  <li><strong>3. Fazer:</strong> digitar e calcular os totais na planilha.</li>
                  <li><strong>4. Analisar:</strong> descobrir quem vendeu mais e quem atingiu a meta.</li>
                  <li><strong>5. Opinar:</strong> explicar ao gerente o que os dados mostram.</li>
                  <li><strong>6. Propor:</strong> sugerir soluções com base nos resultados.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lore Showcase: Juvenildo Canindé & Zequinha Silva */}
      <section aria-labelledby="npcs-lore-heading">
        <h2 id="npcs-lore-heading" className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[#0f2b48] dark:text-amber-400" />
          Orientadores da Canindé Distribuidora
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Juvenildo */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0f2b48] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md">
              JC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Juvenildo Canindé
                </h3>
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-bold uppercase">
                  Gerente-geral
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Gerente da distribuidora. Cuida das metas de vendas, do balanço e da clareza dos relatórios contábeis.
              </p>
              <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 italic">
                "Na nossa distribuidora, número certo é respeito com o cliente e com a equipe."
              </div>
            </div>
          </div>

          {/* Card Zequinha */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center font-black text-lg shrink-0 shadow-md">
              ZS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Zequinha Silva
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold uppercase">
                  Estagiário de TI
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Estagiário de TI. Lembra atalhos úteis de teclado, ajuda com a sintaxe das fórmulas e indica como corrigir erros sem estresse.
              </p>
              <div className="mt-2 text-[11px] font-semibold text-amber-700 dark:text-amber-400 italic">
                "Relaxa, mestre! Se o Excel der #VALOR!, a gente conserta na segunda chance e sai com nota 100!"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Missions List */}
      <section aria-labelledby="missions-list-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="missions-list-heading" className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Missões práticas disponíveis
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {missions.length} missões ativas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((m, idx) => {
            const isCompleted = student.completedMissionIds.includes(m.id);

            return (
              <div
                key={m.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                      Missão {idx + 1} • {m.difficulty}
                    </span>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" /> Concluída
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {m.topic}
                  </p>

                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 leading-relaxed">
                    {m.companyContext}
                  </p>

                  {/* Checklist items summary */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Cálculos pedidos na planilha:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                      {m.checklist.slice(0, 3).map((c) => (
                        <li key={c.id} className="truncate">
                          {c.instruction}
                        </li>
                      ))}
                      {m.checklist.length > 3 && (
                        <li className="text-slate-500 italic">
                          + {m.checklist.length - 3} outros critérios de avaliação
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Zap className="w-3.5 h-3.5" /> +{m.rewardXp} XP
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Coins className="w-3.5 h-3.5" /> +{m.rewardCoins} Moedas
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenSpreadsheet(m)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors focus:ring-2 focus:ring-emerald-400"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>{isCompleted ? 'Reabrir planilha' : 'Iniciar missão'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges Gallery */}
      <section aria-labelledby="badges-gallery-heading">
        <h2 id="badges-gallery-heading" className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          Medalhas de conquista no Excel
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((b) => {
            const isUnlocked = student.unlockedBadgeIds.includes(b.id);
            const levelLabelMap: Record<string, string> = {
              'Lembrar': 'Lembrar Fórmulas',
              'Entender': 'Entender Lógica',
              'Aplicar': 'Fazer Contas',
              'Analisar': 'Analisar Dados',
              'Avaliar': 'Tomar Decisões',
              'Criar': 'Propor Ideias'
            };
            const friendlyLevel = levelLabelMap[b.bloomLevel] || b.bloomLevel;

            return (
              <div
                key={b.id}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-400/50 text-slate-900 dark:text-slate-100'
                    : 'bg-slate-100/60 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 opacity-60 text-slate-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                  isUnlocked ? 'bg-amber-500 text-amber-950 shadow-md' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'
                }`}>
                  <Award className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-xs leading-tight">{b.name}</h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold mt-1 inline-block">
                    {friendlyLevel}
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
