"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Exercise } from "@/types/curriculum";
import { useAppSelector } from "@/store/hooks";

type Props = {
  exercise: Extract<Exercise, { kind: "quiz" }>;
  slug: string;
  onComplete: () => void;
};

export const QuizExercise = ({ exercise, slug, onComplete }: Props) => {
  const isDone = useAppSelector(
    (s) => s.progress.lessons[slug]?.doneExercises.includes(exercise.id) ?? false
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalCorrect = exercise.questions.filter(
    (q) => answers[q.id] === q.correct
  ).length;
  const allCorrect = totalCorrect === exercise.questions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (allCorrect) onComplete();
  };

  const handleRetry = () => {
    setSubmitted(false);
    setAnswers({});
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-neon-violet font-mono mb-1">
            Exercise · quiz
          </p>
          <h3 className="font-display text-lg font-bold text-ink-50">
            {exercise.title}
          </h3>
        </div>
        {isDone && (
          <div className="chip border-emerald-400/30 bg-emerald-500/15 text-emerald-200">
            ✓ Completed
          </div>
        )}
      </div>

      <div className="space-y-5">
        {exercise.questions.map((q, qi) => {
          const picked = answers[q.id];
          return (
            <div key={q.id}>
              <p className="font-medium text-ink-100 mb-2.5">
                <span className="text-ink-400 mr-2 font-mono text-xs">Q{qi + 1}</span>
                {q.prompt}
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const isPicked = picked === oi;
                  const isRight = q.correct === oi;
                  const showFeedback = submitted && (isPicked || isRight);
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                        showFeedback
                          ? isRight
                            ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-50"
                            : isPicked
                            ? "border-rose-400/40 bg-rose-500/15 text-rose-50"
                            : "border-white/10 bg-white/[0.03] text-ink-300"
                          : isPicked
                          ? "border-brand-300/50 bg-brand-500/15 text-ink-50"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-ink-100"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-ink-400 mr-2">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {submitted && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-ink-300"
                  >
                    <span className="text-ink-400 mr-1">Why:</span>
                    {q.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            className="btn-primary"
            disabled={Object.keys(answers).length < exercise.questions.length}
            onClick={handleSubmit}
          >
            ✓ Submit answers
          </button>
        ) : allCorrect ? (
          <span className="chip border-emerald-400/30 bg-emerald-500/15 text-emerald-200">
            🎯 Perfect — {totalCorrect}/{exercise.questions.length}
          </span>
        ) : (
          <>
            <span className="chip border-amber-400/30 bg-amber-500/15 text-amber-100">
              {totalCorrect}/{exercise.questions.length} correct — try again
            </span>
            <button className="btn-ghost" onClick={handleRetry}>
              ↺ Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
};
