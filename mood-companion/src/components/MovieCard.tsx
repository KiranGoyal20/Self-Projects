import { motion } from "framer-motion";
import type { Movie } from "../types/domain";

interface Props {
  movie: Movie;
  saved?: boolean;
  onToggleSave?: () => void;
}

export const MovieCard = ({ movie, saved, onToggleSave }: Props) => (
  <motion.article
    layout
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 280, damping: 22 }}
    className="card overflow-hidden flex flex-col"
  >
    <div
      className="aspect-[3/4] relative"
      style={{
        background: `linear-gradient(160deg, ${movie.poster}, #0a0b1a 90%)`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-3xl mb-2 opacity-80">🎬</div>
        <h4 className="font-display font-bold text-lg text-white drop-shadow">
          {movie.title}
        </h4>
        <p className="text-xs text-white/70 mt-1">{movie.year}</p>
      </div>
      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/40 backdrop-blur text-xs text-amber-200">
        ★ {movie.rating.toFixed(1)}
      </div>
      {onToggleSave && (
        <button
          type="button"
          onClick={onToggleSave}
          aria-label={saved ? "Remove from saved" : "Save"}
          className={`absolute top-3 right-3 h-9 w-9 rounded-xl flex items-center justify-center transition-all
            ${
              saved
                ? "bg-fuchsia-500/30 text-fuchsia-100 border border-fuchsia-400/40"
                : "bg-black/40 hover:bg-black/60 text-white/80 border border-white/10"
            }`}
        >
          {saved ? "♥" : "♡"}
        </button>
      )}
    </div>
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {movie.genres.slice(0, 2).map((g) => (
          <span key={g} className="chip text-[10px] py-1">
            {g}
          </span>
        ))}
        <span className="chip text-[10px] py-1">{movie.runtimeMin}m</span>
      </div>
      <p className="text-sm text-ink-200 leading-relaxed">{movie.blurb}</p>
    </div>
  </motion.article>
);
