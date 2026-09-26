"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Exercise } from "@/types/curriculum";
import { CodeEditor } from "@/components/CodeEditor";
import { SimulatedBrowser } from "@/components/SimulatedBrowser";
import { runChecks } from "@/utils/validate";
import { renderPreview } from "@/utils/previewRender";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { saveCode } from "@/features/progress/progressSlice";

type Props = {
  exercise: Extract<Exercise, { kind: "code" }>;
  slug: string;
  onComplete: () => void;
};

export const CodeExercise = ({ exercise, slug, onComplete }: Props) => {
  const dispatch = useAppDispatch();
  const persistedCode = useAppSelector(
    (s) => s.progress.lessons[slug]?.code?.[exercise.id]
  );
  const isDone = useAppSelector(
    (s) => s.progress.lessons[slug]?.doneExercises.includes(exercise.id) ?? false
  );

  const [code, setCode] = useState<string>(persistedCode ?? exercise.starter);
  const [showHint, setShowHint] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; messages: string[] } | null>(null);
  const [didTrigger, setDidTrigger] = useState(false);

  useEffect(() => {
    if (persistedCode && !didTrigger) {
      setCode(persistedCode);
    }
  }, [persistedCode, didTrigger]);

  const previewNode = useMemo(() => {
    try {
      return exercise.preview ? exercise.preview(code) : null;
    } catch {
      return null;
    }
  }, [code, exercise]);

  const handleChange = (next: string) => {
    setCode(next);
    setDidTrigger(true);
    dispatch(saveCode({ slug, exerciseId: exercise.id, code: next }));
  };

  const handleRun = () => {
    const result = runChecks(code, exercise.checks);
    setFeedback({
      ok: result.ok,
      messages: result.ok ? ["Nice — all checks passed."] : result.failedMessages,
    });
    if (result.ok) onComplete();
  };

  const handleSolution = () => {
    setCode(exercise.solution);
    dispatch(saveCode({ slug, exerciseId: exercise.id, code: exercise.solution }));
  };

  const handleReset = () => {
    setCode(exercise.starter);
    setFeedback(null);
    dispatch(saveCode({ slug, exerciseId: exercise.id, code: exercise.starter }));
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-brand-300 font-mono mb-1">
            Exercise · code
          </p>
          <h3 className="font-display text-lg font-bold text-ink-50">
            {exercise.title}
          </h3>
          <p className="text-sm text-ink-300 mt-1 max-w-2xl">{exercise.brief}</p>
        </div>
        {isDone && (
          <div className="chip border-emerald-400/30 bg-emerald-500/15 text-emerald-200">
            ✓ Completed
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <CodeEditor
            value={code}
            onChange={handleChange}
            language={exercise.language}
            filename={exercise.filename}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={handleRun}>
              ▶ Run checks
            </button>
            <button
              className="btn-ghost"
              onClick={() => setShowHint((h) => Math.min(exercise.hints.length, h + 1))}
              disabled={showHint >= exercise.hints.length}
            >
              💡 Hint ({showHint}/{exercise.hints.length})
            </button>
            <button className="btn-outline" onClick={handleReset}>
              ↺ Reset
            </button>
            <button
              className="btn-outline opacity-70 hover:opacity-100"
              onClick={handleSolution}
              title="Reveal the solution (no XP penalty, but try first!)"
            >
              👀 Show solution
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <SimulatedBrowser
            url={`localhost:3000${exercise.filename ? routeFromFile(exercise.filename) : ""}`}
          >
            <div className="p-1">
              {previewNode ? (
                renderPreview(previewNode)
              ) : (
                <div className="p-8 text-sm text-ink-400 italic">
                  Preview will appear as you type a valid component.
                </div>
              )}
            </div>
          </SimulatedBrowser>

          <AnimatePresence>
            {showHint > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-brand-400/30 bg-brand-500/10 p-3"
              >
                <p className="text-[10px] uppercase tracking-wider font-mono text-brand-200 mb-1.5">
                  Hint{showHint > 1 ? "s" : ""}
                </p>
                <ul className="space-y-1.5 text-sm text-brand-100">
                  {exercise.hints.slice(0, showHint).map((h, i) => (
                    <li key={i}>• {h}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {feedback && (
              <motion.div
                key={feedback.ok ? "ok" : "bad"}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`rounded-xl border p-3 ${
                  feedback.ok
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                    : "border-amber-400/30 bg-amber-500/10 text-amber-100"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider font-mono mb-1.5 opacity-80">
                  {feedback.ok ? "All checks passed" : "Almost — fix these"}
                </p>
                <ul className="space-y-1 text-sm">
                  {feedback.messages.map((m, i) => (
                    <li key={i}>
                      {feedback.ok ? "✓" : "•"} {m}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function routeFromFile(file: string): string {
  if (!file.startsWith("app/")) return "";
  return (
    file
      .replace(/^app/, "")
      .replace(/\/page\.(tsx|jsx|ts|js)$/, "")
      .replace(/\/route\.(ts|js)$/, "")
      .replace(/\/layout\.(tsx|jsx|ts|js)$/, "") || "/"
  );
}
