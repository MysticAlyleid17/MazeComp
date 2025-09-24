import { type Wall, type Point, PADDING } from './types';

export const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < ROWS && c < COLS;
export const idx = (r: number, c: number) => r * COLS + c;

// Variabili di rendering
export let CELL = 0;
export let WALL_W = 0;
export let COLS = 0;
export let ROWS = 0;
export let walls: Wall[] = [];
export let visited: boolean[] = [];
export let frontier: boolean[] = [];
export let path: number[] = [];
export let start: Point = { r: 0, c: 0 };
export let goal: Point = { r: 0, c: 0 };
export let player: Point = { r: 0, c: 0 };
export let stepTimer: number | undefined = undefined;
export let parent: number[] = [];
export let RUNNING = false;

export function SetRows(rows: number){
  ROWS = rows;
  return ROWS;
}
export function SetCols(cols: number){
  COLS = cols;
  return COLS;
}

export function SetWalls(walls_in: Wall[]) {
  walls = walls_in;
  return walls;
}

export function SetVisited(visited_in: boolean[]) {
  visited = visited_in;
  return visited;
}

export function SetFrontier(frontier_in: boolean[]) {
  frontier = frontier_in;
  return frontier;
}

export function SetPath(path_in: number[]) {
  path = path_in;
  return path;
}

export function SetStart(start_in: Point) {
  start = start_in;
  return start;
}

export function SetGoal(goal_in: Point) {
  goal = goal_in;
  return goal;
}

export function SetPlayer(player_in: Point) {
  player = player_in;
  return player;
}

export function SetParent(parent_in: number[]) {
  parent = parent_in;
  return parent;
}

export function SetRunning(running_in: boolean) {
  RUNNING = running_in;
  return RUNNING;
}

// Funzioni di rendering
export function drawVisitedFrontier(ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < ROWS * COLS; i++) {
    if (visited[i]) {
      const r = Math.floor(i / COLS), c = i % COLS;
      fillCell(ctx, r, c, getComputedStyle(document.documentElement).getPropertyValue('--visited'));
    } else if (frontier[i]) {
      const r = Math.floor(i / COLS), c = i % COLS;
      fillCell(ctx, r, c, getComputedStyle(document.documentElement).getPropertyValue('--frontier'));
    }
  }
}

export function drawPathOverlay(ctx: CanvasRenderingContext2D): void {
  for (const u of path) {
    const r = Math.floor(u / COLS), c = u % COLS;
    fillCell(ctx, r, c, getComputedStyle(document.documentElement).getPropertyValue('--path'));
  }
}

export function drawStartGoalPlayer(ctx: CanvasRenderingContext2D ): void {
  // start & goal
  fillCell(ctx, start.r, start.c, getComputedStyle(document.documentElement).getPropertyValue('--start'));
  fillCell(ctx, goal.r, goal.c, getComputedStyle(document.documentElement).getPropertyValue('--goal'));

  // player
  const x = PADDING + player.c * CELL + CELL / 2;
  const y = PADDING + player.r * CELL + CELL / 2;
  const r = Math.max(3, Math.min(14, CELL * 0.3));

  ctx.save();
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--player');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

export function redraw(ctx: CanvasRenderingContext2D): void {
  resizeCanvas(ctx);
  computeCell(ctx.canvas, COLS, ROWS);
  clearBoard(ctx);
  drawGrid(ctx, COLS, ROWS);
  drawVisitedFrontier(ctx);
  drawPathOverlay(ctx);
  drawWalls(ctx, walls, COLS, ROWS);
  drawStartGoalPlayer(ctx);
}

export function cancelAnimation(setControlsDisabled: (b: boolean) => void): void {
  if (stepTimer) clearInterval(stepTimer);
  stepTimer = undefined;
  RUNNING = false;
  setControlsDisabled(false);
}

export function animatePath(ctx: CanvasRenderingContext2D, setControlsDisabled: (b: boolean) => void, seq: number[]): void {
  let i = 0;
  const delay = Math.max(20, 1000 / 60);
  stepTimer = window.setInterval(() => {
    if (i < seq.length) {
      path = seq.slice(0, i + 1);
      redraw(ctx);
      i++;
    } else {
      clearInterval(stepTimer);
      stepTimer = undefined;
      RUNNING = false;
      setControlsDisabled(false);
      redraw(ctx);
      drawSolutionDots(ctx, seq, COLS);
    }
  }, delay);
}

// Funzioni di rendering
export function resizeCanvas(ctx: CanvasRenderingContext2D): void {
  const rect = ctx.canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const dw = Math.floor(rect.width * dpr);
  const dh = Math.floor(rect.height * dpr);
  ctx.canvas.width = dw;
  ctx.canvas.height = dh;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function computeCell(canvas: HTMLCanvasElement, COLS: number, _ROWS: number): number {
  const side = canvas.clientWidth - 2 * PADDING;
  CELL = side / COLS;
  WALL_W = Math.max(1, CELL * 0.125);
  return CELL;
}

// Funzioni di disegno
export function clearBoard(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#0b0f20';
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

export function drawGrid(ctx: CanvasRenderingContext2D, COLS: number, ROWS: number): void {
  ctx.save();
  ctx.strokeStyle = '#1b2144';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let r = 0; r <= ROWS; r++) {
    const y = PADDING + r * CELL + .5;
    ctx.moveTo(PADDING, y);
    ctx.lineTo(PADDING + COLS * CELL, y);
  }
  for (let c = 0; c <= COLS; c++) {
    const x = PADDING + c * CELL + .5;
    ctx.moveTo(x, PADDING);
    ctx.lineTo(x, PADDING + ROWS * CELL);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawWalls(ctx: CanvasRenderingContext2D, walls: Wall[], COLS: number, ROWS: number): void {
  ctx.save();
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--wall');
  ctx.lineWidth = WALL_W;
  ctx.lineCap = 'square';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const u = idx(r, c);
      const x = PADDING + c * CELL;
      const y = PADDING + r * CELL;
      ctx.beginPath();
      const wall = walls[u];
      if (!wall) throw new Error("Wall not found")
      if (wall.top) { ctx.moveTo(x, y); ctx.lineTo(x + CELL, y); }
      if (wall.left) { ctx.moveTo(x, y); ctx.lineTo(x, y + CELL); }
      if (r === ROWS - 1 && wall.bottom) {
        ctx.moveTo(x, y + CELL); ctx.lineTo(x + CELL, y + CELL);
      }
      if (c === COLS - 1 && wall.right) {
        ctx.moveTo(x + CELL, y); ctx.lineTo(x + CELL, y + CELL);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function fillCell(ctx: CanvasRenderingContext2D, r: number, c: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(
    PADDING + c * CELL + WALL_W,
    PADDING + r * CELL + WALL_W,
    CELL - 2 * WALL_W,
    CELL - 2 * WALL_W
  );
}

export function drawSolutionDots(ctx: CanvasRenderingContext2D, seq: number[], COLS: number): void {
  ctx.save();
  ctx.fillStyle = '#000';
  for (const u of seq) {
    const r = Math.floor(u / COLS), c = u % COLS;
    const x = PADDING + c * CELL + CELL / 2;
    const y = PADDING + r * CELL + CELL / 2;
    const rad = Math.max(2, CELL * 0.1);
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

