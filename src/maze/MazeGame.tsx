import { useEffect, useRef } from 'react';
import { algoSelect, btnNew, btnReset, btnSolve, dimensionsInput, speedRange } from '../maze/types';

export default function MazeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Import dinamico per evitare errori SSR e accedere alle funzioni imperative
    let renderFns: any = {};
    let mazeFns: any = {};
    let solverFn: any = {};
    let controlsFn: any = {};
    let utilsFn: any = {};
    let types: any = {};
    let stepTimer: any = undefined;

    const setup = async () => {
      renderFns = await import('../maze/render');
      mazeFns = await import('../maze/mazeGenerator');
      solverFn = await import('../maze/solver');
      controlsFn = await import('../maze/controls');
      utilsFn = await import('../maze/utils');
      types = await import('../maze/types');

      const canvas = canvasRef.current;
      if (!canvas) return;
      // Resize canvas
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const w = Math.round(rect.width * dpr);
        const h = Math.round(rect.height * dpr);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Funzioni di callback
      function onNewMaze() {
        renderFns.cancelAnimation();
        renderFns.SetRows(renderFns.SetCols(utilsFn.clamp(parseInt(dimensionsInput.value, 10) || 25, 5, 40)));
        renderFns.SetWalls(mazeFns.generateMaze(renderFns.ROWS, renderFns.COLS, renderFns.inBounds, renderFns.idx));
        const gridState = mazeFns.initGrid(renderFns.ROWS, renderFns.COLS);
        renderFns.SetVisited(gridState.visited);
        renderFns.SetFrontier(gridState.frontier);
        renderFns.SetParent(gridState.parent);
        renderFns.SetPath(gridState.path);
        renderFns.SetStart(gridState.start);
        renderFns.SetGoal(gridState.goal);
        renderFns.SetPlayer(gridState.player);
        renderFns.redraw();
        if (canvas) canvas.focus();
      }

      function onReset() {
        renderFns.cancelAnimation();
        renderFns.SetPlayer({ r: 0, c: 0 });
        renderFns.redraw();
        if (canvas) canvas.focus();
      }

      function onSpeedChange() {
        if (renderFns.RUNNING) {
          renderFns.cancelAnimation();
          if (renderFns.path.length) renderFns.animatePath(renderFns.path.slice());
          else onSolve();
        }
      }

      function onMove(dr: number, dc: number) {
        if (renderFns.RUNNING) return;
        controlsFn.tryMove({
          player: renderFns.player,
          walls: renderFns.walls,
          COLS: renderFns.COLS,
          dr,
          dc,
          inBounds: renderFns.inBounds,
          idx: renderFns.idx,
          redraw: renderFns.redraw,
          goal: renderFns.goal
        });
      }

      function onSolve() {
        renderFns.cancelAnimation();
        renderFns.redraw();
        renderFns.SetRunning(true);
        controlsFn.disableControls([btnNew, btnSolve, btnReset, dimensionsInput, algoSelect], true);
        solverFn.solve({
          algorithm: algoSelect.value,
          walls: renderFns.walls,
          visited: renderFns.visited,
          frontier: renderFns.frontier,
          parent: renderFns.parent,
          start: renderFns.start,
          goal: renderFns.goal,
          COLS: renderFns.COLS,
          inBounds: renderFns.inBounds,
          idx: renderFns.idx,
          redraw: renderFns.redraw,
          animatePath: renderFns.animatePath,
          cancelAnimation: renderFns.cancelAnimation,
          speedValue: speedRange.value
        });
      }

      controlsFn.setupEventListeners({
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
      });

      // Avvio iniziale
      renderFns.resizeCanvas();
      onNewMaze();
      setTimeout(() => canvas.focus(), 100);
    };
    setup();
    return () => {
      window.removeEventListener('resize', () => {});
      if (stepTimer) clearInterval(stepTimer);
    };
  }, []);

  return (
    <div>
      <header>
        <h1>Random Maze + BFS/DFS Visualizer</h1>
        <p>Use W A S D to move. Generate a maze, then watch BFS or DFS explore and solve it</p>
      </header>
      <section className="panel">
        <div className="field">
          <label htmlFor="dimensions">Dimensions</label>
          <input id="dimensions" type="number" min="5" max="40" defaultValue={25} />
        </div>
        <div className="field">
          <label htmlFor="algo">Search</label>
          <select id="algo">
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="speed">Speed</label>
          <input id="speed" type="range" min="1" max="120" defaultValue={60} />
        </div>
        <div className="buttons">
          <button id="New">New Maze</button>
          <button id="Solve">Solve</button>
          <button id="Reset" className="warning">Reset</button>
        </div>
      </section>
      <div className="canvas-wrap">
        <canvas ref={canvasRef} id="maze" tabIndex={0} aria-label="Maze"></canvas>
      </div>
      <div className="legend">
        <span><span className="swatch sw-start"></span> Start</span>
        <span><span className="swatch sw-goal"></span> Goal</span>
        <span><span className="swatch sw-player"></span> Player</span>
        <span><span className="swatch sw-visited"></span> Visited</span>
        <span><span className="swatch sw-frontier"></span> Frontier</span>
        <span><span className="swatch sw-path"></span> Path</span>
      </div>
    </div>
  );
}
