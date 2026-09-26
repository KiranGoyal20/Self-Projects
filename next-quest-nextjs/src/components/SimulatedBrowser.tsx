import type { ReactNode } from "react";

type Props = {
  url?: string;
  children: ReactNode;
};

export const SimulatedBrowser = ({
  url = "localhost:3000",
  children,
}: Props) => (
  <div className="rounded-2xl border border-white/10 overflow-hidden shadow-card bg-ink-900/60">
    <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5 bg-white/[0.03]">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
      </div>
      <div className="flex-1 px-3 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-ink-300 truncate">
        {url}
      </div>
    </div>
    <div className="min-h-[180px] bg-gradient-to-br from-ink-950/80 to-ink-800/40">
      {children}
    </div>
  </div>
);
