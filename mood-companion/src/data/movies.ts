import type { Movie } from "../types/domain";

export const MOVIES: Movie[] = [
  // Joyful
  { id: "m1", title: "Paddington 2", year: 2017, genres: ["Comedy", "Family"], runtimeMin: 103, rating: 8.2, blurb: "A jam-loving bear, kindness as superpower, and a Hugh Grant performance for the ages.", poster: "#fbbf24", moods: ["joyful", "calm"] },
  { id: "m2", title: "Sing Street", year: 2016, genres: ["Music", "Drama"], runtimeMin: 106, rating: 7.9, blurb: "Dublin teens start a band to impress a girl. Hooks, heart, and 80s synths.", poster: "#f59e0b", moods: ["joyful", "nostalgic", "romantic"] },
  { id: "m3", title: "Little Miss Sunshine", year: 2006, genres: ["Comedy", "Drama"], runtimeMin: 101, rating: 7.8, blurb: "Family road trip in a yellow van. Sweet, weird, and quietly defiant.", poster: "#fcd34d", moods: ["joyful", "adventurous"] },

  // Calm
  { id: "m4", title: "Perfect Days", year: 2023, genres: ["Drama"], runtimeMin: 124, rating: 7.9, blurb: "A Tokyo toilet cleaner finds beauty in routine. Quiet, observant, deeply restorative.", poster: "#34d399", moods: ["calm", "focused"] },
  { id: "m5", title: "My Neighbor Totoro", year: 1988, genres: ["Animation", "Family"], runtimeMin: 86, rating: 8.2, blurb: "Two sisters meet forest spirits in postwar Japan. A warm bath of a movie.", poster: "#10b981", moods: ["calm", "joyful", "nostalgic"] },
  { id: "m6", title: "Paterson", year: 2016, genres: ["Drama"], runtimeMin: 118, rating: 7.3, blurb: "A bus driver writes poems about his quiet, beautiful week. Gentle and grounding.", poster: "#22c55e", moods: ["calm", "focused"] },

  // Melancholic
  { id: "m7", title: "Past Lives", year: 2023, genres: ["Drama", "Romance"], runtimeMin: 105, rating: 8.0, blurb: "Childhood friends meet again, 24 years later. Aching, tender, devastating.", poster: "#818cf8", moods: ["melancholic", "romantic"] },
  { id: "m8", title: "Manchester by the Sea", year: 2016, genres: ["Drama"], runtimeMin: 137, rating: 7.8, blurb: "Grief, family, and the New England coast. A film that lets sadness be sad.", poster: "#6366f1", moods: ["melancholic"] },
  { id: "m9", title: "Lost in Translation", year: 2003, genres: ["Drama", "Romance"], runtimeMin: 102, rating: 7.7, blurb: "Two lonely strangers find each other in a Tokyo hotel. Quiet, foggy, unforgettable.", poster: "#4f46e5", moods: ["melancholic", "nostalgic", "romantic"] },

  // Energetic
  { id: "m10", title: "Mad Max: Fury Road", year: 2015, genres: ["Action", "Adventure"], runtimeMin: 120, rating: 8.1, blurb: "Two hours of bolted-down chaos. A two-lane miracle of practical filmmaking.", poster: "#ef4444", moods: ["energetic", "adventurous"] },
  { id: "m11", title: "Baby Driver", year: 2017, genres: ["Action", "Crime"], runtimeMin: 113, rating: 7.6, blurb: "A getaway driver moves to a soundtrack only he can hear. Pure kinetic joy.", poster: "#f97316", moods: ["energetic", "joyful"] },
  { id: "m12", title: "Whiplash", year: 2014, genres: ["Drama", "Music"], runtimeMin: 106, rating: 8.5, blurb: "A drummer and a tyrant teacher. Music as combat. You'll feel your pulse.", poster: "#dc2626", moods: ["energetic", "focused"] },

  // Romantic
  { id: "m13", title: "Before Sunrise", year: 1995, genres: ["Drama", "Romance"], runtimeMin: 105, rating: 8.1, blurb: "Two strangers, one night in Vienna, conversation as alchemy.", poster: "#fb7185", moods: ["romantic", "nostalgic"] },
  { id: "m14", title: "Call Me by Your Name", year: 2017, genres: ["Drama", "Romance"], runtimeMin: 132, rating: 7.8, blurb: "A summer in Italy that becomes a memory you'll keep forever.", poster: "#f472b6", moods: ["romantic", "melancholic"] },
  { id: "m15", title: "Amélie", year: 2001, genres: ["Comedy", "Romance"], runtimeMin: 122, rating: 8.3, blurb: "A whimsical Parisian invents small kindnesses. Cinema as a sigh of delight.", poster: "#ec4899", moods: ["romantic", "joyful"] },

  // Focused
  { id: "m16", title: "Arrival", year: 2016, genres: ["Sci-Fi", "Drama"], runtimeMin: 116, rating: 7.9, blurb: "A linguist meets aliens. About time, language, and being known.", poster: "#38bdf8", moods: ["focused", "melancholic", "adventurous"] },
  { id: "m17", title: "The Social Network", year: 2010, genres: ["Drama"], runtimeMin: 120, rating: 7.8, blurb: "Sorkin's electric script meets Fincher's surgical eye. Talk as choreography.", poster: "#0ea5e9", moods: ["focused", "energetic"] },
  { id: "m18", title: "Drive My Car", year: 2021, genres: ["Drama"], runtimeMin: 179, rating: 7.6, blurb: "Grief, Chekhov, and a red Saab. Slow cinema you sink into completely.", poster: "#3b82f6", moods: ["focused", "melancholic"] },

  // Nostalgic
  { id: "m19", title: "Stand by Me", year: 1986, genres: ["Drama", "Adventure"], runtimeMin: 89, rating: 8.1, blurb: "Four boys walk down train tracks toward the end of childhood.", poster: "#fbbf24", moods: ["nostalgic", "adventurous"] },
  { id: "m20", title: "The Florida Project", year: 2017, genres: ["Drama"], runtimeMin: 111, rating: 7.6, blurb: "Summer through a six-year-old's eyes, just outside Disney's gates.", poster: "#f59e0b", moods: ["nostalgic", "melancholic"] },
  { id: "m21", title: "Stand By Me, Doraemon", year: 2014, genres: ["Animation", "Family"], runtimeMin: 95, rating: 7.5, blurb: "A robot cat from the future and the boy he loves. Pure feeling.", poster: "#fb923c", moods: ["nostalgic", "joyful"] },

  // Adventurous
  { id: "m22", title: "Spider-Man: Into the Spider-Verse", year: 2018, genres: ["Animation", "Action"], runtimeMin: 117, rating: 8.4, blurb: "Comics as kinetic art. Every frame is a poster you want on your wall.", poster: "#a78bfa", moods: ["adventurous", "energetic", "joyful"] },
  { id: "m23", title: "Everything Everywhere All at Once", year: 2022, genres: ["Sci-Fi", "Comedy"], runtimeMin: 139, rating: 7.9, blurb: "A multiverse, a laundromat, and a mother. Maximalist, tender, original.", poster: "#10b981", moods: ["adventurous", "energetic", "melancholic"] },
  { id: "m24", title: "The Grand Budapest Hotel", year: 2014, genres: ["Comedy", "Adventure"], runtimeMin: 99, rating: 8.1, blurb: "A concierge, a lobby boy, and a pastry chase. Pure Wes Anderson confection.", poster: "#fb7185", moods: ["adventurous", "nostalgic", "joyful"] },
];
