import type { Mood, MoodId } from "../types/domain";

export const MOODS: Record<MoodId, Mood> = {
  joyful: {
    id: "joyful",
    label: "Joyful",
    emoji: "😊",
    tagline: "Bright, light, and ready to smile",
    gradient: "from-amber-400 via-pink-400 to-rose-400",
    accent: "#fbbf24",
    energy: 75,
    valence: 90,
    description:
      "A buoyant, optimistic state. Music with bright melodies and films that leave you grinning.",
  },
  calm: {
    id: "calm",
    label: "Calm",
    emoji: "🌿",
    tagline: "Settled, soft, and centered",
    gradient: "from-teal-400 via-emerald-400 to-cyan-400",
    accent: "#34d399",
    energy: 30,
    valence: 70,
    description:
      "A peaceful, grounded feeling. Gentle ambient sounds and slow-burn cinema you can sink into.",
  },
  melancholic: {
    id: "melancholic",
    label: "Melancholic",
    emoji: "🌧️",
    tagline: "Tender, reflective, a little blue",
    gradient: "from-slate-400 via-indigo-400 to-blue-500",
    accent: "#818cf8",
    energy: 25,
    valence: 25,
    description:
      "Wistful and reflective. Aching ballads and emotionally rich dramas that meet you where you are.",
  },
  energetic: {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    tagline: "Charged up and ready to move",
    gradient: "from-orange-400 via-red-400 to-pink-500",
    accent: "#f97316",
    energy: 95,
    valence: 80,
    description:
      "Buzzing with momentum. Driving beats and high-octane films to match your tempo.",
  },
  romantic: {
    id: "romantic",
    label: "Romantic",
    emoji: "💗",
    tagline: "Soft hearts and slow dances",
    gradient: "from-rose-400 via-pink-400 to-fuchsia-400",
    accent: "#fb7185",
    energy: 50,
    valence: 85,
    description:
      "Tender and warm. Sweeping love songs and stories that make you believe in something.",
  },
  focused: {
    id: "focused",
    label: "Focused",
    emoji: "🎯",
    tagline: "In the zone, eyes on the prize",
    gradient: "from-sky-400 via-blue-500 to-indigo-500",
    accent: "#38bdf8",
    energy: 55,
    valence: 60,
    description:
      "Calm intensity. Instrumental flow-state music and cerebral, slow-paced films.",
  },
  nostalgic: {
    id: "nostalgic",
    label: "Nostalgic",
    emoji: "📼",
    tagline: "Looking back with a half-smile",
    gradient: "from-amber-300 via-orange-400 to-rose-400",
    accent: "#fbbf24",
    energy: 40,
    valence: 60,
    description:
      "Bittersweet warmth. Throwbacks that take you somewhere familiar and films that feel like memory.",
  },
  adventurous: {
    id: "adventurous",
    label: "Adventurous",
    emoji: "🧭",
    tagline: "Hungry for something new",
    gradient: "from-emerald-400 via-cyan-400 to-violet-500",
    accent: "#10b981",
    energy: 80,
    valence: 80,
    description:
      "Open and curious. Genre-bending music and bold films that take you somewhere unexpected.",
  },
};

export const MOOD_LIST: Mood[] = Object.values(MOODS);
