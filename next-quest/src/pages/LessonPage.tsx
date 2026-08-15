import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { findLesson, nextLesson, prevLesson } from "../data/curriculum";
import { LessonContent } from "../components/LessonContent";
import { CodeExercise } from "../components/exercises/CodeExercise";
import { QuizExercise } from "../components/exercises/QuizExercise";
import { FillExercise } from "../components/exercises/FillExercise";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { completeExercise, visit } from "../features/progress/progressSlice";

export const LessonPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const ref = useMemo(() => (slug ? findLesson(slug) : undefined), [slug]);
  const lessonProgress = useAppSelector(
    (s) => (slug ? s.progress.lessons[slug] : undefined),
  );

  useEffect(() => {
    if (slug && ref) {
      dispatch(visit({ slug }));
    }
  }, [slug, ref, dispatch]);

  if (!slug || !ref) {
    return (
      <div className="card p-8 text-center">
        <p className="text-xl mb-3">🕵️ Lesson not found</p>
        <Link to="/learn" className="btn-primary">
          ← Back to the roadmap
        </Link>
      </div>
    );
  }

  const { chapter, lesson, globalIndex } = ref;
  const prev = prevLesson(slug);
  const next = nextLesson(slug);
  const totalExercises = lesson.exercises.length;
  const doneCount = lessonProgress?.doneExercises.length ?? 0;
  const allDone = doneCount >= totalExercises;

  const handleComplete = (exerciseId: string) => {
    dispatch(
      completeExercise({
        slug,
        exerciseId,
        totalExercises,
        xpReward: lesson.xp,
        badgeId: lesson.badge,
      }),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400 font-mono">
        <Link to="/learn" className="hover:text-brand-200">
          Roadmap
        </Link>
        <span>›</span>
        <span>{chapter.title}</span>
        <span>›</span>
        <span className="text-ink-200">{lesson.title}</span>
      </div>

      <header className="card p-6 md:p-8 relative overflow-hidden">
        <div
          className={`pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br ${chapter.accent} opacity-20 blur-3xl`}
        />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="chip">{chapter.emoji} {chapter.title}</span>
              <span className="chip font-mono text-[10px]">
                Lesson {globalIndex + 1}
              </span>
              {lesson.badge && (
                <span className="chip border-amber-400/30 bg-amber-500/15 text-amber-200">
                  🏆 {lesson.badge}
                </span>
              )}
            </div>
            <h1 className="heading text-3xl md:text-4xl text-ink-50">
              <span className="mr-3">{lesson.emoji}</span>
              {lesson.title}
            </h1>
            <p className="text-ink-300 mt-2 max-w-2xl">{lesson.summary}</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="text-ink-300">⏱ {lesson.minutes} min</span>
              <span className="text-brand-200">+{lesson.xp} XP</span>
              <span className="text-ink-300">
                {doneCount}/{totalExercises} exercises
              </span>
            </div>
          </div>
          {allDone && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl px-4 py-3 border border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
            >
              <p className="text-xs font-mono uppercase tracking-wider">
                Lesson complete
              </p>
              <p className="text-lg font-display font-bold">+{lesson.xp} XP banked</p>
            </motion.div>
          )}
        </div>
      </header>

      <section className="card p-6 md:p-8">
        <LessonContent blocks={lesson.content} />
      </section>

      {lesson.exercises.map((exercise) => {
        if (exercise.kind === "code") {
          return (
            <CodeExercise
              key={exercise.id}
              exercise={exercise}
              slug={slug}
              onComplete={() => handleComplete(exercise.id)}
            />
          );
        }
        if (exercise.kind === "quiz") {
          return (
            <QuizExercise
              key={exercise.id}
              exercise={exercise}
              slug={slug}
              onComplete={() => handleComplete(exercise.id)}
            />
          );
        }
        return (
          <FillExercise
            key={exercise.id}
            exercise={exercise}
            slug={slug}
            onComplete={() => handleComplete(exercise.id)}
          />
        );
      })}

      <nav className="flex flex-wrap items-center gap-3 pt-2">
        {prev ? (
          <Link to={`/learn/${prev.lesson.slug}`} className="btn-ghost">
            ← {prev.lesson.title}
          </Link>
        ) : (
          <Link to="/learn" className="btn-ghost">
            ← Roadmap
          </Link>
        )}
        <div className="flex-1" />
        {next ? (
          <button
            className={allDone ? "btn-primary" : "btn-outline"}
            disabled={!allDone}
            onClick={() =>
              allDone && navigate(`/learn/${next.lesson.slug}`)
            }
            title={
              allDone
                ? "Continue"
                : "Complete every exercise to unlock the next lesson."
            }
          >
            {next.lesson.title} →
          </button>
        ) : (
          <Link to="/badges" className="btn-primary">
            🏁 You finished — see your badges
          </Link>
        )}
      </nav>
    </div>
  );
};
