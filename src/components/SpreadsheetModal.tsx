import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mission, 
  SpreadsheetGrid, 
  CellData, 
  ChecklistItem, 
  AccessibilitySettings,
  BloomEvaluation 
} from '../types';
import { 
  evaluateFormula, 
  formatValue, 
  colLetterToIndex, 
  colIndexToLetter 
} from '../utils/excelEngine';
import { 
  FileSpreadsheet, 
  X, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldAlert, 
  RotateCcw, 
  Send, 
  Lightbulb, 
  Check, 
  BookOpen, 
  MessageSquare,
  Award
} from 'lucide-react';

interface Props {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  onEvaluate: (
    grid: SpreadsheetGrid,
    formulasUsed: Record<string, string>,
    checklist: ChecklistItem[],
    justification: string
  ) => Promise<void>;
  settings: AccessibilitySettings;
  onSpeak: (text: string) => void;
  onAnnounce: (msg: string) => void;
  isEvaluating: boolean;
  evaluationResult: BloomEvaluation | null;
  hasAuditorPerk?: boolean;
}

const createInitialGrid = (mission: Mission): SpreadsheetGrid => {
  const initial: SpreadsheetGrid = {};
  const cols = mission.initialGrid.columns;

  // Row 1: Company Header
  cols.forEach((col, idx) => {
    const addr = `${col}1`;
    initial[addr] = {
      rawValue: idx === 0 ? 'CANINDÉ DISTRIBUIDORA LTDA' : '',
      formula: '',
      computedValue: idx === 0 ? 'CANINDÉ DISTRIBUIDORA LTDA' : '',
      format: 'header',
      isLocked: true
    };
  });

  // Row 2: Report Subtitle
  cols.forEach((col, idx) => {
    const addr = `${col}2`;
    initial[addr] = {
      rawValue: idx === 0 ? 'DEMONSTRATIVO DE VENDAS E METAS - 1º TRIMESTRE' : '',
      formula: '',
      computedValue: idx === 0 ? 'DEMONSTRATIVO DE VENDAS E METAS - 1º TRIMESTRE' : '',
      format: 'header',
      isLocked: true
    };
  });

  // Row 3: Column Headers
  cols.forEach((col, idx) => {
    const addr = `${col}3`;
    initial[addr] = {
      rawValue: mission.initialGrid.headers[idx] || '',
      formula: '',
      computedValue: mission.initialGrid.headers[idx] || '',
      format: 'header',
      isLocked: true
    };
  });

  // Content rows (Rows 4 to N+3)
  mission.initialGrid.rows.forEach((rowVals, rIdx) => {
    const rowNum = rIdx + 4;
    cols.forEach((col, cIdx) => {
      const addr = `${col}${rowNum}`;
      const raw = rowVals[cIdx] !== undefined ? String(rowVals[cIdx]) : '';
      const isHeaderRow = rIdx >= mission.initialGrid.rows.length - 4 && cIdx === 0;
      const isCurrency = cIdx >= 1 && cIdx <= 4;

      initial[addr] = {
        rawValue: raw,
        formula: '',
        computedValue: isCurrency && !isNaN(Number(raw)) && raw !== '' ? Number(raw) : raw,
        format: isCurrency ? 'currency' : isHeaderRow ? 'header' : 'text',
        isLocked: (cIdx < 4 && rIdx < 4) || (cIdx === 0) || raw === '---'
      };
    });
  });

  return initial;
};

export const SpreadsheetModal: React.FC<Props> = ({
  mission,
  isOpen,
  onClose,
  onEvaluate,
  settings,
  onSpeak,
  onAnnounce,
  isEvaluating,
  evaluationResult,
  hasAuditorPerk = false
}) => {
  // Grid dimensions
  const colHeaders = mission.initialGrid.columns;
  const numRows = mission.initialGrid.rows.length + 3;

  // Active selection state
  const [selectedCell, setSelectedCell] = useState<string>('E4');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editInputVal, setEditInputVal] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [safeFailAlertOpen, setSafeFailAlertOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'inicio' | 'formulas' | 'acessibilidade'>('inicio');

  // Input ref
  const cellInputRef = useRef<HTMLInputElement | null>(null);
  const formulaInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize spreadsheet grid (persists when modal closes/re-opens for Safe-Fail revisions)
  const [grid, setGrid] = useState<SpreadsheetGrid>(() => createInitialGrid(mission));

  // Reset grid if user switches to a different mission
  const currentMissionIdRef = useRef(mission.id);
  useEffect(() => {
    if (currentMissionIdRef.current !== mission.id) {
      currentMissionIdRef.current = mission.id;
      setGrid(createInitialGrid(mission));
      setJustification('');
      setSelectedCell('E4');
      setSafeFailAlertOpen(false);
    }
  }, [mission]);

  // Keep cell input value in sync with selected cell
  useEffect(() => {
    const cell = grid[selectedCell];
    const val = cell ? (cell.formula || (cell.rawValue !== undefined ? String(cell.rawValue) : '')) : '';
    setEditInputVal(val);
  }, [selectedCell, grid]);

  // Real-time checklist evaluator
  const checklistStatus = useMemo(() => {
    return mission.checklist.map((item) => {
      let isCompleted = false;
      let actualVal: string | number = '';
      let actualForm = '';

      if (item.id === 'c1') {
        const cell = grid['E4'];
        if (cell) {
          actualForm = cell.formula || cell.rawValue;
          actualVal = cell.computedValue;
          const formulaMatch = /SOMA|SUM/i.test(actualForm);
          const valMatch = Number(actualVal) === 15800;
          isCompleted = formulaMatch && valMatch;
        }
      } else if (item.id === 'c2') {
        const e5 = grid['E5'];
        const e6 = grid['E6'];
        const e7 = grid['E7'];
        const allPresent = e5 && e6 && e7;
        const formulasPresent = allPresent &&
          /SOMA|SUM/i.test(e5.formula || e5.rawValue) &&
          /SOMA|SUM/i.test(e6.formula || e6.rawValue) &&
          /SOMA|SUM/i.test(e7.formula || e7.rawValue);
        const valuesCorrect = allPresent &&
          Number(e5.computedValue) === 15500 &&
          Number(e6.computedValue) === 11900 &&
          Number(e7.computedValue) === 18300;
        isCompleted = formulasPresent && valuesCorrect;
      } else if (item.id === 'c3') {
        const f4 = grid['F4'];
        const f5 = grid['F5'];
        const f6 = grid['F6'];
        const f7 = grid['F7'];
        const allPresent = f4 && f5 && f6 && f7;
        const hasIfFormula = allPresent && (
          /SE|IF/i.test(f4.formula || f4.rawValue) ||
          /SE|IF/i.test(f5.formula || f5.rawValue)
        );
        const correctLogic = allPresent &&
          String(f4.computedValue).toLowerCase().includes('atingiu') &&
          String(f5.computedValue).toLowerCase().includes('atingiu') &&
          (String(f6.computedValue).toLowerCase().includes('abaixo') || String(f6.computedValue).toLowerCase().includes('não')) &&
          String(f7.computedValue).toLowerCase().includes('atingiu');
        isCompleted = hasIfFormula && correctLogic;
      } else if (item.id === 'c4') {
        const e8 = grid['E8'] || grid['E7']; // Total Geral row
        const cell = grid['E7']?.computedValue === 61500 ? grid['E7'] : grid['E8'] || grid['E9'] || grid['E6'];
        // Check anywhere in column E for 61500
        const found = Object.entries(grid).find(([addr, c]) => addr.startsWith('E') && Number(c.computedValue) === 61500 && /SOMA|SUM/i.test(c.formula || c.rawValue));
        isCompleted = Boolean(found);
      } else if (item.id === 'c5') {
        // Average: 15375
        const found = Object.entries(grid).find(([addr, c]) => addr.startsWith('E') && (Math.abs(Number(c.computedValue) - 15375) < 1) && /MÉDIA|MEDIA|AVERAGE/i.test(c.formula || c.rawValue));
        isCompleted = Boolean(found);
      } else if (item.id === 'c6') {
        // Max (18300) and Min (11900)
        const hasMax = Object.entries(grid).some(([addr, c]) => addr.startsWith('E') && Number(c.computedValue) === 18300 && /MÁXIMO|MAXIMO|MAX/i.test(c.formula || c.rawValue));
        const hasMin = Object.entries(grid).some(([addr, c]) => addr.startsWith('E') && Number(c.computedValue) === 11900 && /MÍNIMO|MINIMO|MIN/i.test(c.formula || c.rawValue));
        isCompleted = hasMax && hasMin;
      }

      return {
        ...item,
        completed: isCompleted,
        actualFormula: actualForm,
        actualValue: actualVal
      };
    });
  }, [grid, mission.checklist]);

  const completedCount = checklistStatus.filter((c) => c.completed).length;
  const progressPercent = Math.round((completedCount / checklistStatus.length) * 100);

  // Update a cell's value and re-evaluate dependent formulas
  const updateCellValue = (addr: string, raw: string) => {
    setGrid((prev) => {
      const next = { ...prev };
      const currentCell = next[addr] || { rawValue: '', formula: '', computedValue: '' };

      const isFormula = raw.trim().startsWith('=');
      const formula = isFormula ? raw.trim() : '';
      const rawValue = isFormula ? raw.trim() : raw;

      // Temporary update to allow evaluation
      next[addr] = {
        ...currentCell,
        rawValue,
        formula,
        computedValue: rawValue
      };

      // Recalculate all cells with formulas
      let changed = true;
      let passes = 0;
      while (changed && passes < 4) {
        changed = false;
        passes++;
        for (const [cellKey, cellData] of Object.entries(next)) {
          if (cellData.formula) {
            const evaluated = evaluateFormula(cellData.formula, next);
            if (evaluated.result !== cellData.computedValue) {
              next[cellKey] = {
                ...cellData,
                computedValue: evaluated.result,
                hasError: Boolean(evaluated.error)
              };
              changed = true;
            }
          }
        }
      }

      return next;
    });
  };

  const commitEdit = (newVal?: string) => {
    const valToCommit = newVal !== undefined ? newVal : editInputVal;
    updateCellValue(selectedCell, valToCommit);
    setIsEditing(false);
    onAnnounce(`Célula ${selectedCell} atualizada para ${valToCommit}`);
  };

  // Keyboard navigation within the Excel grid
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    const match = selectedCell.match(/^([A-Z]+)([0-9]+)$/);
    if (!match) return;

    const colLetter = match[1];
    const rowNum = parseInt(match[2], 10);
    const colIdx = colLetterToIndex(colLetter);

    if (isEditing) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitEdit();
        // Move down
        const nextCell = `${colLetter}${Math.min(numRows + 1, rowNum + 1)}`;
        setSelectedCell(nextCell);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsEditing(false);
        const cell = grid[selectedCell];
        setEditInputVal(cell ? cell.formula || String(cell.rawValue) : '');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        commitEdit();
        const nextCol = colIndexToLetter(Math.min(colHeaders.length - 1, colIdx + 1));
        setSelectedCell(`${nextCol}${rowNum}`);
      }
      return;
    }

    // Navigation mode
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextRow = Math.max(1, rowNum - 1);
      setSelectedCell(`${colLetter}${nextRow}`);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = Math.min(numRows + 1, rowNum + 1);
      setSelectedCell(`${colLetter}${nextRow}`);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextCol = colIndexToLetter(Math.max(0, colIdx - 1));
      setSelectedCell(`${nextCol}${rowNum}`);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextCol = colIndexToLetter(Math.min(colHeaders.length - 1, colIdx + 1));
      setSelectedCell(`${nextCol}${rowNum}`);
    } else if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      setIsEditing(true);
      setTimeout(() => cellInputRef.current?.focus(), 50);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const nextCol = colIndexToLetter(Math.min(colHeaders.length - 1, colIdx + 1));
      setSelectedCell(`${nextCol}${rowNum}`);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Start typing directly into cell
      setIsEditing(true);
      setEditInputVal(e.key);
      setTimeout(() => cellInputRef.current?.focus(), 50);
    }
  };

  const insertFormulaSnippet = (template: string) => {
    setEditInputVal(template);
    setIsEditing(true);
    updateCellValue(selectedCell, template);
    onAnnounce(`Fórmula ${template} inserida na célula ${selectedCell}`);
    setTimeout(() => formulaInputRef.current?.focus(), 50);
  };

  const handleSubmitArtifact = async () => {
    // Collect formulas used
    const formulasUsed: Record<string, string> = {};
    for (const [addr, cell] of Object.entries(grid)) {
      if (cell.formula) {
        formulasUsed[addr] = cell.formula;
      }
    }

    // Check Safe-Fail condition: if completed criteria is below 50% or justification is empty
    if (completedCount < 3 && !safeFailAlertOpen) {
      setSafeFailAlertOpen(true);
      onAnnounce('Segunda Chance ativada: Você possui fórmulas pendentes de revisão. Sem desconto de nota, revise com as dicas de Zequinha!');
      return;
    }

    await onEvaluate(grid, formulasUsed, checklistStatus, justification);
  };

  return (
    <div
      id="spreadsheet-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-excel-title"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col p-2 sm:p-4 overflow-hidden ${
        isOpen ? '' : 'hidden pointer-events-none'
      }`}
    >
      <div 
        id="spreadsheet-window-container"
        className={`flex-1 flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-colors ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700'
        }`}
      >
        {/* Top Header / Excel Titlebar */}
        <div className="bg-[#0f4a27] text-white px-3 py-2 flex items-center justify-between select-none border-b border-[#0b381d]">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/10 rounded">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="modal-excel-title" className="font-bold text-sm sm:text-base leading-tight text-white">
                  {mission.title} — Planilha EducaTech
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 text-[10px] font-bold rounded border border-emerald-400/40">
                  Canindé Distribuidora
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 hidden sm:block">
                Simulação de escritório • Errou? Corrija sem perder ponto • Da fórmula à decisão comercial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Safe-Fail Badge indicator */}
            <div 
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 text-amber-200 border border-amber-400/40 text-xs font-bold"
              title="Aqui errar não tira ponto! Você pode testar, receber dicas do Zequinha e ajustar as fórmulas sem penalidade de nota."
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>Segunda chance ativa (erros não tiram ponto)</span>
            </div>

            {/* Close button */}
            <button
              id="btn-close-spreadsheet-modal"
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/15 rounded-lg text-white transition-colors focus:ring-2 focus:ring-amber-400"
              aria-label="Fechar planilha e voltar à central"
              title="Fechar janela (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Excel Ribbon / Menu Tabs */}
        <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3 py-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('inicio')}
              className={`px-3 py-1 rounded font-bold transition-colors ${
                activeTab === 'inicio'
                  ? 'bg-white dark:bg-slate-700 text-[#0f4a27] dark:text-emerald-300 shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Página inicial
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('formulas')}
              className={`px-3 py-1 rounded font-bold transition-colors ${
                activeTab === 'formulas'
                  ? 'bg-white dark:bg-slate-700 text-[#0f4a27] dark:text-emerald-300 shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Biblioteca de fórmulas
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-200 text-[11px] font-medium">
              Progresso do checklist: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{progressPercent}%</strong> ({completedCount}/{checklistStatus.length})
            </span>
          </div>
        </div>

        {/* Formula Quick-Insert Bar */}
        <div className="bg-slate-50 dark:bg-slate-850 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Inserir fórmula:
          </span>
          <button
            type="button"
            onClick={() => insertFormulaSnippet('=SOMA(B4:D4)')}
            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 dark:bg-emerald-900/80 dark:hover:bg-emerald-800 dark:text-emerald-100 rounded font-mono font-bold border border-emerald-400 dark:border-emerald-600 transition-colors"
            title="Inserir soma de intervalo"
          >
            + =SOMA()
          </button>
          <button
            type="button"
            onClick={() => insertFormulaSnippet('=MÉDIA(E4:E7)')}
            className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-950 dark:bg-blue-900/80 dark:hover:bg-blue-800 dark:text-blue-100 rounded font-mono font-bold border border-blue-400 dark:border-blue-600 transition-colors"
            title="Inserir média de intervalo"
          >
            + =MÉDIA()
          </button>
          <button
            type="button"
            onClick={() => insertFormulaSnippet('=SE(E4>=15000; "Atingiu"; "Abaixo")')}
            className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-950 dark:bg-purple-900/80 dark:hover:bg-purple-800 dark:text-purple-100 rounded font-mono font-bold border border-purple-400 dark:border-purple-600 transition-colors"
            title="Inserir teste condicional SE"
          >
            + =SE(teste; V; F)
          </button>
          <button
            type="button"
            onClick={() => insertFormulaSnippet('=MÁXIMO(E4:E7)')}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 dark:bg-amber-900/80 dark:hover:bg-amber-800 dark:text-amber-100 rounded font-mono font-bold border border-amber-400 dark:border-amber-600 transition-colors"
            title="Inserir maior valor"
          >
            + =MÁXIMO()
          </button>
          <button
            type="button"
            onClick={() => insertFormulaSnippet('=MÍNIMO(E4:E7)')}
            className="px-2.5 py-1 bg-orange-100 hover:bg-orange-200 text-orange-950 dark:bg-orange-900/80 dark:hover:bg-orange-800 dark:text-orange-100 rounded font-mono font-bold border border-orange-400 dark:border-orange-600 transition-colors"
            title="Inserir menor valor"
          >
            + =MÍNIMO()
          </button>
        </div>

        {/* Formula Bar */}
        <div className="bg-white dark:bg-slate-900 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs">
          {/* Active cell namebox */}
          <div className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold text-center text-slate-900 dark:text-slate-100">
            {selectedCell}
          </div>

          <span className="font-serif italic font-bold text-slate-600 dark:text-slate-300 text-sm px-1">
            fx
          </span>

          {/* Formula text input */}
          <input
            ref={formulaInputRef}
            id="excel-formula-bar-input"
            type="text"
            value={editInputVal}
            onChange={(e) => {
              setEditInputVal(e.target.value);
              updateCellValue(selectedCell, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitEdit();
              }
            }}
            placeholder="Digite um valor ou fórmula iniciando com = (ex: =SOMA(B4:D4))"
            className="flex-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
            aria-label={`Barra de fórmulas para a célula ${selectedCell}`}
          />
        </div>

        {/* Main Content Area: Grid (Left) + Sidebar (Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Spreadsheet Grid Container */}
          <div 
            className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 flex flex-col"
            onKeyDown={handleGridKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Grade da Planilha do Excel"
          >
            <div className="inline-block min-w-full bg-white dark:bg-slate-900 shadow-md border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
              <table 
                role="grid" 
                aria-label="Tabela de Vendas da Canindé Distribuidora"
                className="w-full border-collapse text-xs text-slate-900 dark:text-slate-100"
              >
                <thead>
                  <tr role="row" className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    <th scope="col" className="w-12 p-1.5 text-center font-bold border border-slate-300 dark:border-slate-700 bg-slate-300 dark:bg-slate-800 text-slate-900 dark:text-slate-100 select-none">
                      #
                    </th>
                    {colHeaders.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="p-1.5 text-center font-bold border border-slate-300 dark:border-slate-700 select-none min-w-[110px] bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1: Company Title Header */}
                  <tr role="row" className="bg-slate-100 dark:bg-slate-850 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-1.5 text-center border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-slate-100 select-none">
                      1
                    </td>
                    <td colSpan={colHeaders.length} className="p-2 border border-slate-300 dark:border-slate-700 font-black text-xs text-[#0f4a27] dark:text-emerald-300 tracking-wider">
                      🏢 CANINDÉ DISTRIBUIDORA LTDA • GESTÃO COMERCIAL
                    </td>
                  </tr>

                  {/* Row 2: Subtitle */}
                  <tr role="row" className="bg-slate-50 dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300">
                    <td className="p-1.5 text-center border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-slate-100 select-none">
                      2
                    </td>
                    <td colSpan={colHeaders.length} className="p-1.5 px-2 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 italic">
                      📊 Fechamento Trimestral de Vendas e Acompanhamento de Metas (Jan / Fev / Mar)
                    </td>
                  </tr>

                  {/* Row 3: Column Headers */}
                  <tr role="row" className="bg-slate-200 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-1.5 text-center border border-slate-300 dark:border-slate-700 bg-slate-300 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-slate-100 select-none">
                      3
                    </td>
                    {colHeaders.map((col, idx) => {
                      const addr = `${col}3`;
                      const cell = grid[addr];
                      return (
                        <td
                          key={addr}
                          role="gridcell"
                          aria-selected={selectedCell === addr}
                          onClick={() => setSelectedCell(addr)}
                          className={`p-2 border border-slate-300 dark:border-slate-700 font-bold text-center text-slate-900 dark:text-slate-100 ${
                            selectedCell === addr ? 'ring-2 ring-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/60' : ''
                          }`}
                        >
                          {cell?.rawValue || mission.initialGrid.headers[idx]}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Rows 4 to N+3 */}
                  {mission.initialGrid.rows.map((rowVals, rIdx) => {
                    const rowNum = rIdx + 4;
                    const isDivider = rowVals[0] === '---';
                    const isTotalRow = rIdx >= 5;

                    if (isDivider) {
                      return (
                        <tr key={rowNum} role="row" className="bg-slate-200/60 dark:bg-slate-800/60">
                          <td className="p-1 text-center border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 font-mono font-bold text-slate-500 select-none text-[10px]">
                            {rowNum}
                          </td>
                          <td colSpan={colHeaders.length} className="p-1 border border-slate-300 dark:border-slate-700 text-center text-[10px] text-slate-500 font-mono">
                            ──────────────────────────────────────────────────────────────────────
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr 
                        key={rowNum} 
                        role="row" 
                        className={
                          isTotalRow 
                            ? 'bg-slate-100/90 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-slate-100' 
                            : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-900 dark:text-slate-100'
                        }
                      >
                        {/* Row Index */}
                        <td className="p-1.5 text-center border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-slate-100 select-none">
                          {rowNum}
                        </td>

                        {/* Cells */}
                        {colHeaders.map((col, cIdx) => {
                          const addr = `${col}${rowNum}`;
                          const cell = grid[addr];
                          const isSelected = selectedCell === addr;
                          const isTarget = (col === 'E' || col === 'F') && (rowNum >= 4 && rowNum <= 7 || rowNum >= 9);
                          const isCalculatedFormula = Boolean(cell?.formula);

                          // Formatting styles
                          let alignClass = 'text-left';
                          if (cIdx >= 1 && cIdx <= 4) alignClass = 'text-right font-mono';
                          if (col === 'F') alignClass = 'text-center font-medium';

                          let statusBadgeClass = '';
                          if (col === 'F' && cell?.computedValue) {
                            const strVal = String(cell.computedValue).toLowerCase();
                            if (strVal.includes('atingiu') || strVal.includes('meta ok')) {
                              statusBadgeClass = 'text-emerald-800 dark:text-emerald-300 font-black';
                            } else if (strVal.includes('abaixo') || strVal.includes('não')) {
                              statusBadgeClass = 'text-rose-700 dark:text-rose-300 font-black';
                            }
                          }

                          return (
                            <td
                              key={addr}
                              role="gridcell"
                              aria-selected={isSelected}
                              aria-label={`Célula ${addr}: ${cell?.computedValue ?? 'Vazio'}`}
                              onClick={() => {
                                setSelectedCell(addr);
                                if (isSelected) {
                                  setIsEditing(true);
                                }
                              }}
                              onDoubleClick={() => {
                                setSelectedCell(addr);
                                setIsEditing(true);
                              }}
                              className={`p-1.5 border border-slate-300 dark:border-slate-700 relative cursor-pointer select-none transition-all text-slate-900 dark:text-slate-100 font-medium ${alignClass} ${
                                isSelected 
                                  ? 'ring-2 ring-emerald-600 z-10 bg-emerald-100/80 dark:bg-emerald-950/70 font-bold' 
                                  : isTarget
                                  ? 'bg-amber-100/60 dark:bg-amber-950/60 text-amber-950 dark:text-amber-100'
                                  : ''
                              } ${
                                hasAuditorPerk && isCalculatedFormula
                                  ? 'outline outline-1 outline-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/50'
                                  : ''
                              }`}
                            >
                              {isSelected && isEditing ? (
                                <input
                                  ref={cellInputRef}
                                  type="text"
                                  value={editInputVal}
                                  onChange={(e) => setEditInputVal(e.target.value)}
                                  onBlur={() => commitEdit()}
                                  onKeyDown={handleGridKeyDown}
                                  className="w-full p-0.5 font-mono text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-none outline-none ring-2 ring-emerald-500 rounded"
                                  autoFocus
                                />
                              ) : (
                                <div className="flex items-center justify-between gap-1 overflow-hidden">
                                  <span className={`truncate font-medium text-slate-900 dark:text-slate-100 ${statusBadgeClass}`}>
                                    {formatValue(cell?.computedValue ?? '', cell?.format)}
                                  </span>

                                  {/* Formula indicator icon */}
                                  {isCalculatedFormula && (
                                    <span 
                                      className="text-[9px] px-1 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 font-mono font-bold shrink-0 border border-emerald-400 dark:border-emerald-600"
                                      title={`Fórmula: ${cell?.formula}`}
                                    >
                                      fx
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick Helper below grid */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 gap-2">
              <div>
                <span>💡 <strong>Dica de navegação:</strong> Use as <strong>Setas</strong> para andar, <strong>Enter</strong> para editar e <strong>Tab</strong> para avançar.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Célula calculada com fórmula
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Célula-alvo da missão
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar: NPCs Lore, Pedagogical Checklist, Justification & Actions */}
          <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto p-4 gap-4">
            
            {/* Safe-Fail Alert Banner if triggered */}
            {safeFailAlertOpen && (
              <div 
                role="alert" 
                className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 text-amber-900 dark:text-amber-200 animate-in fade-in"
              >
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wide text-amber-800 dark:text-amber-300">
                      Segunda Chance Ativada: revise as fórmulas com calma
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed">
                      {mission.dialogues.safeFailFeedback}
                    </p>
                    <p className="text-[11px] mt-1 text-amber-700 dark:text-amber-400">
                      Ainda restam cálculos pendentes no checklist. Você não perde ponto por tentar: veja a dica do Zequinha, ajuste as fórmulas na planilha e envie novamente.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSafeFailAlertOpen(false)}
                      className="mt-2 px-2.5 py-1 bg-amber-500 text-amber-950 font-bold rounded text-xs hover:bg-amber-400"
                    >
                      Vou revisar as fórmulas
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NPC Dialogue Cards */}
            <div className="space-y-3">
              {/* Juvenildo Canindé */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      JC
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Juvenildo Canindé
                      </h4>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                        Gerente-geral • Canindé Distribuidora
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(`Juvenildo Canindé informa: ${mission.dialogues.juvenildoIntro}`)}
                    className="p-1 rounded text-slate-600 hover:text-emerald-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    title="Ouvir orientações de Juvenildo"
                    aria-label="Ouvir orientação do gerente Juvenildo"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed italic">
                  "{mission.dialogues.juvenildoIntro}"
                </p>
              </div>

              {/* Zequinha Silva */}
              <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-xs shadow-sm">
                      ZS
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-amber-950 dark:text-amber-200">
                        Zequinha Silva
                      </h4>
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                        Estagiário de TI
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(`Zequinha Silva dá a dica: ${mission.dialogues.zequinhaIntro} ${mission.dialogues.zequinhaTip}`)}
                    className="p-1 rounded text-amber-800 hover:text-amber-950 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                    title="Ouvir dica do Zequinha"
                    aria-label="Ouvir dica do estagiário Zequinha"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed">
                  "{mission.dialogues.zequinhaIntro}"
                </p>
                <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded border border-amber-300 dark:border-amber-700 text-[11px] text-amber-950 dark:text-amber-100 font-medium flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{mission.dialogues.zequinhaTip}</span>
                </div>
              </div>
            </div>

            {/* Live Pedagogical Checklist */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Checklist pedagógico
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  {completedCount}/{checklistStatus.length} concluídos
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-2">
                {checklistStatus.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded-lg border text-xs transition-colors flex items-start gap-2 ${
                      item.completed
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-400 dark:border-slate-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-bold ${item.completed ? 'text-emerald-950 dark:text-emerald-100' : 'text-slate-900 dark:text-slate-100'}`}>
                          {item.instruction}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded font-bold shrink-0">
                          {item.bloomLevel === 'Aplicar' ? 'Fazer Conta' : 
                           item.bloomLevel === 'Analisar' ? 'Analisar' : 
                           item.bloomLevel === 'Avaliar' ? 'Tomar Decisão' : 
                           item.bloomLevel === 'Entender' ? 'Lógica' : 
                           item.bloomLevel === 'Criar' ? 'Propor' : item.bloomLevel}
                        </span>
                      </div>
                      {!item.completed && (
                        <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                          Dica: {item.hint}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Justificativa Pedagógica */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <label htmlFor="student-justification-input" className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                Sua recomendação prática (análise dos dados)
              </label>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed font-medium">
                Explique o que os números mostram e qual decisão você recomenda ao gerente:
              </p>
              <textarea
                id="student-justification-input"
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Exemplo: Usei =SOMA para totalizar os 3 meses de cada vendedor e =SE para conferir quem bateu a meta de R$ 15.000. Recomendo bonificar Tiago, Ivone e Socorro, e dar treinamento para quem ficou abaixo..."
                className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Action buttons */}
            <div className="mt-auto pt-2 space-y-2">
              <button
                id="btn-submit-artifact-evaluation"
                type="button"
                onClick={handleSubmitArtifact}
                disabled={isEvaluating}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all focus:ring-2 focus:ring-emerald-400"
              >
                {isEvaluating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Avaliando a planilha com IA...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Entregar planilha para avaliação</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-xs transition-colors"
              >
                Salvar rascunho e continuar depois
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
