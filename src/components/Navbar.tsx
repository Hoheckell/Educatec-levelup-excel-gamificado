import React from 'react';
import { StudentProfile, AccessibilitySettings } from '../types';
import { 
  FileSpreadsheet, 
  Coins, 
  Zap, 
  Award, 
  Settings, 
  Sliders, 
  ShoppingBag, 
  Compass, 
  Volume2, 
  Eye,
  ShieldCheck
} from 'lucide-react';

interface Props {
  currentView: 'hub' | 'professor' | 'store';
  onNavigate: (view: 'hub' | 'professor' | 'store') => void;
  student: StudentProfile;
  settings: AccessibilitySettings;
  onOpenAccessibilityModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  student,
  settings,
  onOpenAccessibilityModal
}) => {
  return (
    <header 
      id="main-navigation-header"
      role="banner"
      className={`sticky top-0 z-40 border-b transition-colors ${
        settings.highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-[#0f2b48] text-white border-[#143a60] shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('hub')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg p-1"
            aria-label="Ir para a Central de Missões"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight leading-none text-white">
                  EDUCATECH
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wider">
                  Excel
                </span>
              </div>
              <span className="text-[11px] text-amber-200/90 font-medium block">
                Canindé Distribuidora
              </span>
            </div>
          </button>
        </div>

        {/* Center Nav Views */}
        <nav 
          role="navigation" 
          aria-label="Navegação Principal"
          className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10 text-xs font-semibold"
        >
          <button
            id="nav-link-hub"
            type="button"
            onClick={() => onNavigate('hub')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'hub'
                ? 'bg-amber-500 text-amber-950 font-bold shadow'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Central de Missões</span>
          </button>

          <button
            id="nav-link-professor"
            type="button"
            onClick={() => onNavigate('professor')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'professor'
                ? 'bg-amber-500 text-amber-950 font-bold shadow'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Painel do Professor</span>
          </button>

          <button
            id="nav-link-store"
            type="button"
            onClick={() => onNavigate('store')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'store'
                ? 'bg-amber-500 text-amber-950 font-bold shadow'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Loja Pedagógica</span>
          </button>
        </nav>

        {/* Right Stats & Accessibility Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Coins */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold"
            title="Moedas Canindé disponíveis"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{student.coins}</span>
          </div>

          {/* XP & Level */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold"
            title="Nível e XP acumulado"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Nível {student.level} ({student.xp} XP)</span>
          </div>

          {/* Accessibility Settings Quick Button */}
          <button
            id="btn-open-accessibility-settings"
            type="button"
            onClick={onOpenAccessibilityModal}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:ring-2 focus:ring-amber-400 flex items-center gap-1.5 text-xs font-medium"
            title="Abrir painel de acessibilidade universal WCAG"
            aria-label="Abrir configurações de acessibilidade"
          >
            <Eye className="w-4 h-4 text-amber-300" />
            <span className="hidden lg:inline">Acessibilidade</span>
          </button>
        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-white/10 py-1.5 px-2 bg-black/25 text-xs font-medium">
        <button
          type="button"
          onClick={() => onNavigate('hub')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
            currentView === 'hub' ? 'bg-amber-500 text-amber-950 font-bold' : 'text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Missões</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('professor')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
            currentView === 'professor' ? 'bg-amber-500 text-amber-950 font-bold' : 'text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Professor</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('store')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
            currentView === 'store' ? 'bg-amber-500 text-amber-950 font-bold' : 'text-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Loja</span>
        </button>
      </div>
    </header>
  );
};
