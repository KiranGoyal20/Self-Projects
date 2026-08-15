import { createSlice, type PayloadAction, nanoid } from "@reduxjs/toolkit";
import type { DetectionSource, MoodEntry, MoodId } from "../../types/domain";

export interface HistoryState {
  entries: MoodEntry[];
}

const initialState: HistoryState = { entries: [] };

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    logMood: {
      reducer(state, action: PayloadAction<MoodEntry>) {
        state.entries.unshift(action.payload);
      },
      prepare(payload: {
        moodId: MoodId;
        source: DetectionSource;
        note?: string;
        confidence?: number;
      }) {
        return {
          payload: {
            id: nanoid(),
            createdAt: new Date().toISOString(),
            savedTrackIds: [],
            savedMovieIds: [],
            ...payload,
          },
        };
      },
    },
    toggleTrackSaved(
      state,
      action: PayloadAction<{ entryId: string; trackId: string }>
    ) {
      const entry = state.entries.find((e) => e.id === action.payload.entryId);
      if (!entry) return;
      const idx = entry.savedTrackIds.indexOf(action.payload.trackId);
      if (idx === -1) entry.savedTrackIds.push(action.payload.trackId);
      else entry.savedTrackIds.splice(idx, 1);
    },
    toggleMovieSaved(
      state,
      action: PayloadAction<{ entryId: string; movieId: string }>
    ) {
      const entry = state.entries.find((e) => e.id === action.payload.entryId);
      if (!entry) return;
      const idx = entry.savedMovieIds.indexOf(action.payload.movieId);
      if (idx === -1) entry.savedMovieIds.push(action.payload.movieId);
      else entry.savedMovieIds.splice(idx, 1);
    },
    deleteEntry(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter((e) => e.id !== action.payload);
    },
    clearHistory(state) {
      state.entries = [];
    },
  },
});

export const {
  logMood,
  toggleTrackSaved,
  toggleMovieSaved,
  deleteEntry,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;
