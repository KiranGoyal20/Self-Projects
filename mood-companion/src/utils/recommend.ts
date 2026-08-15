import { MOVIES } from "../data/movies";
import { TRACKS } from "../data/tracks";
import type { Movie, MoodId, Track } from "../types/domain";

const scoreFor = <T extends { moods: MoodId[] }>(item: T, mood: MoodId): number => {
  const idx = item.moods.indexOf(mood);
  if (idx === -1) return 0;
  // primary match: 3pts, secondary: 2pts, tertiary: 1pt
  return Math.max(1, 3 - idx);
};

export const recommendTracks = (mood: MoodId, limit = 8): Track[] => {
  return [...TRACKS]
    .map((t) => ({ track: t, score: scoreFor(t, mood) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.track);
};

export const recommendMovies = (mood: MoodId, limit = 6): Movie[] => {
  return [...MOVIES]
    .map((m) => ({ movie: m, score: scoreFor(m, mood) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.movie);
};
