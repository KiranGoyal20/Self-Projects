import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { allBadges, flatLessons } from "../data/curriculum";
import { xpProgressInLevel } from "../features/progress/progressSlice";

export const BadgesPage = () => {
  const { xp, level, streak, bestStreak, badges, lessons } = useAppSelector(
    (s) => ({
      xp: s.progress.xp,
      level: s.progress.level,
      streak: s.progress.streak,
      bestStreak: s.progress.bestStreak,
      badges: s.progress.badges,
      lessons: s.progress.lessons,
    }),
  );

  const xpInfo = xpProgressInLevel(xp);
  const completed = flatLessons.filter((r) => lessons[r.lesson.slug]?.completed);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 font-mono mb-1.5">
          Achievements
        </p>
        <h1 className="heading text-3xl md:text-4xl text-ink-50">
          Your wall of <span className="grad-text">wins</span>.
        </h1>
        <p className="mt-2 text-ink-300 max-w-2xl">
          XP, levels, streaks, and badges — every milestone is earned by
          finishing real exercises.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Level"
          value={`Lv ${level}`}
          sub={`${xpInfo.inLevel}/${xpInfo.toNext} XP to next`}
          accent="from-brand-400 to-neon-violet"
          progress={xpInfo.pct}
        />
        <StatTile
          label="Total XP"
          value={`${xp}`}
          sub="Earned across lessons"
          accent="from-neon-pink to-neon-amber"
        />
        <StatTile
          label="Streak"
          value={streak > 0 ? `🔥 ${streak} day${streak === 1 ? "" : "s"}` : "—"}
          sub={`Best: ${bestStreak} days`}
          accent="from-neon-amber to-rose-400"
        />
        <StatTile
          label="Badges"
          value={`${badges.length} / ${allBadges.length}`}
          sub="Unlock by completing key lessons"
          accent="from-neon-green to-brand-400"
        />
      </section>

      <section>
        <h2 className="heading text-xl text-ink-100 mb-4">Badge collection</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allBadges.map((b, i) => {
            const earned = badges.includes(b.id);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-2xl border p-5 flex items-center gap-4 ${
                  earned
                    ? "border-amber-400/30 bg-amber-500/15 shadow-glow"
                    : "border-white/10 bg-white/[0.03] grayscale opacity-70"
                }`}
              >
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${
                    earned
                      ? "bg-gradient-to-br from-amber-400 to-neon-pink shadow-card"
                      : "bg-white/10"
                  }`}
                >
                  {earned ? "🏆" : "🔒"}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-ink-50">{b.id}</p>
                  <p className="text-xs text-ink-300">
                    {earned ? "Unlocked" : "Complete a key lesson"}
                  </p>
                  <Link
                    to={`/learn/${b.lessonSlug}`}
                    className="text-xs text-brand-300 hover:text-brand-200 mt-1 inline-block"
                  >
                    Go to lesson →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="heading text-xl text-ink-100 mb-4">Lessons completed</h2>
        {completed.length === 0 ? (
          <div className="card p-6 text-ink-300 text-sm">
            No lessons finished yet — start with the first chapter on the{" "}
            <Link to="/learn" className="text-brand-300 hover:text-brand-200">
              roadmap
            </Link>
            .
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-2">
            {completed.map((r) => (
              <li
                key={r.lesson.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center justify-between"
              >
                <span className="text-ink-100">
                  <span className="mr-2">{r.lesson.emoji}</span>
                  {r.lesson.title}
                </span>
                <span className="text-xs font-mono text-emerald-300">
                  +{r.lesson.xp} XP
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const StatTile = ({
  label,
  value,
  sub,
  accent,
  progress,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  progress?: number;
}) => (
  <div className="card p-5 relative overflow-hidden">
    <div
      className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-30 blur-3xl`}
    />
    <p className="relative text-[10px] uppercase tracking-wider font-mono text-ink-400">
      {label}
    </p>
    <p className="relative mt-1 font-display text-2xl font-bold text-ink-50">
      {value}
    </p>
    <p className="relative text-xs text-ink-300 mt-0.5">{sub}</p>
    {progress !== undefined && (
      <div className="relative mt-3 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${accent}`}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    )}
  </div>
);
