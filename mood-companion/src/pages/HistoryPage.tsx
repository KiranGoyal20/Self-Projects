import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectEntries,
  selectEntriesLast30Days,
  selectMoodCounts,
  selectStreakDays,
  selectTopMood,
} from "../app/selectors";
import { MOODS } from "../data/moods";
import { MoodBadge } from "../components/MoodBadge";
import { MoodTrendChart } from "../components/MoodTrendChart";
import { EmptyState } from "../components/EmptyState";
import { formatDateTime } from "../utils/dates";
import { deleteEntry } from "../features/history/historySlice";
import type { MoodId } from "../types/domain";

export const HistoryPage = () => {
  const entries = useAppSelector(selectEntries);
  const last30 = useAppSelector(selectEntriesLast30Days);
  const counts = useAppSelector(selectMoodCounts);
  const topMoodId = useAppSelector(selectTopMood);
  const streak = useAppSelector(selectStreakDays);
  const dispatch = useAppDispatch();

  const [filter, setFilter] = useState<MoodId | "all">("all");

  const visible = useMemo(() => {
    if (filter === "all") return entries;
    return entries.filter((e) => e.moodId === filter);
  }, [entries, filter]);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon="🗓️"
        title="No mood entries yet"
        description="Log your first mood and we'll start building your story."
        action={
          <Link to="/detect" className="btn-primary">
            Find my mood
          </Link>
        }
      />
    );
  }

  const sortedMoodCounts = (Object.entries(counts) as [MoodId, number][])
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="heading text-3xl md:text-4xl text-ink-50">Your mood story</h1>
        <p className="text-ink-300 mt-2">
          A gentle record of how you've felt, what you saved, and the patterns
          underneath.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-widest text-ink-400">Entries</p>
          <p className="heading text-3xl text-ink-50 mt-1">{entries.length}</p>
          <p className="text-xs text-ink-400 mt-2">
            {last30.length} in the last 30 days
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs uppercase tracking-widest text-ink-400">Streak</p>
          <p className="heading text-3xl text-ink-50 mt-1">
            {streak} <span className="text-base text-ink-400">days</span>
          </p>
          <p className="text-xs text-ink-400 mt-2">
            {streak > 0 ? "You're checking in daily" : "Log today to start a streak"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs uppercase tracking-widest text-ink-400">
            Most common
          </p>
          {topMoodId ? (
            <div className="mt-2 flex items-center gap-3">
              <MoodBadge mood={MOODS[topMoodId]} size="sm" />
              <div>
                <p className="font-display font-semibold text-ink-50">
                  {MOODS[topMoodId].label}
                </p>
                <p className="text-xs text-ink-400">
                  {counts[topMoodId]} time{(counts[topMoodId] ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-300 mt-2">Log a few entries first.</p>
          )}
        </div>
      </section>

      <MoodTrendChart entries={entries} />

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="heading text-xl text-ink-50">Mood distribution</h2>
          <span className="text-xs text-ink-400">{entries.length} total</span>
        </div>
        <div className="card p-5 space-y-3">
          {sortedMoodCounts.map(([moodId, count]) => {
            const m = MOODS[moodId];
            const pct = Math.round((count / entries.length) * 100);
            return (
              <div key={moodId} className="flex items-center gap-3">
                <span className="text-xl w-6">{m.emoji}</span>
                <span className="w-28 text-sm text-ink-100">{m.label}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${m.gradient}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-ink-300">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
          <h2 className="heading text-xl text-ink-50">Timeline</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`chip ${
                filter === "all" ? "bg-white/10 text-ink-50" : ""
              }`}
            >
              All
            </button>
            {Object.values(MOODS)
              .filter((m) => counts[m.id])
              .map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFilter(m.id)}
                  className={`chip ${
                    filter === m.id ? "bg-white/10 text-ink-50" : ""
                  }`}
                >
                  <span>{m.emoji}</span>
                  {m.label}
                </button>
              ))}
          </div>
        </div>
        <div className="space-y-3">
          {visible.map((e, i) => {
            const m = MOODS[e.moodId];
            return (
              <motion.article
                key={e.id}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.02 * i }}
                className="card p-4 flex gap-4 items-start"
              >
                <MoodBadge mood={m} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold text-ink-50">
                      {m.label}
                    </span>
                    <span className="chip text-[10px]">{e.source}</span>
                    {typeof e.confidence === "number" && (
                      <span className="chip text-[10px]">
                        {Math.round(e.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {formatDateTime(e.createdAt)}
                  </p>
                  {e.note && (
                    <p className="text-sm text-ink-200 mt-2 leading-relaxed">
                      "{e.note}"
                    </p>
                  )}
                  {(e.savedMovieIds.length > 0 || e.savedTrackIds.length > 0) && (
                    <p className="text-xs text-ink-400 mt-2">
                      Saved {e.savedTrackIds.length} track
                      {e.savedTrackIds.length === 1 ? "" : "s"} ·{" "}
                      {e.savedMovieIds.length} movie
                      {e.savedMovieIds.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(deleteEntry(e.id))}
                  className="text-ink-400 hover:text-rose-300 text-sm"
                  aria-label="Delete entry"
                >
                  ✕
                </button>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
