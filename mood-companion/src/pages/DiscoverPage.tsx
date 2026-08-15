import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectMoodSession, selectPreferences } from "../app/selectors";
import { logMood, toggleMovieSaved, toggleTrackSaved } from "../features/history/historySlice";
import { clearMood } from "../features/mood/moodSlice";
import {
  setPreferredTab,
  type DiscoverTab,
} from "../features/preferences/preferencesSlice";
import { MOODS } from "../data/moods";
import { recommendMovies, recommendTracks } from "../utils/recommend";
import { MoodBadge } from "../components/MoodBadge";
import { MusicCard } from "../components/MusicCard";
import { MovieCard } from "../components/MovieCard";
import { EmptyState } from "../components/EmptyState";

const tabs: { id: DiscoverTab; label: string; icon: string }[] = [
  { id: "both", label: "Both", icon: "🪄" },
  { id: "music", label: "Music", icon: "🎧" },
  { id: "movies", label: "Movies", icon: "🎬" },
];

export const DiscoverPage = () => {
  const session = useAppSelector(selectMoodSession);
  const { preferredTab } = useAppSelector(selectPreferences);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [entryId, setEntryId] = useState<string | null>(null);

  const mood = session.currentMood ? MOODS[session.currentMood] : null;

  const tracks = useMemo(
    () => (mood ? recommendTracks(mood.id) : []),
    [mood]
  );
  const movies = useMemo(
    () => (mood ? recommendMovies(mood.id) : []),
    [mood]
  );

  /** Auto-log this mood once into history so saves can attach to an entry */
  useEffect(() => {
    if (!session.currentMood || entryId) return;
    const action = logMood({
      moodId: session.currentMood,
      source: session.source ?? "manual",
      note: session.note || undefined,
      confidence: session.confidence,
    });
    dispatch(action);
    setEntryId(action.payload.id);
  }, [session, entryId, dispatch]);

  const entry = useAppSelector((s) =>
    entryId ? s.history.entries.find((e) => e.id === entryId) : undefined
  );

  if (!mood) {
    return (
      <EmptyState
        icon="🎈"
        title="No mood selected yet"
        description="Choose a mood path to get recommendations."
        action={
          <Link to="/detect" className="btn-primary">
            Find my mood
          </Link>
        }
      />
    );
  }

  const showMusic = preferredTab === "music" || preferredTab === "both";
  const showMovies = preferredTab === "movies" || preferredTab === "both";

  return (
    <div className="space-y-10">
      <section
        className={`relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br ${mood.gradient}`}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <MoodBadge mood={mood} size="lg" />
            <div>
              <p className="text-xs uppercase tracking-widest text-white/75">
                You're feeling
              </p>
              <h1 className="heading text-3xl md:text-4xl text-white drop-shadow">
                {mood.label}
              </h1>
              <p className="text-white/85 mt-1 max-w-md">{mood.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="chip bg-white/15 border-white/20 text-white">
              via {session.source ?? "manual"} ·{" "}
              {Math.round((session.confidence ?? 1) * 100)}% confidence
            </div>
            <button
              type="button"
              onClick={() => {
                dispatch(clearMood());
                navigate("/detect");
              }}
              className="text-sm text-white/80 hover:text-white underline underline-offset-4"
            >
              Change mood
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="heading text-2xl text-ink-50">For you</h2>
            <p className="text-sm text-ink-300">
              Curated to match your current mood
            </p>
          </div>
          <div className="inline-flex p-1 rounded-2xl glass">
            {tabs.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => dispatch(setPreferredTab(t.id))}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                  preferredTab === t.id
                    ? "bg-white/10 text-ink-50 shadow-card"
                    : "text-ink-300 hover:text-ink-100"
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {showMusic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10"
          >
            <h3 className="text-sm uppercase tracking-widest text-ink-400 mb-3">
              Playlist
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {tracks.map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  saved={entry?.savedTrackIds.includes(track.id)}
                  onToggleSave={() =>
                    entry &&
                    dispatch(
                      toggleTrackSaved({
                        entryId: entry.id,
                        trackId: track.id,
                      })
                    )
                  }
                />
              ))}
            </div>
          </motion.div>
        )}

        {showMovies && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-sm uppercase tracking-widest text-ink-400 mb-3">
              Watchlist
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  saved={entry?.savedMovieIds.includes(movie.id)}
                  onToggleSave={() =>
                    entry &&
                    dispatch(
                      toggleMovieSaved({
                        entryId: entry.id,
                        movieId: movie.id,
                      })
                    )
                  }
                />
              ))}
            </div>
          </motion.div>
        )}
      </section>

      <section className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-400">
            All set
          </p>
          <h3 className="heading text-lg text-ink-50">
            Your saves are tied to today's mood
          </h3>
          <p className="text-sm text-ink-300">
            Revisit them anytime in History.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/history" className="btn-ghost">
            Go to history
          </Link>
          <button
            type="button"
            onClick={() => {
              dispatch(clearMood());
              navigate("/detect");
            }}
            className="btn-primary"
          >
            Try another mood
          </button>
        </div>
      </section>
    </div>
  );
};
