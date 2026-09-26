import React from 'react';
import { StoreItem, StudentProfile, AccessibilitySettings } from '../types';
import { 
  ShoppingBag, 
  Coins, 
  Check, 
  Sparkles, 
  Eye, 
  Coffee, 
  Scroll, 
  Volume2, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

interface Props {
  items: StoreItem[];
  student: StudentProfile;
  onPurchase: (item: StoreItem) => void;
  settings: AccessibilitySettings;
  onAnnounce: (msg: string) => void;
}

export const PedagogicalStore: React.FC<Props> = ({
  items,
  student,
  onPurchase,
  settings,
  onAnnounce
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'item-dica-ouro': return <Scroll className="w-5 h-5" />;
      case 'item-cafe-juvenildo': return <Coffee className="w-5 h-5" />;
      case 'item-auditor-lente': return <Eye className="w-5 h-5" />;
      case 'item-certificado-merito': return <Sparkles className="w-5 h-5" />;
      case 'item-modo-leitor-voz': return <Volume2 className="w-5 h-5" />;
      default: return <ShoppingBag className="w-5 h-5" />;
    }
  };

  const handleBuy = (item: StoreItem) => {
    if (student.coins < item.price) {
      onAnnounce('Moedas insuficientes. Conclua missões de planilha para ganhar mais moedas!');
      return;
    }
    onPurchase(item);
    onAnnounce(`Item ${item.name} adquirido com sucesso!`);
  };

  return (
    <div id="pedagogical-store-root" className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 text-slate-950 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-slate-950 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Economia Gamificada • Canindé Distribuidora</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Loja Pedagógica & Central de Vantagens
          </h1>
          <p className="text-xs sm:text-sm text-slate-900 mt-1 max-w-xl font-medium">
            Use as moedas conquistadas nas planilhas para desbloquear atalhos de fórmulas, guias de consulta e recursos de auditoria.
          </p>
        </div>

        {/* Coin Balance Badge */}
        <div className="p-4 rounded-2xl bg-slate-950 text-white flex items-center gap-3 shrink-0 shadow-lg border border-amber-400/40">
          <div className="p-2.5 rounded-xl bg-amber-500 text-amber-950 font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-amber-300 font-medium block">Moedas Canindé</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{student.coins}</span>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isPurchased = student.purchasedItemIds.includes(item.id);
          const canAfford = student.coins >= item.price;

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isPurchased
                  ? 'bg-emerald-500/10 border-emerald-400/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${
                    isPurchased ? 'bg-emerald-600 text-white' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    {getIcon(item.id)}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  <span>Efeito: {item.effect}</span>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold text-sm text-amber-600 dark:text-amber-400">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>{item.price} Moedas</span>
                </div>

                {isPurchased ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Adquirido
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow focus:ring-2 focus:ring-amber-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Comprar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
