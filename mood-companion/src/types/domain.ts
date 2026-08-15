export type MoodId =
  | "joyful"
  | "calm"
  | "melancholic"
  | "energetic"
  | "romantic"
  | "focused"
  | "nostalgic"
  | "adventurous";

export interface Mood {
  id: MoodId;
  label: string;
  emoji: string;
  tagline: string;
  /** Gradient classes for cards/backgrounds (Tailwind utilities) */
  gradient: string;
  /** Color used for charts and accents */
  accent: string;
  /** Energy 0-100 — used for visual indicators */
  energy: number;
  /** Valence 0-100 — pleasantness */
  valence: number;
  /** Short description shown on detail screens */
  description: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationSec: number;
  /** Stable color for the cover */
  cover: string;
  /** Moods this track fits */
  moods: MoodId[];
  tags: string[];
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  genres: string[];
  runtimeMin: number;
  rating: number;
  blurb: string;
  poster: string;
  moods: MoodId[];
}

export type DetectionSource = "quiz" | "journal" | "manual";

export interface MoodEntry {
  id: string;
  moodId: MoodId;
  /** ISO timestamp */
  createdAt: string;
  source: DetectionSource;
  /** Optional journal text supplied by user */
  note?: string;
  /** Confidence 0-1 only meaningful for non-manual */
  confidence?: number;
  /** Snapshot of recommendations user saved alongside this entry */
  savedTrackIds: string[];
  savedMovieIds: string[];
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
  /** Each option contributes to mood scoring */
  moodWeights: Partial<Record<MoodId, number>>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    emoji: string;
    moodWeights: Partial<Record<MoodId, number>>;
  }[];
}
