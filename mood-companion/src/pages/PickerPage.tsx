import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../app/hooks";
import { setCurrentMood } from "../features/mood/moodSlice";
import { MOOD_LIST } from "../data/moods";
import type { MoodId } from "../types/domain";

export const PickerPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handlePick = (moodId: MoodId) => {
    dispatch(
      setCurrentMood({ mood: moodId, source: "manual", confidence: 1 })
    );
    navigate("/discover");
  };

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="heading text-3xl md:text-4xl text-ink-50">
          Pick the mood that fits
        </h1>
        <p className="text-ink-300 mt-2">
          Each mood comes with a hand-picked set of music and films.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOOD_LIST.map((mood, i) => (
          <motion.button
            key={mood.id}
            type="button"
            onClick={() => handlePick(mood.id)}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.03 * i }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-2xl text-left bg-gradient-to-br ${mood.gradient} p-5 h-44 shadow-card focus:outline-none focus:ring-2 focus:ring-white/40`}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex flex-col justify-between">
              <div className="text-4xl">{mood.emoji}</div>
              <div>
                <p className="font-display font-bold text-white text-lg drop-shadow-sm">
                  {mood.label}
                </p>
                <p className="text-xs text-white/85 mt-0.5 drop-shadow-sm">
                  {mood.tagline}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
