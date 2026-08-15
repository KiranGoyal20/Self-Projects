import type { Track } from "../types/domain";

export const TRACKS: Track[] = [
  // Joyful
  { id: "t1", title: "Sunflower Boulevard", artist: "Lila Sun", album: "Bright Side", durationSec: 198, cover: "#fbbf24", moods: ["joyful", "energetic"], tags: ["pop", "indie"] },
  { id: "t2", title: "Citrus Skies", artist: "The Postcards", album: "Polaroid", durationSec: 212, cover: "#f97316", moods: ["joyful", "nostalgic"], tags: ["indie-pop"] },
  { id: "t3", title: "Better Days", artist: "Marigold", album: "Open Window", durationSec: 224, cover: "#fde68a", moods: ["joyful", "calm"], tags: ["folk-pop"] },

  // Calm
  { id: "t4", title: "Slow River", artist: "Aisha Noor", album: "Stillwater", durationSec: 312, cover: "#34d399", moods: ["calm", "focused"], tags: ["ambient", "piano"] },
  { id: "t5", title: "Cedar & Smoke", artist: "Hollowfern", album: "Quiet Years", durationSec: 268, cover: "#10b981", moods: ["calm", "nostalgic"], tags: ["folk", "acoustic"] },
  { id: "t6", title: "Greenhouse", artist: "Moss Telegram", album: "Indoor Weather", durationSec: 245, cover: "#22d3ee", moods: ["calm", "romantic"], tags: ["dream-pop"] },

  // Melancholic
  { id: "t7", title: "Letter Unsent", artist: "Naomi Vale", album: "Paper Hearts", durationSec: 256, cover: "#818cf8", moods: ["melancholic", "romantic"], tags: ["ballad"] },
  { id: "t8", title: "Empty Rooms", artist: "Cordelia Wren", album: "Echoes", durationSec: 289, cover: "#6366f1", moods: ["melancholic"], tags: ["alt", "indie"] },
  { id: "t9", title: "Slow Rain", artist: "Ezra Bloom", album: "Greys", durationSec: 234, cover: "#4f46e5", moods: ["melancholic", "calm"], tags: ["singer-songwriter"] },

  // Energetic
  { id: "t10", title: "Neon Horses", artist: "Voltkid", album: "Highway", durationSec: 198, cover: "#f97316", moods: ["energetic", "adventurous"], tags: ["electro", "synthwave"] },
  { id: "t11", title: "Burn It Bright", artist: "Sirens & Saints", album: "Crackle", durationSec: 215, cover: "#ef4444", moods: ["energetic"], tags: ["rock", "anthem"] },
  { id: "t12", title: "Pulse", artist: "Mira Halo", album: "Frequencies", durationSec: 206, cover: "#ec4899", moods: ["energetic", "focused"], tags: ["dance"] },

  // Romantic
  { id: "t13", title: "Kitchen Light", artist: "Henry Pike", album: "Slow Dance", durationSec: 248, cover: "#fb7185", moods: ["romantic", "calm"], tags: ["soul", "RnB"] },
  { id: "t14", title: "Across the Table", artist: "Saffron Lane", album: "Two Glasses", durationSec: 198, cover: "#f472b6", moods: ["romantic", "nostalgic"], tags: ["jazz"] },
  { id: "t15", title: "Saltwater Heart", artist: "The Tides", album: "Harbour", durationSec: 264, cover: "#fbcfe8", moods: ["romantic"], tags: ["indie-folk"] },

  // Focused
  { id: "t16", title: "North Window", artist: "Eli Park", album: "Studyroom", durationSec: 358, cover: "#38bdf8", moods: ["focused", "calm"], tags: ["lo-fi", "piano"] },
  { id: "t17", title: "Blueprint", artist: "Quiet Engine", album: "Schematics", durationSec: 312, cover: "#0ea5e9", moods: ["focused"], tags: ["instrumental"] },
  { id: "t18", title: "Drift, Steadily", artist: "Atlas Loom", album: "Charts", durationSec: 402, cover: "#6366f1", moods: ["focused", "adventurous"], tags: ["post-rock"] },

  // Nostalgic
  { id: "t19", title: "Polaroid Summer", artist: "The Vintage Set", album: "1998", durationSec: 224, cover: "#fbbf24", moods: ["nostalgic", "joyful"], tags: ["retro"] },
  { id: "t20", title: "Old Highway", artist: "June Atlas", album: "Cassette", durationSec: 287, cover: "#f59e0b", moods: ["nostalgic", "romantic"], tags: ["americana"] },
  { id: "t21", title: "Bedroom Tapes", artist: "Soft Static", album: "Hometown", durationSec: 198, cover: "#fb923c", moods: ["nostalgic", "melancholic"], tags: ["bedroom-pop"] },

  // Adventurous
  { id: "t22", title: "Map of Currents", artist: "Pelagic", album: "Compass", durationSec: 296, cover: "#10b981", moods: ["adventurous", "focused"], tags: ["world", "instrumental"] },
  { id: "t23", title: "Sky Markets", artist: "Kestrel & Co.", album: "Trade Winds", durationSec: 245, cover: "#22d3ee", moods: ["adventurous", "energetic"], tags: ["fusion"] },
  { id: "t24", title: "Edge of the Continent", artist: "North Reef", album: "Latitudes", durationSec: 312, cover: "#a78bfa", moods: ["adventurous", "calm"], tags: ["soundtrack"] },
];
