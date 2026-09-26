export type BloomLevelKey = 'lembrar' | 'entender' | 'aplicar' | 'analisar' | 'avaliar' | 'criar';

export interface BloomAnalysisItem {
  score: number;
  feedback: string;
}

export interface BloomEvaluation {
  score: number;
  passed: boolean;
  bloomAnalysis: Record<BloomLevelKey, BloomAnalysisItem>;
  juvenildoComment: string;
  zequinhaComment: string;
  safeFailNotes: string;
  earnedXp: number;
  earnedCoins: number;
  suggestedBadges: string[];
}

export interface ChecklistItem {
  id: string;
  instruction: string;
  requiredFormula: string;
  targetCell: string;
  bloomLevel: 'Lembrar' | 'Entender' | 'Aplicar' | 'Analisar' | 'Avaliar' | 'Criar';
  hint: string;
  completed?: boolean;
  actualFormula?: string;
  actualValue?: string | number;
  errorFeedback?: string;
}

export interface MissionDialogues {
  juvenildoIntro: string;
  zequinhaIntro: string;
  zequinhaTip: string;
  juvenildoReviewSuccess: string;
  safeFailFeedback: string;
}

export interface InitialGridDef {
  columns: string[];
  headers: string[];
  rows: (string | number)[][];
}

export interface Mission {
  id: string;
  title: string;
  topic: string;
  companyContext: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  rewardXp: number;
  rewardCoins: number;
  dialogues: MissionDialogues;
  checklist: ChecklistItem[];
  bloomCriteria: Record<BloomLevelKey, string>;
  initialGrid: InitialGridDef;
}

export interface CellData {
  rawValue: string;
  formula: string;
  computedValue: string | number;
  format?: 'currency' | 'number' | 'text' | 'percent' | 'header';
  isLocked?: boolean;
  isTarget?: boolean;
  hasError?: boolean;
  comment?: string;
}

export type SpreadsheetGrid = Record<string, CellData>;

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  bloomLevel: string;
  unlockedAt?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'ferramenta' | 'perk' | 'acessibilidade' | 'visual';
  price: number;
  description: string;
  icon: string;
  effect: string;
  purchased?: boolean;
}

export interface StudentProfile {
  name: string;
  role: string;
  xp: number;
  level: number;
  coins: number;
  unlockedBadgeIds: string[];
  purchasedItemIds: string[];
  completedMissionIds: string[];
  safeFailRetries: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  speechEnabled: boolean;
  speechRate: number;
  captionsEnabled: boolean;
  captionSize: 'normal' | 'large' | 'extralarge';
  captionContrast: 'dark' | 'yellow' | 'highcontrast';
  librasVideoEnabled: boolean;
  keyboardGuideOpen: boolean;
}
