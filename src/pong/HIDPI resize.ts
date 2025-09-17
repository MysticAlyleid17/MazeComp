function resizeCanvasForHiDPI(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = Math.round(rect.width * dpr);
  const h = Math.round(rect.height * dpr);

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (canvas) {
  const onResize = () => resizeCanvasForHiDPI(canvas);
  onResize();
  window.addEventListener("resize", onResize);
}