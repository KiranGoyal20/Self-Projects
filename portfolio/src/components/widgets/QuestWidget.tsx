const chapters = [
  { n: "01", title: "Foundations", icon: "🧭" },
  { n: "02", title: "Routing & Pages", icon: "🗺️" },
  { n: "03", title: "Server vs Client", icon: "⚛️" },
  { n: "04", title: "Data & Layouts", icon: "📡" },
];

export function QuestWidget() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-[#070b18] p-4 text-[#e8ecff] shadow-widget">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(at 12% 0%, rgba(167,139,250,0.28) 0px, transparent 50%), radial-gradient(at 90% 20%, rgba(45,191,255,0.18) 0px, transparent 46%)",
        }}
      />
      <div className="relative">
        <p className="mb-2 inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-200">
          🚀 An interactive quest through Next.js
        </p>
        <h3 className="font-display text-xl font-semibold leading-tight text-white">
          Stop reading docs. <span className="text-cyan-300">Play</span> your way in.
        </h3>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
            <p className="text-[10px] text-[#9aa3c7]">Greeting</p>
            <p className="text-sm font-semibold">👋 Quester</p>
            <p className="text-[10px] text-cyan-300">Level 1</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
            <p className="text-[10px] text-[#9aa3c7]">Progress</p>
            <p className="text-sm font-semibold">0 / 15</p>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[8%] rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
            <p className="text-[10px] text-[#9aa3c7]">Streak</p>
            <p className="text-sm font-semibold">Start yours</p>
            <p className="text-[10px] text-[#9aa3c7]">0 badges</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {chapters.map((ch) => (
            <div
              key={ch.n}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2"
            >
              <span className="text-sm">{ch.icon}</span>
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-wider text-[#9aa3c7]">Ch · {ch.n}</p>
                <p className="truncate text-xs font-medium text-white">{ch.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
