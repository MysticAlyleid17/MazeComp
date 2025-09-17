import type { Point } from './types';

// Funzioni di controllo e gestione eventi
export function disableControls(elements: HTMLElement[], flag: boolean): void {
  elements.forEach(el => (el as HTMLInputElement | HTMLButtonElement).disabled = flag);
}

export function tryMove({
  player,
  walls,
  dr,
  dc,
  inBounds,
  idx,
  redraw,
  goal
}: {
  player: Point;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walls: any[];
  COLS: number;
  dr: number;
  dc: number;
  inBounds: (r: number, c: number) => boolean;
  idx: (r: number, c: number) => number;
  redraw: () => void;
  goal: Point;
}): void {
  const r = player.r, c = player.c, u = idx(r, c);
  const nr = r + dr, nc = c + dc;
  if (!inBounds(nr, nc)) return;
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (nr === r - 1 && !walls[u].top) player.r--;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (nr === r + 1 && !walls[u].bottom) player.r++;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (nc === c - 1 && !walls[u].left) player.c--;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (nc === c + 1 && !walls[u].right) player.c++;
  
  redraw();
  
  if (player.r === goal.r && player.c === goal.c) {
    // simple flash
    let f = 0;
    const iv = setInterval(() => {
      document.querySelector('canvas')!.style.opacity = (f++ % 2) ? '0.4' : '1';
      if (f > 6) {
        clearInterval(iv);
        document.querySelector('canvas')!.style.opacity = '1';
      }
    }, 80);
  }
}

// Funzione per configurare gli event listener
export function setupEventListeners({
  btnNew,
  btnSolve,
  btnReset,
  speedRange,
  canvas,
  onNewMaze,
  onSolve,
  onReset,
  onSpeedChange,
  onMove
}: {
  btnNew: HTMLButtonElement;
  btnSolve: HTMLButtonElement;
  btnReset: HTMLButtonElement;
  speedRange: HTMLInputElement;
  canvas: HTMLCanvasElement;
  onNewMaze: () => void;
  onSolve: () => void;
  onReset: () => void;
  onSpeedChange: () => void;
  onMove: (dr: number, dc: number) => void;
}): void {
  btnNew.addEventListener('click', onNewMaze);
  btnSolve.addEventListener('click', onSolve);
  btnReset.addEventListener('click', onReset);
  speedRange.addEventListener('input', onSpeedChange);
  
  canvas.addEventListener('keydown', e => {
    switch (e.key.toLowerCase()) {
      case 'w': onMove(-1, 0); e.preventDefault(); break;
      case 's': onMove(1, 0); e.preventDefault(); break;
      case 'a': onMove(0, -1); e.preventDefault(); break;
      case 'd': onMove(0, 1); e.preventDefault(); break;
    }
  });
  
  window.addEventListener('resize', () => onNewMaze());
}