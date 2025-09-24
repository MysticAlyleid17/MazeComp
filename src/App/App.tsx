export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">Shadows Arcade</span> 
        </h1>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-8">
          <a
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/maze"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Maze →</h3>
            <div className="text-lg">
              Play Maze
            </div>
          </a>
          <a
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/pong"
            >
              <h3 className="text-2xl font-bold">Pong →</h3>
              <div className="text-lg">
                Play Pong
              </div>
            </a>
        </div>
      </div>
    </main>
  );
}