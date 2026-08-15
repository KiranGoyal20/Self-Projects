import type { QuizQuestion } from "../types/domain";

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Your body right now feels…",
    options: [
      { id: "q1a", label: "Buzzing — I could run a mile", emoji: "⚡", moodWeights: { energetic: 3, adventurous: 1 } },
      { id: "q1b", label: "Settled and steady", emoji: "🌿", moodWeights: { calm: 3, focused: 1 } },
      { id: "q1c", label: "Heavy, a little tired", emoji: "🌧️", moodWeights: { melancholic: 3, calm: 1 } },
      { id: "q1d", label: "Warm and a little fluttery", emoji: "💗", moodWeights: { romantic: 3, joyful: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: "If you could be anywhere right now…",
    options: [
      { id: "q2a", label: "A rooftop with friends", emoji: "🎉", moodWeights: { joyful: 3, energetic: 1 } },
      { id: "q2b", label: "A quiet café with a notebook", emoji: "☕", moodWeights: { focused: 3, calm: 1 } },
      { id: "q2c", label: "A train going somewhere new", emoji: "🚆", moodWeights: { adventurous: 3, nostalgic: 1 } },
      { id: "q2d", label: "Wrapped in a blanket, lights low", emoji: "🛋️", moodWeights: { calm: 2, melancholic: 2 } },
    ],
  },
  {
    id: "q3",
    prompt: "What sound is your day asking for?",
    options: [
      { id: "q3a", label: "Loud, fast, and unstoppable", emoji: "🔊", moodWeights: { energetic: 3 } },
      { id: "q3b", label: "Soft piano and rain", emoji: "🎹", moodWeights: { melancholic: 2, calm: 2 } },
      { id: "q3c", label: "Something that makes me grin", emoji: "🎺", moodWeights: { joyful: 3 } },
      { id: "q3d", label: "An old song I haven't heard in years", emoji: "📻", moodWeights: { nostalgic: 3, romantic: 1 } },
    ],
  },
  {
    id: "q4",
    prompt: "Pick a vibe for tonight's screen…",
    options: [
      { id: "q4a", label: "A film that makes me cry", emoji: "💧", moodWeights: { melancholic: 2, romantic: 2 } },
      { id: "q4b", label: "Something weird and new", emoji: "🌀", moodWeights: { adventurous: 3 } },
      { id: "q4c", label: "A film I've seen a hundred times", emoji: "🎞️", moodWeights: { nostalgic: 3, calm: 1 } },
      { id: "q4d", label: "Quiet movie, intricate plot", emoji: "🔍", moodWeights: { focused: 3 } },
    ],
  },
  {
    id: "q5",
    prompt: "Honestly, how are you doing?",
    options: [
      { id: "q5a", label: "Genuinely great", emoji: "😊", moodWeights: { joyful: 3, energetic: 1 } },
      { id: "q5b", label: "Okay — just present", emoji: "🌤️", moodWeights: { calm: 2, focused: 2 } },
      { id: "q5c", label: "A little blue, can't pin why", emoji: "🌧️", moodWeights: { melancholic: 3, nostalgic: 1 } },
      { id: "q5d", label: "Restless — need a change", emoji: "🧭", moodWeights: { adventurous: 3, energetic: 1 } },
    ],
  },
];
