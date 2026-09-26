"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/hooks";
import { chapters, flatLessons, totalLessons, totalXp } from "@/data/curriculum";
import { xpProgressInLevel } from "@/features/progress/progressSlice";

export default function HomePage() {
  const { xp, badges, streak, lessons, displayName } = useAppSelector((s) => ({
    xp: s.progress.xp,
    badges: s.progress.badges,
    streak: s.progress.streak,
    lessons: s.progress.lessons,
    displayName: s.settings.displayName,
  }));
  const xpInfo = xpProgressInLevel(xp);
  const completedCount = Object.values(lessons).filter((l) => l.completed).length;
  const nextUp = flatLessons.find((r) => !lessons[r.lesson.slug]?.completed);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900/60 via-ink-900/30 to-ink-950/80 p-7 md:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(at 18% 14%, rgba(167,139,250,0.35) 0px, transparent 50%), radial-gradient(at 82% 6%, rgba(45,191,255,0.28) 0px, transparent 50%), radial-gradient(at 4% 96%, rgba(94,234,212,0.22) 0px, transparent 55%), radial-gradient(at 96% 92%, rgba(244,114,182,0.22) 0px, transparent 50%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative">
          <p className="inline-flex items-center gap-2 chip mb-4 border-brand-400/30 bg-brand-500/10 text-brand-200">
            🚀 An interactive quest through Next.js
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink-50 leading-[1.05] max-w-3xl">
            Stop reading docs. <span className="grad-text">Play</span> your way into Next.js.
          </h1>
          <p className="mt-4 max-w-2xl text-ink-200 text-base md:text-lg leading-relaxed">
            Bite-sized lessons, built-in code exercises with instant checks, XP and badges that
            compound, and a live AI tutor when you get stuck. All in one tab.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {nextUp ? (
              <Link href={`/learn/${nextUp.lesson.slug}`} className="btn-primary">
                ▶ {completedCount === 0 ? "Start the quest" : "Continue learning"}
              </Link>
            ) : (
              <Link href="/learn" className="btn-primary">
                ✨ Replay any lesson
              </Link>
            )}
            <Link href="/chat" className="btn-ghost">
              💬 Ask NextSage
            </Link>
            <Link href="/learn" className="btn-outline">
              🗺️ See the roadmap
            </Link>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-3">
            <StatCard label="Greeting" value={`👋 ${displayName}`} sub={`Level ${xpInfo.level}`} />
            <StatCard
              label="Progress"
              value={`${completedCount} / ${totalLessons}`}
              sub={`${xp} / ${totalXp} XP`}
              progress={xpInfo.pct}
            />
            <StatCard
              label="Streak"
              value={streak > 0 ? `🔥 ${streak} day${streak === 1 ? "" : "s"}` : "Start your streak"}
              sub={`${badges.length} badges earned`}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 font-mono">
              The path
            </p>
            <h2 className="heading text-2xl md:text-3xl text-ink-50">
              Six chapters, one mission.
            </h2>
          </div>
          <Link href="/learn" className="text-sm text-brand-300 hover:text-brand-200">
            See all →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter, ci) => {
            const lessonCount = chapter.lessons.length;
            const done = chapter.lessons.filter(
              (l) => lessons[l.slug]?.completed
            ).length;
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.04 }}
              >
                <Link
                  href={`/learn/${chapter.lessons[0].slug}`}
                  className="block card p-5 h-full hover:shadow-glow transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`h-11 w-11 rounded-xl bg-gradient-to-br ${chapter.accent} flex items-center justify-center text-xl shadow-card`}
                    >
                      {chapter.emoji}
                    </div>
                    <span className="font-mono text-[10px] text-ink-400">
                      Ch · {String(ci + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink-50">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-ink-300 mt-1">{chapter.tagline}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${chapter.accent}`}
                        style={{ width: `${(done / lessonCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-ink-300">
                      {done}/{lessonCount}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <Feature emoji="🧪" title="Real code, instant feedback." body="Every lesson ends in a coding challenge. We parse what you write against a checklist of expectations — same loop a senior reviewer would use, just faster." />
        <Feature emoji="🤖" title="Your own AI tutor." body="NextSage lives on every page. It already knows your current lesson, your code, and the framework. Plug in an OpenAI key for full LLM smarts." />
        <Feature emoji="🏆" title="Badges & XP that mean something." body="No fake currency. XP per lesson, levels, streaks, and badges that unlock at meaningful milestones. Your progress persists locally — no signup." />
        <Feature emoji="🌐" title="App Router-first, no legacy fluff." body="Everything you learn matches Next.js 14/15 in production: Server Components by default, Server Actions, Route Handlers, modern caching." />
      </section>
    </div>
  );
}

const StatCard = ({ label, value, sub, progress }: {
  label: string; value: string; sub: string; progress?: number;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <p className="text-[10px] uppercase tracking-wider font-mono text-ink-400">{label}</p>
    <p className="mt-1 font-display text-xl font-bold text-ink-50">{value}</p>
    <p className="text-xs text-ink-300 mt-0.5">{sub}</p>
    {progress !== undefined && (
      <div className="mt-3 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-400 via-neon-violet to-neon-pink"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    )}
  </div>
);

const Feature = ({ emoji, title, body }: { emoji: string; title: string; body: string }) => (
  <div className="card p-5">
    <div className="text-2xl mb-2">{emoji}</div>
    <h3 className="font-display font-bold text-base text-ink-50">{title}</h3>
    <p className="text-sm text-ink-300 mt-1.5 leading-relaxed">{body}</p>
  </div>
);
