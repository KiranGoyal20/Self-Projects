import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "../app/hooks";
import { chapters } from "../data/curriculum";

export const RoadmapPage = () => {
  const lessons = useAppSelector((s) => s.progress.lessons);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 font-mono mb-1.5">
          The Roadmap
        </p>
        <h1 className="heading text-3xl md:text-4xl text-ink-50">
          From your first <code className="code-inline">page.tsx</code> to a
          shipped app.
        </h1>
        <p className="mt-2 text-ink-300 max-w-2xl">
          Each lesson takes 5–10 minutes. Complete the exercises to unlock the
          next lesson, earn XP, and rack up badges along the way.
        </p>
      </header>

      <div className="space-y-8">
        {chapters.map((chapter, ci) => (
          <section key={chapter.id}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br ${chapter.accent} flex items-center justify-center text-lg shadow-card`}
              >
                {chapter.emoji}
              </div>
              <div>
                <p className="font-mono text-[10px] text-ink-400 uppercase tracking-wider">
                  Chapter {ci + 1}
                </p>
                <h2 className="heading text-xl text-ink-50">{chapter.title}</h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {chapter.lessons.map((lesson, li) => {
                const progress = lessons[lesson.slug];
                const done = progress?.completed;
                const started =
                  (progress?.doneExercises.length ?? 0) > 0 && !done;
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: li * 0.03 }}
                  >
                    <Link
                      to={`/learn/${lesson.slug}`}
                      className={`block rounded-2xl border p-4 h-full transition-all ${
                        done
                          ? "border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/15"
                          : started
                            ? "border-brand-400/40 bg-brand-500/10 hover:bg-brand-500/15"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="text-2xl">{lesson.emoji}</span>
                        <span className="font-mono text-[10px] text-ink-400">
                          +{lesson.xp} XP
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-ink-50 leading-tight">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-ink-300 mt-1 line-clamp-2">
                        {lesson.summary}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-ink-400">
                        <span>⏱ {lesson.minutes} min</span>
                        <span>
                          {done
                            ? "✓ done"
                            : started
                              ? `${progress?.doneExercises.length}/${lesson.exercises.length}`
                              : "·"}
                        </span>
                      </div>
                      {lesson.badge && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-amber-200">
                          🏆 {lesson.badge}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
