import type { Wall, Point, Edge } from './types';

// Funzioni di generazione del labirinto
export function initGrid(ROWS: number, COLS: number): {
  walls: Wall[];
  visited: boolean[];
  frontier: boolean[];
  parent: number[];
  path: number[];
  start: Point;
  goal: Point;
  player: Point;
} {
  const walls = Array(ROWS * COLS).fill(0).map(_ => ({ top: true, right: true, bottom: true, left: true }));
  const visited = Array(ROWS * COLS).fill(false);
  const frontier = Array(ROWS * COLS).fill(false);
  const parent = Array(ROWS * COLS).fill(-1);
  const path: number[] = [];
  const start = { r: 0, c: 0 };
  const goal = { r: ROWS - 1, c: COLS - 1 };
  const player = { r: 0, c: 0 };
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { walls, visited, frontier, parent, path, start, goal, player };
}

// Prim's algorithm
export function generateMaze(ROWS: number, COLS: number, inBounds: (r: number, c: number) => boolean, idx: (r: number, c: number) => number): Wall[] {
  const { walls } = initGrid(ROWS, COLS);
  const inTree = Array(ROWS * COLS).fill(false);
  const edges: Edge[] = [];
  
  const addEdges = (r: number, c: number) => {
    const u = idx(r, c);
    for (const [dir, dr, dc] of [['top', -1, 0], ['right', 0, 1], ['bottom', 1, 0], ['left', 0, -1]] as [string, number, number][]) {
      const nr = r + dr, nc = c + dc;
      if (!inBounds(nr, nc)) continue;
      const v = idx(nr, nc);
      if (!inTree[v]) edges.push({ from: u, to: v, dir });
    }
  };

  const s = idx(
    Math.floor(Math.random() * ROWS),
    Math.floor(Math.random() * COLS)
  );
  inTree[s] = true;
  addEdges(Math.floor(s / COLS), s % COLS);

  while (edges.length) {
    const k = Math.floor(Math.random() * edges.length);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const { from, to } = edges.splice(k, 1)[0]!;
    if (inTree[from] && inTree[to]) continue;
    const a = inTree[from] ? from : to, b = inTree[from] ? to : from;
    const ar = Math.floor(a / COLS), ac = a % COLS;
    const br = Math.floor(b / COLS), bc = b % COLS;

    const wallA = walls[a]
    const wallB = walls[b]

    if (!wallA) throw new Error("Wall a not found")
    if (!wallB) throw new Error("Wall b not found")

    if (br === ar - 1) { wallA.top = false; wallB.bottom = false; }
    if (br === ar + 1) { wallA.bottom = false; wallB.top = false; }
    if (bc === ac + 1) { wallA.right = false; wallB.left = false; }
    if (bc === ac - 1) { wallA.left = false; wallB.right = false; }

    inTree[b] = true;
    addEdges(br, bc);
  }
  
  return walls;
}

export function neighbors(u: number, walls: Wall[], COLS: number, inBounds: (r: number, c: number) => boolean, idx: (r: number, c: number) => number): number[] {
  const r = Math.floor(u / COLS), c = u % COLS, w = walls[u];
  const out: number[] = [];
  if (!w) throw new Error("W notsat")
  if (!w.top && inBounds(r - 1, c)) out.push(idx(r - 1, c));
  if (!w.right && inBounds(r, c + 1)) out.push(idx(r, c + 1));
  if (!w.bottom && inBounds(r + 1, c)) out.push(idx(r + 1, c));
  if (!w.left && inBounds(r, c - 1)) out.push(idx(r, c - 1));
  return out;
}