import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { MoodEntry, MoodId } from "../types/domain";

export const selectEntries = (state: RootState): MoodEntry[] =>
  state.history.entries;

export const selectCurrentMood = (state: RootState) => state.mood.currentMood;
export const selectMoodSession = (state: RootState) => state.mood;
export const selectPreferences = (state: RootState) => state.preferences;

export const selectMoodCounts = createSelector(selectEntries, (entries) => {
  const counts: Partial<Record<MoodId, number>> = {};
  for (const e of entries) {
    counts[e.moodId] = (counts[e.moodId] ?? 0) + 1;
  }
  return counts;
});

export const selectTopMood = createSelector(selectMoodCounts, (counts) => {
  const entries = Object.entries(counts) as [MoodId, number][];
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
});

export const selectStreakDays = createSelector(selectEntries, (entries) => {
  if (entries.length === 0) return 0;
  const days = new Set<string>();
  for (const e of entries) {
    const d = new Date(e.createdAt);
    d.setHours(0, 0, 0, 0);
    days.add(d.toISOString());
  }
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
});

export const selectEntriesLast30Days = createSelector(selectEntries, (entries) => {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return entries.filter((e) => new Date(e.createdAt).getTime() >= cutoff);
});
