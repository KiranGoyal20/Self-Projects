import { QUIZ } from "../data/quiz";
import type { MoodId } from "../types/domain";

export interface QuizResult {
  mood: MoodId;
  confidence: number;
  scores: Record<MoodId, number>;
}

/**
 * Aggregates quiz option weights to determine the winning mood.
 * Confidence is the winner's share relative to the second place.
 */
export const scoreQuiz = (answers: Record<string, string>): QuizResult => {
  const scores: Record<MoodId, number> = {
    joyful: 0,
    calm: 0,
    melancholic: 0,
    energetic: 0,
    romantic: 0,
    focused: 0,
    nostalgic: 0,
    adventurous: 0,
  };

  for (const question of QUIZ) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const [mood, weight] of Object.entries(option.moodWeights) as [
      MoodId,
      number,
    ][]) {
      scores[mood] += weight;
    }
  }

  const ranked = (Object.entries(scores) as [MoodId, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const [top, second] = ranked;
  if (!top || top[1] === 0) {
    return { mood: "calm", confidence: 0.3, scores };
  }
  const margin = top[1] - (second?.[1] ?? 0);
  const confidence = Math.min(1, 0.5 + margin / Math.max(top[1], 1) * 0.5);
  return { mood: top[0], confidence, scores };
};
