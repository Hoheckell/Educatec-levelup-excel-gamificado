import React from 'react';
import { AccessibilitySettings } from '../types';
import { 
  Keyboard, 
  UserCheck, 
  Volume2, 
  Subtitles, 
  X, 
  Check, 
  Info,
  Sparkles
} from 'lucide-react';

interface Props {
  settings: AccessibilitySettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updater: (prev: AccessibilitySettings) => AccessibilitySettings) => void;
  onTestSpeech: (text: string) => void;
}

export const AccessibilityModal: React.FC<Props> = ({
  settings,
  isOpen,
  onClose,
  onUpdate,
  onTestSpeech
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="accessibility-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="accessibility-modal-container"
        className={`w-full max-w-2xl rounded-xl border shadow-2xl p-6 transition-colors ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-slate-900 text-slate-100 border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <UserCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-xl font-bold">
                Recursos de acessibilidade e inclusão (WCAG 2.1 AA)
              </h2>
              <p className="text-xs text-slate-400">
                Configurações de leitor de telas, teclado, áudio e legendas personalizadas
              </p>
            </div>
          </div>
          <button
            id="btn-close-accessibility-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:ring-2 focus:ring-amber-400"
            aria-label="Fechar janela de acessibilidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Navegação por Teclado */}
          <section aria-labelledby="keyboard-section-title" className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <h3 id="keyboard-section-title" className="text-sm font-semibold flex items-center gap-2 text-amber-400 mb-2">
              <Keyboard className="w-4 h-4" />
              Navegação por teclado na planilha
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700/50 flex justify-between">
                <span>Mover entre células:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">Setas ↑ ↓ ← →</kbd>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700/50 flex justify-between">
                <span>Editar célula ativa:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">Enter ou F2</kbd>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700/50 flex justify-between">
                <span>Confirmar fórmula/valor:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">Enter</kbd>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700/50 flex justify-between">
                <span>Cancelar edição:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">Esc</kbd>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700/50 flex justify-between">
                <span>Avançar para próxima célula:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">Tab</kbd>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700/50 flex justify-between">
                <span>Retroceder célula:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">Shift + Tab</kbd>
              </div>
            </div>
          </section>

          {/* Áudio & Síntese de Voz */}
          <section aria-labelledby="audio-section-title" className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <h3 id="audio-section-title" className="text-sm font-semibold flex items-center gap-2 text-emerald-400 mb-3">
              <Volume2 className="w-4 h-4" />
              Síntese de voz e áudio assistivo
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-300">
                  Narração automática dos enunciados de Juvenildo Canindé e dicas do estagiário Zequinha Silva.
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <label htmlFor="speech-rate-slider" className="text-xs text-slate-400">Velocidade da voz:</label>
                  <input
                    id="speech-rate-slider"
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.1"
                    value={settings.speechRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdate((prev) => ({ ...prev, speechRate: val }));
                    }}
                    className="w-28 accent-emerald-500"
                  />
                  <span className="text-xs font-mono text-emerald-300">{settings.speechRate}x</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onTestSpeech('Olá! Aqui é a narração assistiva da Canindé Distribuidora no sistema EducaTech.')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-emerald-400 shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Testar Voz
              </button>
            </div>
          </section>

          {/* Legendas Configuráveis */}
          <section aria-labelledby="captions-section-title" className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <h3 id="captions-section-title" className="text-sm font-semibold flex items-center gap-2 text-amber-400 mb-3">
              <Subtitles className="w-4 h-4" />
              Tamanho e contraste das legendas (closed captions)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-300">Tamanho da fonte:</span>
              {(['normal', 'large', 'extralarge'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdate((prev) => ({ ...prev, captionSize: size, captionsEnabled: true }))}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    settings.captionSize === size
                      ? 'bg-amber-500 text-amber-950 font-bold'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {size === 'normal' ? 'Normal (16px)' : size === 'large' ? 'Grande (20px)' : 'Extra Grande (24px)'}
                </button>
              ))}
            </div>
          </section>

          {/* Intérprete Visual / Libras */}
          <section aria-labelledby="libras-section-title" className="p-4 rounded-lg bg-blue-950/40 border border-blue-800/60">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 shrink-0">
                <UserCheck className="w-7 h-7" />
              </div>
              <div className="flex-1 text-xs text-slate-300">
                <h4 id="libras-section-title" className="text-sm font-semibold text-blue-300 mb-1">
                  Suporte visual inclusivo e Libras
                </h4>
                <p className="leading-relaxed">
                  O sistema tem suporte a guia em Língua Brasileira de Sinais (Libras) e linguagem clara, acessível para pessoas surdas ou com deficiência auditiva.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-900/60 text-blue-200 rounded border border-blue-700/50 font-medium">
                    Ativo na barra inferior
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Compatível com softwares de tecnologia assistiva (NVDA, JAWS, VoiceOver)
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm transition-colors focus:ring-2 focus:ring-amber-300"
          >
            Salvar e continuar
          </button>
        </div>
      </div>
    </div>
  );
};
