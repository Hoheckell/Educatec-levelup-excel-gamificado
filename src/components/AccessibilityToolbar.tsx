import React from 'react';
import { AccessibilitySettings } from '../types';
import { 
  Eye, 
  Volume2, 
  VolumeX, 
  Subtitles, 
  Keyboard, 
  UserCheck, 
  Settings, 
  ZoomIn 
} from 'lucide-react';

interface Props {
  settings: AccessibilitySettings;
  onUpdate: (updater: (prev: AccessibilitySettings) => AccessibilitySettings) => void;
  onAnnounce: (msg: string) => void;
}

export const AccessibilityToolbar: React.FC<Props> = ({ settings, onUpdate, onAnnounce }) => {
  const toggleHighContrast = () => {
    onUpdate((prev) => {
      const next = !prev.highContrast;
      onAnnounce(next ? 'Modo Alto Contraste ativado' : 'Modo Alto Contraste desativado');
      return { ...prev, highContrast: next };
    });
  };

  const toggleSpeech = () => {
    onUpdate((prev) => {
      const next = !prev.speechEnabled;
      onAnnounce(next ? 'Narração de voz assistiva ativada' : 'Narração de voz assistiva desativada');
      return { ...prev, speechEnabled: next };
    });
  };

  const toggleCaptions = () => {
    onUpdate((prev) => {
      const next = !prev.captionsEnabled;
      onAnnounce(next ? 'Legendas visuais ativadas' : 'Legendas visuais desativadas');
      return { ...prev, captionsEnabled: next };
    });
  };

  const toggleLibras = () => {
    onUpdate((prev) => {
      const next = !prev.librasVideoEnabled;
      onAnnounce(next ? 'Janela de vídeo/acessibilidade visual aberta' : 'Janela de vídeo/acessibilidade visual fechada');
      return { ...prev, librasVideoEnabled: next };
    });
  };

  const toggleKeyboardGuide = () => {
    onUpdate((prev) => ({ ...prev, keyboardGuideOpen: !prev.keyboardGuideOpen }));
  };

  return (
    <div 
      id="accessibility-toolbar"
      role="region" 
      aria-label="Barra de Ferramentas de Acessibilidade Universal WCAG" 
      className={`px-3 py-1.5 border-b text-xs flex flex-wrap items-center justify-between gap-2 transition-colors ${
        settings.highContrast 
          ? 'bg-black text-yellow-300 border-yellow-400' 
          : 'bg-slate-900 text-slate-200 border-slate-800'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold flex items-center gap-1.5 tracking-wider uppercase">
          <Eye className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          Acessibilidade WCAG 2.1 AA:
        </span>
        <span className="hidden md:inline text-slate-400 text-[11px]">
          (Navegação por teclado ativa • Suporte a leitor de telas)
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Alto Contraste */}
        <button
          id="btn-toggle-high-contrast"
          type="button"
          onClick={toggleHighContrast}
          aria-pressed={settings.highContrast}
          className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-offset-1 ${
            settings.highContrast
              ? 'bg-yellow-400 text-black font-bold focus:ring-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 focus:ring-amber-400'
          }`}
          title="Ativar/desativar modo de alto contraste para máxima legibilidade"
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Alto Contraste</span>
          <span className="sr-only">{settings.highContrast ? 'Ativado' : 'Desativado'}</span>
        </button>

        {/* Áudio / Voz */}
        <button
          id="btn-toggle-speech"
          type="button"
          onClick={toggleSpeech}
          aria-pressed={settings.speechEnabled}
          className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-offset-1 ${
            settings.speechEnabled
              ? 'bg-emerald-600 text-white font-bold focus:ring-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 focus:ring-amber-400'
          }`}
          title="Ativar narração de voz para textos, dicas e enunciados"
        >
          {settings.speechEnabled ? <Volume2 className="w-3.5 h-3.5" aria-hidden="true" /> : <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />}
          <span>Voz / Áudio</span>
        </button>

        {/* Legendas */}
        <button
          id="btn-toggle-captions"
          type="button"
          onClick={toggleCaptions}
          aria-pressed={settings.captionsEnabled}
          className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-offset-1 ${
            settings.captionsEnabled
              ? 'bg-amber-500 text-amber-950 font-bold focus:ring-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 focus:ring-amber-400'
          }`}
          title="Exibir barra de legendas configuráveis para diálogos e alertas"
        >
          <Subtitles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Legendas CC</span>
        </button>

        {/* Vídeo / Libras */}
        <button
          id="btn-toggle-libras"
          type="button"
          onClick={toggleLibras}
          aria-pressed={settings.librasVideoEnabled}
          className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-offset-1 ${
            settings.librasVideoEnabled
              ? 'bg-blue-600 text-white font-bold focus:ring-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 focus:ring-amber-400'
          }`}
          title="Abrir suporte visual / intérprete de apoio acessível"
        >
          <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Libras / Vídeo</span>
        </button>

        {/* Guia de Teclado */}
        <button
          id="btn-toggle-keyboard-guide"
          type="button"
          onClick={toggleKeyboardGuide}
          aria-expanded={settings.keyboardGuideOpen}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium flex items-center gap-1 focus:ring-2 focus:ring-amber-400"
          title="Ver atalhos de teclado para navegação acessível"
        >
          <Keyboard className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Teclado</span>
        </button>
      </div>
    </div>
  );
};

export const ClosedCaptionsBar: React.FC<{
  caption: string;
  speaker: string;
  settings: AccessibilitySettings;
  onClose: () => void;
  onSpeak?: (text: string) => void;
}> = ({ caption, speaker, settings, onClose, onSpeak }) => {
  if (!settings.captionsEnabled || !caption) return null;

  const sizeClass = 
    settings.captionSize === 'extralarge' ? 'text-xl md:text-2xl py-4' :
    settings.captionSize === 'large' ? 'text-lg md:text-xl py-3' :
    'text-sm md:text-base py-2.5';

  const themeClass = 
    settings.highContrast
      ? 'bg-black text-yellow-300 border-t-2 border-yellow-400'
      : settings.captionContrast === 'yellow'
      ? 'bg-slate-950 text-amber-300 border-t border-amber-500/50'
      : 'bg-slate-900/95 backdrop-blur text-white border-t border-slate-700 shadow-2xl';

  return (
    <aside
      id="closed-captions-container"
      role="region"
      aria-label="Legendas em tempo real"
      className={`fixed bottom-0 inset-x-0 z-30 px-4 md:px-8 flex items-center justify-between gap-4 transition-all duration-200 ${themeClass} ${sizeClass}`}
    >
      <div className="flex items-start md:items-center gap-3 max-w-5xl mx-auto flex-1">
        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40 whitespace-nowrap">
          {speaker}:
        </span>
        <p className="font-medium leading-snug flex-1 select-text">
          {caption}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onSpeak && (
          <button
            type="button"
            onClick={() => onSpeak(`${speaker} disse: ${caption}`)}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            title="Ouvir esta fala em áudio"
            aria-label="Ouvir legenda em voz sintetizada"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          title="Ocultar legenda"
          aria-label="Fechar legenda"
        >
          ✕
        </button>
      </div>
    </aside>
  );
};
