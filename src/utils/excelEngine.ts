import { CellData, SpreadsheetGrid } from '../types';

export function colIndexToLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export function colLetterToIndex(colStr: string): number {
  let index = 0;
  for (let i = 0; i < colStr.length; i++) {
    index = index * 26 + (colStr.charCodeAt(i) - 64);
  }
  return index - 1;
}

export function parseCellAddress(addr: string): { col: string; row: number } | null {
  const match = addr.trim().toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  return { col: match[1], row: parseInt(match[2], 10) };
}

export function getRangeCells(rangeStr: string): string[] {
  const parts = rangeStr.trim().toUpperCase().split(':');
  if (parts.length === 1) return [parts[0]];
  if (parts.length !== 2) return [];

  const start = parseCellAddress(parts[0]);
  const end = parseCellAddress(parts[1]);
  if (!start || !end) return [];

  const startCol = colLetterToIndex(start.col);
  const endCol = colLetterToIndex(end.col);
  const startRow = Math.min(start.row, end.row);
  const endRow = Math.max(start.row, end.row);

  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);

  const cells: string[] = [];
  for (let r = startRow; r <= endRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      cells.push(`${colIndexToLetter(c)}${r}`);
    }
  }
  return cells;
}

export function getNumericCellValue(grid: SpreadsheetGrid, cellAddr: string): number {
  const cell = grid[cellAddr.toUpperCase()];
  if (!cell) return 0;
  const val = cell.computedValue;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    // Remove R$, spaces, thousand dots, replace comma with dot
    const clean = val.replace(/[R$\s.]/g, '').replace(',', '.');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export function formatValue(value: string | number, format?: 'currency' | 'number' | 'text' | 'percent' | 'header'): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string' && (value.startsWith('#') || isNaN(Number(value.replace(/[R$\s.]/g, '').replace(',', '.'))))) {
    return value;
  }

  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[R$\s.]/g, '').replace(',', '.'));
  if (isNaN(num)) return String(value);

  if (format === 'currency') {
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  if (format === 'percent') {
    return `${(num * 100).toFixed(1).replace('.', ',')}%`;
  }
  if (format === 'number') {
    return num.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  }
  return String(value);
}

export function evaluateFormula(formula: string, grid: SpreadsheetGrid): { result: string | number; error?: string } {
  const clean = formula.trim();
  if (!clean.startsWith('=')) {
    return { result: clean };
  }

  const expr = clean.substring(1).trim();
  const upperExpr = expr.toUpperCase();

  try {
    // 1. SOMA / SUM
    const sumMatch = expr.match(/^(?:SOMA|SUM)\s*\((.+)\)$/i);
    if (sumMatch) {
      const argsStr = sumMatch[1];
      const ranges = argsStr.split(/[;,]/).map((s) => s.trim());
      let total = 0;
      for (const r of ranges) {
        const cells = getRangeCells(r);
        for (const c of cells) {
          total += getNumericCellValue(grid, c);
        }
      }
      return { result: total };
    }

    // 2. MÉDIA / MEDIA / AVERAGE
    const avgMatch = expr.match(/^(?:MÉDIA|MEDIA|AVERAGE)\s*\((.+)\)$/i);
    if (avgMatch) {
      const argsStr = avgMatch[1];
      const ranges = argsStr.split(/[;,]/).map((s) => s.trim());
      let total = 0;
      let count = 0;
      for (const r of ranges) {
        const cells = getRangeCells(r);
        for (const c of cells) {
          total += getNumericCellValue(grid, c);
          count++;
        }
      }
      return { result: count > 0 ? total / count : 0 };
    }

    // 3. MÁXIMO / MAXIMO / MAX
    const maxMatch = expr.match(/^(?:MÁXIMO|MAXIMO|MAX)\s*\((.+)\)$/i);
    if (maxMatch) {
      const argsStr = maxMatch[1];
      const ranges = argsStr.split(/[;,]/).map((s) => s.trim());
      let maxVal = -Infinity;
      let count = 0;
      for (const r of ranges) {
        const cells = getRangeCells(r);
        for (const c of cells) {
          const val = getNumericCellValue(grid, c);
          if (val > maxVal) maxVal = val;
          count++;
        }
      }
      return { result: count > 0 && maxVal !== -Infinity ? maxVal : 0 };
    }

    // 4. MÍNIMO / MINIMO / MIN
    const minMatch = expr.match(/^(?:MÍNIMO|MINIMO|MIN)\s*\((.+)\)$/i);
    if (minMatch) {
      const argsStr = minMatch[1];
      const ranges = argsStr.split(/[;,]/).map((s) => s.trim());
      let minVal = Infinity;
      let count = 0;
      for (const r of ranges) {
        const cells = getRangeCells(r);
        for (const c of cells) {
          const val = getNumericCellValue(grid, c);
          if (val < minVal) minVal = val;
          count++;
        }
      }
      return { result: count > 0 && minVal !== Infinity ? minVal : 0 };
    }

    // 5. SE / IF condition
    const ifMatch = expr.match(/^(?:SE|IF)\s*\((.+)\)$/i);
    if (ifMatch) {
      const inner = ifMatch[1];
      // Split by semicolon (preferred in pt-BR Excel) or comma if no semicolon
      const delimiter = inner.includes(';') ? ';' : ',';
      const parts = splitFormulaArgs(inner, delimiter);
      if (parts.length >= 2) {
        const condition = parts[0].trim();
        const trueVal = unquote(parts[1].trim());
        const falseVal = parts.length >= 3 ? unquote(parts[2].trim()) : '';

        const condResult = evaluateCondition(condition, grid);
        return { result: condResult ? trueVal : falseVal };
      }
    }

    // 6. Simple cell arithmetic: =B4+C4 or =E4*0.1
    let evaluatedExpr = upperExpr.replace(/([A-Z]+[0-9]+)/g, (match) => {
      return String(getNumericCellValue(grid, match));
    });

    // Sanitize to only allow numbers, operators and parentheses
    if (/^[0-9+\-*/().\s]+$/.test(evaluatedExpr)) {
      // Safe math eval using Function with strict math
      const mathResult = Function(`'use strict'; return (${evaluatedExpr})`)();
      return { result: typeof mathResult === 'number' ? mathResult : String(mathResult) };
    }

    return { result: '#VALOR!' };
  } catch (err) {
    return { result: '#ERRO!', error: (err as Error).message };
  }
}

function splitFormulaArgs(str: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === '(' && !inQuotes) {
      parenDepth++;
      current += char;
    } else if (char === ')' && !inQuotes) {
      parenDepth--;
      current += char;
    } else if (char === delimiter && !inQuotes && parenDepth === 0) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function unquote(str: string): string {
  const s = str.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function evaluateCondition(condStr: string, grid: SpreadsheetGrid): boolean {
  // Operators: >=, <=, <>, !=, =, >, <
  const ops = ['>=', '<=', '<>', '!=', '=', '>', '<'];
  for (const op of ops) {
    if (condStr.includes(op)) {
      const [leftStr, rightStr] = condStr.split(op);
      const leftVal = evalOperand(leftStr.trim(), grid);
      const rightVal = evalOperand(rightStr.trim(), grid);

      if (op === '>=') return Number(leftVal) >= Number(rightVal);
      if (op === '<=') return Number(leftVal) <= Number(rightVal);
      if (op === '<>' || op === '!=') return leftVal !== rightVal;
      if (op === '=') return leftVal === rightVal || Number(leftVal) === Number(rightVal);
      if (op === '>') return Number(leftVal) > Number(rightVal);
      if (op === '<') return Number(leftVal) < Number(rightVal);
    }
  }
  return false;
}

function evalOperand(opStr: string, grid: SpreadsheetGrid): string | number {
  if (parseCellAddress(opStr)) {
    return getNumericCellValue(grid, opStr);
  }
  const clean = unquote(opStr);
  const num = parseFloat(clean.replace(/[R$\s.]/g, '').replace(',', '.'));
  return isNaN(num) ? clean : num;
}
