import type { Algorithm } from './types';
import { neighbors } from './mazeGenerator';
import { inBounds, idx, redraw, animatePath, cancelAnimation } from "./render"

export function solve({
  algorithm,
  walls,
  visited,
  frontier,
  parent,
  start,
  goal,
  COLS,
  setControlsDisabled,
  ctx
}: {
  algorithm: Algorithm;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walls: any[];
  visited: boolean[];
  frontier: boolean[];
  parent: number[];
  start: { r: number; c: number };
  goal: { r: number; c: number };
  COLS: number;
  setControlsDisabled: (b: boolean) => void;
  ctx: CanvasRenderingContext2D
}): void {
  visited.fill(false);
  frontier.fill(false);
  parent.fill(-1);
  
  const startU = idx(start.r, start.c);
  const goalU = idx(goal.r, goal.c);

  const queue = [startU];
  visited[startU] = true;
  frontier[startU] = false;

  let found = false;
  const delay = 1000 / 60;

  const stepTimer = setInterval(() => {
    if (!queue.length) {
      // no more to explore → no solution
      cancelAnimation(setControlsDisabled);
      redraw(ctx);
      alert('No solution possible');
      return;
    }

    const u = algorithm === 'bfs' ? queue.shift()! : queue.pop()!;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const v of neighbors(u, walls, COLS, inBounds, idx)) {
      if (!visited[v]) {
        visited[v] = true;
        parent[v] = u;
        queue.push(v);
        frontier[v] = true;
      }
    }
    frontier[u] = false;

    if (u === goalU && !found) {
      found = true;
      // backtrack path
      let cur = u;
      const seq = [];
      while (cur !== -1) {
        seq.push(cur);
        cur = parent[cur]!;
      }
      seq.reverse();

      clearInterval(stepTimer);
      // animate final path then dots
      animatePath(ctx, setControlsDisabled, seq);
      return;
    }
    redraw(ctx);
  }, delay);
}
