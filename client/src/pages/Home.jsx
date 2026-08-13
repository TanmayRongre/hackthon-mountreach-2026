function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_60%_30%,rgba(99,102,241,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_20%_80%,rgba(14,165,233,0.08)_0%,transparent_50%)]">
      <div className="text-center max-w-2xl animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent mb-6">
          MountReach 2026 🏔️
        </h1>
        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
          Hackathon project is ready. Waiting for the problem statement...
        </p>
        <div className="inline-block px-5 py-2 bg-background-card border border-slate-800 rounded-full text-sm text-slate-400 tracking-wide">
          🚀 MERN Stack · React + Vite · Express · MongoDB
        </div>
      </div>
    </div>
  )
}

export default Home
