"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Exercise } from "@/types/curriculum";
import { useAppSelector } from "@/store/hooks";

type Props = {
  exercise: Extract<Exercise, { kind: "fill" }>;
  slug: string;
  onComplete: () => void;
};

function tokenize(template: string): (string | { idx: number })[] {
  const parts: (string | { idx: number })[] = [];
  const re = /\{\{(\d+)\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template))) {
    if (m.index > last) parts.push(template.slice(last, m.index));
    parts.push({ idx: parseInt(m[1], 10) });
    last = m.index + m[0].length;
  }
  if (last < template.length) parts.push(template.slice(last));
  return parts;
}

function isCorrect(
  input: string,
  blank: { answer: string; alternates?: string[] }
) {
  const v = input.trim().toLowerCase();
  if (v === blank.answer.trim().toLowerCase()) return true;
  return blank.alternates?.some((a) => a.trim().toLowerCase() === v) ?? false;
}

export const FillExercise = ({ exercise, slug, onComplete }: Props) => {
  const isDone = useAppSelector(
    (s) => s.progress.lessons[slug]?.doneExercises.includes(exercise.id) ?? false
  );
  const parts = useMemo(() => tokenize(exercise.template), [exercise.template]);
  const [values, setValues] = useState<string[]>(exercise.blanks.map(() => ""));
  const [showHint, setShowHint] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const allRight = exercise.blanks.every((b, i) => isCorrect(values[i], b));

  const handleCheck = () => {
    setSubmitted(true);
    if (allRight) onComplete();
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-neon-amber font-mono mb-1">
            Exercise · fill in
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

      <div className="font-mono text-base leading-loose p-4 rounded-xl bg-ink-900/60 border border-white/10 flex flex-wrap items-center gap-x-1.5">
        {parts.map((p, i) =>
          typeof p === "string" ? (
            <span key={i}>{p}</span>
          ) : (
            <input
              key={i}
              type="text"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              value={values[p.idx] ?? ""}
              onChange={(e) => {
                const next = [...values];
                next[p.idx] = e.target.value;
                setValues(next);
              }}
              className={`px-2 py-1 rounded-lg border bg-ink-950/60 text-brand-200 outline-none w-32 text-sm transition-colors ${
                submitted
                  ? isCorrect(values[p.idx] ?? "", exercise.blanks[p.idx])
                    ? "border-emerald-400/50"
                    : "border-rose-400/50"
                  : "border-white/15 focus:border-brand-300/50"
              }`}
              placeholder={`blank ${p.idx + 1}`}
            />
          )
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-primary" onClick={handleCheck}>
          ✓ Check
        </button>
        <button
          className="btn-ghost"
          onClick={() => setShowHint((h) => Math.min(exercise.hints.length, h + 1))}
          disabled={showHint >= exercise.hints.length}
        >
          💡 Hint ({showHint}/{exercise.hints.length})
        </button>
      </div>

      <AnimatePresence>
        {showHint > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border border-brand-400/30 bg-brand-500/10 p-3"
          >
            <ul className="space-y-1.5 text-sm text-brand-100">
              {exercise.hints.slice(0, showHint).map((h, i) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-3 rounded-xl border p-3 ${
              allRight
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-amber-400/30 bg-amber-500/10 text-amber-100"
            }`}
          >
            <p className="text-sm">
              {allRight
                ? "Spot on. Onward!"
                : "Some blanks aren't quite right — see the red outlines."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
