import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { applyRemoteSnapshot } from "@/features/sync/applyRemote";

export type LessonProgress = {
  completed: boolean;
  doneExercises: string[];
  code: Record<string, string>;
  lastVisited?: number;
};

export type ProgressState = {
  xp: number;
  level: number;
  lessons: Record<string, LessonProgress>;
  badges: string[];
  lastActiveDay?: string;
  streak: number;
  bestStreak: number;
  notifications: Notification[];
};

export type Notification = {
  id: string;
  kind: "xp" | "level" | "badge" | "streak";
  message: string;
  amount?: number;
  emoji?: string;
};

const initialState: ProgressState = {
  xp: 0,
  level: 1,
  lessons: {},
  badges: [],
  streak: 0,
  bestStreak: 0,
  notifications: [],
};

export function levelForXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(100 * ((level - 1) * level) / 2);
}

export function xpProgressInLevel(xp: number): {
  level: number;
  inLevel: number;
  toNext: number;
  pct: number;
} {
  const level = levelForXp(xp);
  const base = xpForLevel(level);
  const top = xpForLevel(level + 1);
  const inLevel = xp - base;
  const toNext = top - base;
  return {
    level,
    inLevel,
    toNext,
    pct: toNext === 0 ? 0 : Math.min(1, inLevel / toNext),
  };
}

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86400000);
}

function ensureLesson(state: ProgressState, slug: string): LessonProgress {
  if (!state.lessons[slug]) {
    state.lessons[slug] = { completed: false, doneExercises: [], code: {} };
  }
  return state.lessons[slug];
}

function pushNotification(state: ProgressState, n: Omit<Notification, "id">) {
  state.notifications.push({
    ...n,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  });
}

function bumpStreak(state: ProgressState) {
  const today = dayKey();
  if (state.lastActiveDay === today) return;
  if (state.lastActiveDay) {
    const gap = daysBetween(state.lastActiveDay, today);
    if (gap === 1) state.streak += 1;
    else if (gap > 1) state.streak = 1;
  } else {
    state.streak = 1;
  }
  state.lastActiveDay = today;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  if (state.streak >= 2) {
    pushNotification(state, {
      kind: "streak",
      message: `${state.streak}-day streak!`,
      emoji: "🔥",
    });
  }
}

const slice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    visit(state, action: PayloadAction<{ slug: string }>) {
      const l = ensureLesson(state, action.payload.slug);
      l.lastVisited = Date.now();
      bumpStreak(state);
    },
    saveCode(
      state,
      action: PayloadAction<{ slug: string; exerciseId: string; code: string }>
    ) {
      const l = ensureLesson(state, action.payload.slug);
      l.code[action.payload.exerciseId] = action.payload.code;
    },
    completeExercise(
      state,
      action: PayloadAction<{
        slug: string;
        exerciseId: string;
        totalExercises: number;
        xpReward: number;
        badgeId?: string;
      }>
    ) {
      const { slug, exerciseId, totalExercises, xpReward, badgeId } =
        action.payload;
      const l = ensureLesson(state, slug);
      if (l.doneExercises.includes(exerciseId)) return;
      l.doneExercises.push(exerciseId);

      const partialXp = Math.round(xpReward / totalExercises);
      state.xp += partialXp;
      pushNotification(state, {
        kind: "xp",
        message: `+${partialXp} XP`,
        amount: partialXp,
        emoji: "✨",
      });

      const newLevel = levelForXp(state.xp);
      if (newLevel > state.level) {
        state.level = newLevel;
        pushNotification(state, {
          kind: "level",
          message: `Level up! Level ${newLevel}`,
          emoji: "🎉",
        });
      }

      if (l.doneExercises.length >= totalExercises && !l.completed) {
        l.completed = true;
        if (badgeId && !state.badges.includes(badgeId)) {
          state.badges.push(badgeId);
          pushNotification(state, {
            kind: "badge",
            message: `Badge unlocked: ${badgeId}`,
            emoji: "🏆",
          });
        }
      }

      bumpStreak(state);
    },
    dismissNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    resetProgress(state) {
      state.xp = 0;
      state.level = 1;
      state.lessons = {};
      state.badges = [];
      state.streak = 0;
      state.bestStreak = 0;
      state.notifications = [];
      state.lastActiveDay = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyRemoteSnapshot, (state, action) => {
      const incoming = action.payload.progress;
      if (!incoming) return;
      state.xp = incoming.xp ?? state.xp;
      state.level = incoming.level ?? state.level;
      state.lessons = incoming.lessons ?? state.lessons;
      state.badges = incoming.badges ?? state.badges;
      state.lastActiveDay = incoming.lastActiveDay;
      state.streak = incoming.streak ?? state.streak;
      state.bestStreak = incoming.bestStreak ?? state.bestStreak;
      state.notifications = [];
    });
  },
});

export const {
  visit,
  saveCode,
  completeExercise,
  dismissNotification,
  clearNotifications,
  resetProgress,
} = slice.actions;
export default slice.reducer;
