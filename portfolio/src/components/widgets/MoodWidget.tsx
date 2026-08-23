const moods = [
  { emoji: "😊", label: "Joyful", from: "#fbbf24", to: "#fb7185" },
  { emoji: "🌿", label: "Calm", from: "#34d399", to: "#22d3ee" },
  { emoji: "⚡", label: "Energetic", from: "#f97316", to: "#fb7185" },
  { emoji: "💗", label: "Romantic", from: "#fb7185", to: "#e879f9" },
];

export function MoodWidget() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-[#0a0b1a] p-4 text-[#e9ebf2] shadow-widget">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(at 18% 12%, rgba(168,85,247,0.38) 0px, transparent 50%), radial-gradient(at 88% 8%, rgba(236,72,153,0.28) 0px, transparent 48%), radial-gradient(at 40% 100%, rgba(59,130,246,0.22) 0px, transparent 50%)",
        }}
      />
      <div className="relative flex h-full flex-col">
        <p className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px]">
          ✨ A soundtrack for how you feel
        </p>
        <h3 className="font-display text-2xl font-semibold leading-tight text-white">
          Tell us your <span className="text-fuchsia-300">mood</span>.
        </h3>
        <p className="mt-1 text-xs text-[#c9cee0]">We’ll bring the music & movies.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {moods.map((mood) => (
            <span
              key={mood.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: `linear-gradient(135deg, ${mood.from}, ${mood.to})` }}
              />
              {mood.emoji} {mood.label}
            </span>
          ))}
        </div>

        <div className="mt-auto grid gap-2 pt-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-wider text-[#a3aac4]">Now playing</p>
            <p className="mt-1 text-sm font-semibold text-white">Golden Hour</p>
            <p className="text-xs text-[#c9cee0]">JVKE · album rec</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-wider text-[#a3aac4]">Watch next</p>
            <p className="mt-1 text-sm font-semibold text-white">Paddington 2</p>
            <p className="text-xs text-[#c9cee0]">Feel-good · 2017</p>
          </div>
        </div>
      </div>
    </div>
  );
}
