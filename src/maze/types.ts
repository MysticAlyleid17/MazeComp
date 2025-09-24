// Definizioni di tipi e interfacce
export interface Wall {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface Point {
  r: number;
  c: number;
}

export interface Edge {
  from: number;
  to: number;
  dir: string;
}

export type Algorithm = 'bfs' | 'dfs';

// Costanti esportate
export const PADDING = 5;
export const dimensionsInput = document.getElementById('dimensions') as HTMLInputElement;
export const algoSelect = document.getElementById('algo') as HTMLSelectElement;
export const speedRange = document.getElementById('speed') as HTMLInputElement;
export const btnNew = document.getElementById('New') as HTMLButtonElement;
export const btnSolve = document.getElementById('Solve') as HTMLButtonElement;
export const btnReset = document.getElementById('Reset') as HTMLButtonElement;
export const canvas = document.getElementById('maze') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d')!;