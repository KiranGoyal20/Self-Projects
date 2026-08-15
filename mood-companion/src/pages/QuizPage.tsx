import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { answerQuiz, resetQuiz, setCurrentMood } from "../features/mood/moodSlice";
import { QUIZ } from "../data/quiz";
import { scoreQuiz } from "../utils/quiz";

export const QuizPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const answers = useAppSelector((s) => s.mood.quizAnswers);
  const [stepIdx, setStepIdx] = useState(() => {
    const answered = QUIZ.findIndex((q) => !answers[q.id]);
    return answered === -1 ? 0 : answered;
  });

  const question = QUIZ[stepIdx];
  const isLast = stepIdx === QUIZ.length - 1;
  const selected = answers[question.id];
  const progress = useMemo(
    () => ((stepIdx + (selected ? 1 : 0)) / QUIZ.length) * 100,
    [stepIdx, selected]
  );

  const handleSelect = (optionId: string) => {
    dispatch(answerQuiz({ questionId: question.id, optionId }));
  };

  const handleNext = () => {
    if (!selected) return;
    if (!isLast) {
      setStepIdx((i) => i + 1);
      return;
    }
    const result = scoreQuiz({ ...answers, [question.id]: selected });
    dispatch(
      setCurrentMood({
        mood: result.mood,
        source: "quiz",
        confidence: result.confidence,
      })
    );
    dispatch(resetQuiz());
    navigate("/discover");
  };

  const handleBack = () => {
    if (stepIdx === 0) {
      navigate("/detect");
      return;
    }
    setStepIdx((i) => i - 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-ink-400">
          Question {stepIdx + 1} of {QUIZ.length}
        </p>
        <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-fuchsia-400 to-violet-400"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -24, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="heading text-2xl md:text-3xl text-ink-50 mb-6">
            {question.prompt}
          </h1>
          <div className="grid gap-3">
            {question.options.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`card text-left p-4 flex items-center gap-4 hover:bg-white/[0.08] transition-all ${
                    isSelected
                      ? "ring-2 ring-fuchsia-400/70 bg-white/[0.08]"
                      : ""
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-ink-100">{opt.label}</span>
                  {isSelected && (
                    <span className="ml-auto text-fuchsia-300 text-lg">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={handleBack} className="btn-ghost">
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selected}
          className="btn-primary"
        >
          {isLast ? "See my recommendations" : "Next"} →
        </button>
      </div>
    </div>
  );
};
