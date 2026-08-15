# Next.Quest

An interactive, gamified **Next.js learning playground**. Step-by-step lessons, in-browser coding exercises with instant checks, a roadmap of chapters, XP/levels/badges/streaks, and a built-in AI tutor (NextSage).

Built with the same stack as `mood-companion`: Vite 5 + React 19 + TypeScript + Redux Toolkit + redux-persist + Tailwind CSS 3 + Framer Motion + React Router v7. Adds CodeMirror 6 for the in-browser editor.

## Why this exists

Reading docs and watching tutorials is boring. Next.Quest turns Next.js into a quest:

- **Bite-sized lessons** (5–10 minutes each), structured into chapters.
- **Interactive code exercises** with a real CodeMirror editor and instant validation against a checklist of expectations. Get useful, specific feedback ("Use `'use client'` at the very first line") — not just red/green.
- **A simulated browser preview** that updates as you type so you can see roughly what your component would render.
- **Gamification**: XP per exercise, level curve, daily streak, and unlockable badges at key milestones.
- **NextSage**, an AI tutor on every page. Works fully offline using a curated knowledge base; bring an OpenAI API key in Settings for full LLM smarts. The tutor automatically gets the current lesson and your code as context.
- **Local-first persistence** via `redux-persist` — no signup, no server, everything survives reload.

## Curriculum

Six chapters → 14 lessons → ~25 exercises (code, quiz, fill-in).

| #   | Chapter            | Focus                                                                |
| --- | ------------------ | -------------------------------------------------------------------- |
| 1   | Foundations        | What Next.js is, `create-next-app`, project structure                |
| 2   | Routing & Pages    | `page.tsx`, nested routes, `[slug]` dynamic segments, `next/link`    |
| 3   | Server vs Client   | Server Components by default, `'use client'`, when to opt in         |
| 4   | Data, Layouts & UI | Server `fetch` with caching, `layout.tsx`, `loading.tsx`, `error.tsx`|
| 5   | Server Powers      | Route Handlers, Server Actions (`'use server'`), Metadata API        |
| 6   | Ship It            | `next/image`, `next/font`, `next/script`, deployment & env vars      |

Each lesson ends with badge-earning exercises that the validator marks off so the next lesson can unlock.

## Tech stack

| Concern          | Choice                                                        |
| ---------------- | ------------------------------------------------------------- |
| Build & dev      | Vite 5                                                        |
| UI               | React 19 + TypeScript (strict)                                |
| State            | Redux Toolkit + typed hooks                                   |
| Persistence      | `redux-persist` + `localStorage`                              |
| Routing          | `react-router-dom` v7                                         |
| Styling          | Tailwind CSS 3 with custom design tokens & mesh gradients     |
| Animation        | Framer Motion (page transitions, notifications, list reveals) |
| Code editor      | CodeMirror 6 (`@uiw/react-codemirror`) with One Dark theme    |
| AI tutor         | OpenAI-compatible chat completions (BYO key) + offline KB     |

## Architecture

```
src/
├── app/                  # Store, typed hooks
├── components/           # Layout, CodeEditor, SimulatedBrowser, exercises/, etc.
│   └── exercises/        # CodeExercise, QuizExercise, FillExercise
├── data/                 # Curriculum data
│   ├── chapters/         # One file per chapter — content + exercises
│   └── curriculum.ts     # Flatten + lookup helpers
├── features/             # Redux slices (feature-folder style)
│   ├── chat/             # NextSage message history
│   ├── progress/         # XP, level, lessons, badges, streak
│   └── settings/         # Display name, API key, model, prefs
├── pages/                # Home / Roadmap / Lesson / Badges / Chat / Settings
├── types/                # Domain types (CurriculumBlock, Exercise, etc.)
├── utils/
│   ├── aiTutor.ts        # OpenAI client + offline KB
│   ├── previewRender.tsx # Safe virtual-DOM preview renderer
│   └── validate.ts       # Exercise check runner
├── App.tsx
├── main.tsx
└── index.css
```

### Design decisions worth calling out

- **Curriculum as plain TypeScript data.** Lessons are typed records; checks are regex/include rules. The validator is a small pure function. Adding a lesson is "write a TS object" — no MDX pipeline, no CMS.
- **Simulated preview, not eval.** We never `eval` user code (security + correctness). Instead each code exercise can ship a tiny pure function that *imagines* what the user's component would render, based on what they wrote. Good enough to teach JSX intuition; safe by construction.
- **Lesson gating is forgiving.** You can show the solution at any time — the next lesson still unlocks on completion. XP is awarded per-exercise so partial progress sticks.
- **AI tutor degrades gracefully.** With an OpenAI key it's a real model. Without one, a curated topic-matched knowledge base covers the framework's core concepts. Either way, the active lesson is automatically attached as context.

## Run it

Requires Node 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the build locally
```

## Possible extensions

- More chapters: middleware, parallel/intercepted routes, Suspense streaming, testing
- Replace the simulated preview with a real Web Container (StackBlitz SDK) for fully runnable lessons
- Add a "playground" route with a freeform editor + Monaco
- Sync progress to a server (Supabase or Vercel KV) for cross-device continuity
- Multiplayer leaderboards & co-op duels
