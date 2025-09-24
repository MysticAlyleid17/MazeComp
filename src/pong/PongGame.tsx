import { useEffect, useRef } from 'react';
import './styles/app.css';

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Resize for HiDPI
    const resizeCanvasForHiDPI = () => {
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
    resizeCanvasForHiDPI();
    window.addEventListener('resize', resizeCanvasForHiDPI);
    return () => window.removeEventListener('resize', resizeCanvasForHiDPI);
  }, []);

  // TODO: Port Pong game logic from main.ts here

  return (
    <div>
      <header className="header">
        <div className="header-row">
          <img src="/ponglogo.ico" alt="Arcadia Pong logo" className="logo" />
          <h1>Arcadia Pong</h1>
        </div>
        <p className="controls">
          Controls: Move your mouse over the canvas or use the ↑↓ arrow keys to move
          the left paddle. Use space to serve.
        </p>
        <p className="alt-controls">Left: mouse / ↑↓ keys - Right: Predicative ML</p>
      </header>
      <main className="container">
        <div className="canvas-wrap">
          <canvas ref={canvasRef} id="game"></canvas>
        </div>
      </main>
    </div>
  );
}
