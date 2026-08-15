import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../app/hooks";
import { setCurrentMood } from "../features/mood/moodSlice";
import { detectMoodFromText } from "../utils/sentiment";
import { MOODS } from "../data/moods";
import { MoodBadge } from "../components/MoodBadge";

const placeholderText =
  "What's on your mind? Today went a little weird — long meetings, then a walk that fixed everything…";

export const JournalPage = () => {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const preview = useMemo(() => {
    const trimmed = text.trim();
    if (trimmed.length < 6) return null;
    return detectMoodFromText(trimmed);
  }, [text]);

  const handleSubmit = () => {
    if (!preview) return;
    dispatch(
      setCurrentMood({
        mood: preview.mood,
        source: "journal",
        confidence: preview.confidence,
        note: text.trim(),
      })
    );
    navigate("/discover");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="heading text-3xl md:text-4xl text-ink-50">
          Write a few sentences
        </h1>
        <p className="text-ink-300 mt-2">
          You can be vague, you can ramble. A keyword-based engine reads the tone.
        </p>
      </header>

      <div className="card p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholderText}
          rows={8}
          className="w-full bg-transparent resize-none outline-none placeholder:text-ink-400 text-ink-50 leading-relaxed"
        />
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-xs text-ink-400">
            {text.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <button
            type="button"
            onClick={() => setText("")}
            className="text-xs text-ink-400 hover:text-ink-200"
            disabled={!text}
          >
            Clear
          </button>
        </div>
      </div>

      {preview && (
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card p-5"
        >
          <div className="flex items-center gap-4">
            <MoodBadge mood={MOODS[preview.mood]} />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Reading
              </p>
              <p className="font-display font-semibold text-ink-50 text-lg">
                {MOODS[preview.mood].label}
              </p>
              <p className="text-sm text-ink-300">
                Confidence {Math.round(preview.confidence * 100)}%
              </p>
            </div>
            <div className="w-24 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-400 to-violet-400"
                style={{ width: `${Math.round(preview.confidence * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate("/detect")} className="btn-ghost">
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!preview}
          className="btn-primary"
        >
          See my recommendations →
        </button>
      </div>
    </div>
  );
};
