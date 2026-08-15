# Mood Companion

A music & movie recommendation app that adapts to **how you feel right now**. Built as a portfolio-grade React + Redux Toolkit + TypeScript project to showcase architecture, state design, and UX craft.

## What it does

- **Three ways to find your mood**
  - **Quiz** — 5 short questions, weighted scoring per mood
  - **Journal** — write a few sentences; a keyword-based sentiment engine reads the tone
  - **Picker** — already know how you feel? Tap a mood
- **Curated recommendations** — music & movies tuned to 8 distinct moods (joyful, calm, melancholic, energetic, romantic, focused, nostalgic, adventurous)
- **Mood history** — auto-logged entries, 14-day pleasantness/energy trend chart, mood distribution, daily streak
- **Save what resonates** — saved tracks/movies attach to the mood entry they came from
- **Persistent state** — everything survives reload via `redux-persist` + `localStorage`

## Tech stack

| Concern              | Choice                                                                |
| -------------------- | --------------------------------------------------------------------- |
| Build & dev          | Vite 5                                                                |
| UI                   | React 19 + TypeScript (strict)                                        |
| State management     | Redux Toolkit + typed hooks + `createSelector` memoised selectors     |
| Persistence          | `redux-persist` (blacklists transient mood-session slice)             |
| Routing              | `react-router-dom` v7                                                 |
| Styling              | Tailwind CSS 3 with custom design tokens                              |
| Animation            | Framer Motion (page transitions, list reveals, hover states)          |
| Data viz             | Recharts (area chart, custom dark theme)                              |

## Architecture

```
src/
├── app/                # Store, typed hooks, memoised selectors
│   ├── hooks.ts
│   ├── selectors.ts
│   └── store.ts
├── components/         # Reusable UI primitives
│   ├── EmptyState.tsx
│   ├── Layout.tsx
│   ├── MoodBadge.tsx
│   ├── MoodTrendChart.tsx
│   ├── MovieCard.tsx
│   └── MusicCard.tsx
├── data/               # Static catalogs (moods, tracks, movies, quiz)
├── features/           # Redux slices, feature-folder style
│   ├── history/        # Mood entries timeline & saved items
│   ├── mood/           # Current mood session
│   └── preferences/    # UI prefs (tab, onboarded)
├── pages/              # Route screens
├── types/              # Domain types (single source of truth)
├── utils/              # Pure functions (sentiment, quiz scoring, recommend)
├── App.tsx
├── main.tsx
└── index.css
```

### Why this layout

- **Feature folders** isolate state, types, and UI concerns per domain.
- **Domain types live in `types/`** so multiple slices can share them without circular imports.
- **Pure utils** (`recommend`, `sentiment`, `quiz` scoring) are framework-agnostic and trivially testable.
- **Selectors** centralize derived state (streak, top mood, distribution) instead of recomputing inside components.
- **`redux-persist` blacklist** keeps long-lived data (history, preferences) persistent while letting the in-progress mood session reset on reload.

## Run it

Requires Node 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the build locally
```

## Design decisions worth calling out

- **Sentiment engine is intentionally small** — a keyword/weight map rather than a heavyweight NLP dependency. The trade-off (explainable behavior, zero network cost) maps well to the use case.
- **Saves are tied to a `MoodEntry`** instead of a flat list. This preserves *why* you saved something, which fuels future "looking back" features.
- **Detection sources are first-class** — the schema records whether a mood came from quiz, journal, or manual pick, with a `confidence` value the UI surfaces honestly.
- **Mesh gradients + glassmorphism** keep the visual identity expressive without leaning on heavy imagery.

## Possible extensions

- Real Spotify / TMDB API integration with OAuth
- Mood-blend mode (combine two moods)
- Weekly summary email (server-side companion)
- Export history as JSON / CSV
- PWA install + offline support
