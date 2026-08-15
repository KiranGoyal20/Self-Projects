import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DetectionSource, MoodId } from "../../types/domain";

export interface MoodState {
  /** The mood the user is currently exploring (not yet committed to history) */
  currentMood: MoodId | null;
  source: DetectionSource | null;
  confidence: number;
  note: string;
  /** Quiz answers keyed by questionId -> optionId */
  quizAnswers: Record<string, string>;
}

const initialState: MoodState = {
  currentMood: null,
  source: null,
  confidence: 0,
  note: "",
  quizAnswers: {},
};

const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {
    setCurrentMood(
      state,
      action: PayloadAction<{
        mood: MoodId;
        source: DetectionSource;
        confidence?: number;
        note?: string;
      }>
    ) {
      state.currentMood = action.payload.mood;
      state.source = action.payload.source;
      state.confidence = action.payload.confidence ?? 1;
      state.note = action.payload.note ?? "";
    },
    answerQuiz(
      state,
      action: PayloadAction<{ questionId: string; optionId: string }>
    ) {
      state.quizAnswers[action.payload.questionId] = action.payload.optionId;
    },
    resetQuiz(state) {
      state.quizAnswers = {};
    },
    clearMood(state) {
      state.currentMood = null;
      state.source = null;
      state.confidence = 0;
      state.note = "";
    },
  },
});

export const { setCurrentMood, answerQuiz, resetQuiz, clearMood } = moodSlice.actions;
export default moodSlice.reducer;
