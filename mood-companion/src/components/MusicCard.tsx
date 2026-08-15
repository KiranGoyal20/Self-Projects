import { motion } from "framer-motion";
import { formatDuration } from "../utils/dates";
import type { Track } from "../types/domain";

interface Props {
  track: Track;
  saved?: boolean;
  onToggleSave?: () => void;
}

export const MusicCard = ({ track, saved, onToggleSave }: Props) => (
  <motion.article
    layout
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    className="card p-4 flex gap-4 items-center group"
  >
    <div
      className="h-16 w-16 rounded-xl shrink-0 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${track.cover}, rgba(255,255,255,0.08))`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-white/85 text-2xl">
        ♪
      </div>
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline gap-2">
        <h4 className="font-semibold text-ink-50 truncate">{track.title}</h4>
        <span className="text-xs text-ink-400 shrink-0">
          {formatDuration(track.durationSec)}
        </span>
      </div>
      <p className="text-sm text-ink-300 truncate">
        {track.artist} · {track.album}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {track.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="chip text-[10px] py-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
    {onToggleSave && (
      <button
        type="button"
        onClick={onToggleSave}
        aria-label={saved ? "Remove from saved" : "Save"}
        className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all
          ${
            saved
              ? "bg-fuchsia-500/25 text-fuchsia-200 border border-fuchsia-400/40"
              : "bg-white/5 hover:bg-white/10 text-ink-300 border border-white/10"
          }`}
      >
        {saved ? "♥" : "♡"}
      </button>
    )}
  </motion.article>
);
