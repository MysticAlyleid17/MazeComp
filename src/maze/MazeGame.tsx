import { useRef, useEffect, useMemo, useState } from 'react';
import * as renderFns from "./render"
import * as mazeFns from "./mazeGenerator"
import * as solverFn from "./solver"
import * as controlsFn from "./controls"
import { assert} from "./utils"
import { type Algorithm } from "./types"


export default function MazeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const dimensionsInputRef = useRef<HTMLInputElement | null>(null);
  const algorithmSelectRef = useRef<HTMLSelectElement | null>(null);
  const [controlsDisabled, setControlsDisabled] = useState(false);

  const canvas = useMemo(() => <canvas ref={canvasRef} id="maze" tabIndex={0} aria-label="Maze" />, []);

  useEffect(() => {
    if (canvasRef.current && !contextRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
    }

    onNewMaze();

    const ac = new AbortController();

    window.addEventListener('resize', () => onNewMaze(), { signal: ac.signal });
    window.addEventListener('keydown', (e) => canvasKeyDown(e), { signal: ac.signal });

    return () => ac.abort();
  }, [])

  function onNewMaze() {
    assert(contextRef.current, "Drawing Context should exist")
    assert(dimensionsInputRef.current, "Dimensions Input should exist")

    renderFns.resizeCanvas(contextRef.current);
    renderFns.cancelAnimation(setControlsDisabled);
    renderFns.SetRows(renderFns.SetCols(parseInt(dimensionsInputRef.current.value, 10)));
    renderFns.SetWalls(mazeFns.generateMaze(renderFns.ROWS, renderFns.COLS, renderFns.inBounds, renderFns.idx));
    const gridState = mazeFns.initGrid(renderFns.ROWS, renderFns.COLS);
    renderFns.SetVisited(gridState.visited);
    renderFns.SetFrontier(gridState.frontier);
    renderFns.SetParent(gridState.parent);
    renderFns.SetPath(gridState.path);
    renderFns.SetStart(gridState.start);
    renderFns.SetGoal(gridState.goal);
    renderFns.SetPlayer(gridState.player);
    renderFns.redraw(contextRef.current);
  }

  function onReset() {
    assert(contextRef.current, "Drawing Context should exist")

    renderFns.cancelAnimation(setControlsDisabled);
    renderFns.SetPlayer({ r: 0, c: 0 });
    renderFns.redraw(contextRef.current);
  }
  
  function onSolve() {
    assert(algorithmSelectRef.current, "Algorith Select should exist")
    assert(contextRef.current, "Drawing Context should exist")

    renderFns.cancelAnimation(setControlsDisabled);
    renderFns.redraw(contextRef.current);
    renderFns.SetRunning(true);
    setControlsDisabled(true);

    solverFn.solve({
      algorithm: algorithmSelectRef.current.value as Algorithm,
      walls: renderFns.walls,
      visited: renderFns.visited,
      frontier: renderFns.frontier,
      parent: renderFns.parent,
      start: renderFns.start,
      goal: renderFns.goal,
      COLS: renderFns.COLS,
      setControlsDisabled,
      ctx: contextRef.current
    });
  }

  function onMove(dr: number, dc: number) {
    assert(contextRef.current, "Drawing Context should exist")

    if (renderFns.RUNNING) return;
    controlsFn.tryMove({
      player: renderFns.player,
      walls: renderFns.walls,
      COLS: renderFns.COLS,
      dr,
      dc,
      ctx: contextRef.current,
      goal: renderFns.goal
    });
  }
  
  function canvasKeyDown(e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
      case 'w': onMove(-1, 0); e.preventDefault(); break;
      case 's': onMove(1, 0); e.preventDefault(); break;
      case 'a': onMove(0, -1); e.preventDefault(); break;
      case 'd': onMove(0, 1); e.preventDefault(); break;
    }
  }

  return (
    <>
      <header>
        <h1>Random Maze + BFS/DFS Visualizer</h1>
        <p>Use W A S D to move. Generate a maze, then watch BFS or DFS explore and solve it</p>
      </header>
      <section className="panel">
        <div className="field">
          <label htmlFor="dimensions">Dimensions</label>
          <input id="dimensions" type="number" min="5" defaultValue={25} ref={dimensionsInputRef} disabled={controlsDisabled} />
        </div>
        <div className="field">
          <label htmlFor="algo">Search</label>
          <select ref={algorithmSelectRef} id="algo" disabled={controlsDisabled}>
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
          </select>
        </div>
        <div className="buttons">
          <button type='button' disabled={controlsDisabled} onClick={onNewMaze}>New Maze</button>
          <button type="button" disabled={controlsDisabled} onClick={onSolve}>Solve</button>
          <button type="button" disabled={controlsDisabled} onClick={onReset} className="warning">Reset</button>
        </div>
      </section>
      {canvas}
      <div className="legend">
        <span><span className="swatch sw-start"></span> Start</span>
        <span><span className="swatch sw-goal"></span> Goal</span>
        <span><span className="swatch sw-player"></span> Player</span>
        <span><span className="swatch sw-visited"></span> Visited</span>
        <span><span className="swatch sw-frontier"></span> Frontier</span>
        <span><span className="swatch sw-path"></span> Path</span>
      </div>
    </>
  );
}
