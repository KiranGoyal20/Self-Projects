import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "../app/hooks";
import {
  selectEntries,
  selectStreakDays,
  selectTopMood,
} from "../app/selectors";
import { MOODS } from "../data/moods";
import { MoodBadge } from "../components/MoodBadge";
import { formatDateTime } from "../utils/dates";

const detectionPaths = [
  {
    to: "/detect/quiz",
    title: "Take the mood quiz",
    body: "Five quick questions. We'll find a mood that fits.",
    icon: "🧠",
    accent: "from-violet-500/30 to-fuchsia-500/30",
  },
  {
    to: "/detect/journal",
    title: "Write what you feel",
    body: "Type a sentence or a paragraph — we'll read it for tone.",
    icon: "📓",
    accent: "from-cyan-500/30 to-blue-500/30",
  },
  {
    to: "/detect/pick",
    title: "Pick directly",
    body: "Already know how you feel? Tap a mood.",
    icon: "🎯",
    accent: "from-rose-500/30 to-amber-500/30",
  },
];

export const HomePage = () => {
  const entries = useAppSelector(selectEntries);
  const topMoodId = useAppSelector(selectTopMood);
  const streak = useAppSelector(selectStreakDays);
  const last = entries[0];

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 glass-strong">
        <div className="absolute inset-0 -z-10 bg-mesh-aurora opacity-70" />
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="chip mb-4">
            <span>✨</span> A soundtrack for how you feel
          </span>
          <h1 className="heading text-4xl md:text-5xl text-ink-50 leading-tight">
            Tell us your <span className="text-fuchsia-300">mood</span>.
            <br />
            We'll bring the music & movies.
          </h1>
          <p className="mt-4 text-ink-200 max-w-lg">
            Mood Companion blends a quick quiz, journaling, and a sentiment engine
            to recommend music and films that meet you where you are.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/detect/quiz" className="btn-primary">
              Start with the quiz <span aria-hidden>→</span>
            </Link>
            <Link to="/detect/pick" className="btn-ghost">
              Or pick a mood
            </Link>
          </div>
        </motion.div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="heading text-xl text-ink-50">Find your mood</h2>
          <Link
            to="/detect"
            className="text-sm text-fuchsia-200 hover:text-fuchsia-100"
          >
            See all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {detectionPaths.map((p, i) => (
            <motion.div
              key={p.to}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link
                to={p.to}
                className={`block card p-6 hover:bg-white/[0.07] transition-all h-full bg-gradient-to-br ${p.accent}`}
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-display font-semibold text-ink-50 text-lg">
                  {p.title}
                </h3>
                <p className="text-sm text-ink-200 mt-1">{p.body}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-6">
          <p className="text-xs uppercase tracking-wider text-ink-400">
            Entries logged
          </p>
          <p className="heading text-3xl text-ink-50 mt-1">{entries.length}</p>
          <p className="text-xs text-ink-400 mt-2">Across all moods</p>
        </div>
        <div className="card p-6">
          <p className="text-xs uppercase tracking-wider text-ink-400">
            Current streak
          </p>
          <p className="heading text-3xl text-ink-50 mt-1">
            {streak} <span className="text-base text-ink-400">days</span>
          </p>
          <p className="text-xs text-ink-400 mt-2">
            {streak > 0 ? "Keep it going" : "Log a mood today to start"}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-xs uppercase tracking-wider text-ink-400">
            Most common mood
          </p>
          {topMoodId ? (
            <div className="mt-2 flex items-center gap-3">
              <MoodBadge mood={MOODS[topMoodId]} size="sm" />
              <div>
                <p className="font-display font-semibold text-ink-50">
                  {MOODS[topMoodId].label}
                </p>
                <p className="text-xs text-ink-400">{MOODS[topMoodId].tagline}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-300 mt-2">
              We'll learn this as you log moods.
            </p>
          )}
        </div>
      </section>

      {last && (
        <section>
          <h2 className="heading text-xl text-ink-50 mb-3">Recently</h2>
          <Link
            to="/history"
            className="card p-5 flex items-center gap-4 hover:bg-white/[0.07]"
          >
            <MoodBadge mood={MOODS[last.moodId]} />
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-ink-50">
                {MOODS[last.moodId].label}
              </p>
              <p className="text-xs text-ink-400">
                {formatDateTime(last.createdAt)} · via {last.source}
              </p>
              {last.note && (
                <p className="text-sm text-ink-200 mt-1.5 line-clamp-2">
                  "{last.note}"
                </p>
              )}
            </div>
            <span className="text-ink-400">→</span>
          </Link>
        </section>
      )}
    </div>
  );
};
