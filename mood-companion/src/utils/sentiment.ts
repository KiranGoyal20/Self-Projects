import type { MoodId } from "../types/domain";

/**
 * Lightweight keyword-based mood detector for journal entries.
 * Not as accurate as a real NLP model — intentionally small and explainable.
 */
const KEYWORDS: Record<MoodId, string[]> = {
  joyful: ["happy", "joy", "glad", "smile", "sunshine", "great", "amazing", "wonderful", "grateful", "love", "fun", "yay", "celebrate", "win", "buzzing"],
  calm: ["calm", "peaceful", "quiet", "still", "settled", "okay", "fine", "breathe", "tea", "gentle", "soft", "easy", "rest", "rested"],
  melancholic: ["sad", "down", "blue", "tired", "heavy", "lonely", "miss", "cry", "lost", "empty", "ache", "hurt", "grief", "low", "exhausted"],
  energetic: ["energy", "pumped", "go", "run", "hyped", "fast", "fired", "fire", "ready", "intense", "alive", "rush", "buzz", "amped"],
  romantic: ["love", "hearts", "him", "her", "them", "kiss", "date", "miss", "longing", "warm", "tender", "us", "we", "together", "crush"],
  focused: ["focus", "work", "deep", "study", "ship", "build", "finish", "deadline", "code", "writing", "concentrate", "task", "goal"],
  nostalgic: ["remember", "memory", "old", "back", "years", "childhood", "past", "used to", "before", "school", "growing up", "miss"],
  adventurous: ["new", "travel", "explore", "different", "change", "wander", "trip", "road", "outside", "discover", "try", "leap"],
};

export interface SentimentResult {
  mood: MoodId;
  confidence: number;
  scores: Record<MoodId, number>;
}

export const detectMoodFromText = (text: string): SentimentResult => {
  const normalized = text.toLowerCase();
  const scores = Object.fromEntries(
    Object.keys(KEYWORDS).map((k) => [k, 0])
  ) as Record<MoodId, number>;

  for (const [moodId, words] of Object.entries(KEYWORDS) as [MoodId, string[]][]) {
    for (const w of words) {
      if (!w) continue;
      const re = new RegExp(`\\b${w.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "g");
      const matches = normalized.match(re);
      if (matches) scores[moodId] += matches.length;
    }
  }

  const ranked = (Object.entries(scores) as [MoodId, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const top = ranked[0];
  const total = ranked.reduce((sum, [, v]) => sum + v, 0);

  if (!top || top[1] === 0) {
    return { mood: "calm", confidence: 0.2, scores };
  }

  const confidence = Math.min(1, top[1] / Math.max(total, 1) + 0.2);
  return { mood: top[0], confidence, scores };
};
