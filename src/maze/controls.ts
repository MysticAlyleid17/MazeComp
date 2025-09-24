import type { Point } from './types';
import { inBounds, idx, redraw } from "./render"

// Funzioni di controllo e gestione eventi
export function disableControls(elements: HTMLElement[], flag: boolean): void {
  elements.forEach(el => (el as HTMLInputElement | HTMLButtonElement).disabled = flag);
}

export function tryMove({
  player,
  walls,
  dr,
  dc,
  goal,
  ctx
}: {
  player: Point;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walls: any[];
  COLS: number;
  dr: number;
  dc: number;
  goal: Point;
  ctx: CanvasRenderingContext2D
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
  
  redraw(ctx);
  
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
