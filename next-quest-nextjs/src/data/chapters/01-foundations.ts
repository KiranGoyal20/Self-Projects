import type { Chapter } from "../../types/curriculum";

export const foundationsChapter: Chapter = {
  id: "foundations",
  title: "Foundations",
  tagline: "Why Next.js exists & spinning up your first app",
  emoji: "🧭",
  accent: "from-brand-400 to-neon-violet",
  lessons: [
    {
      id: "what-is-next",
      slug: "what-is-next",
      title: "What is Next.js?",
      emoji: "✨",
      summary:
        "Understand what Next.js adds on top of React and why people reach for it.",
      minutes: 5,
      xp: 50,
      badge: "Explorer",
      content: [
        {
          kind: "p",
          text: "React is a library for building UI. By itself, it does not ship a router, a build system, server rendering, or a way to call a database from your components. You can wire all of that up yourself — or you can use a framework that has already opinionated about how to do it well.",
        },
        {
          kind: "p",
          text: "Next.js is that framework. It's a React meta-framework maintained by Vercel that gives you a production-ready setup out of the box: routing, server rendering, data fetching, image and font optimization, and a deployment story.",
        },
        { kind: "h", text: "What you get on day one" },
        {
          kind: "list",
          items: [
            "File-based routing (the App Router) — every folder under app/ is a route.",
            "Server Components by default — fetch data on the server, ship less JS to the browser.",
            "Built-in CSS, image, font, and script optimizations.",
            "Route Handlers (API routes) and Server Actions for server-side logic.",
            "Production-grade caching and incremental rendering.",
          ],
        },
        {
          kind: "callout",
          tone: "info",
          text: "Mental model: Next.js is the bridge between React (UI) and the network (server, database, browser).",
        },
        { kind: "h", text: "When NOT to use Next.js" },
        {
          kind: "p",
          text: "If you're building a tiny single-page demo or a pure client-side widget, Vite + React might be lighter. Next.js shines once you care about SEO, server data, routing, or production deployment.",
        },
      ],
      exercises: [
        {
          kind: "quiz",
          id: "what-is-next-quiz",
          title: "Quick check",
          questions: [
            {
              id: "q1",
              prompt: "What best describes Next.js?",
              options: [
                "A UI library that replaces React",
                "A React meta-framework with routing, rendering & build tooling",
                "A database for React apps",
                "A CSS framework like Tailwind",
              ],
              correct: 1,
              explanation:
                "Next.js sits on top of React. React is for UI; Next.js adds the surrounding production-grade machinery.",
            },
            {
              id: "q2",
              prompt: "By default, components in the App Router run…",
              options: [
                "Only in the browser",
                "Only at build time",
                "On the server (Server Components)",
                "In a Web Worker",
              ],
              correct: 2,
              explanation:
                "Components in the app/ directory are Server Components by default. You opt into the browser with 'use client'.",
            },
            {
              id: "q3",
              prompt: "Which problem does Next.js NOT directly solve?",
              options: [
                "Server-side rendering",
                "File-based routing",
                "Designing a Figma mockup",
                "Image optimization",
              ],
              correct: 2,
              explanation:
                "Next.js is a framework, not a design tool. Mockups are still your job (or your designer's).",
            },
          ],
        },
      ],
    },
    {
      id: "create-next-app",
      slug: "create-next-app",
      title: "Spinning up your first project",
      emoji: "🚀",
      summary:
        "Use create-next-app to scaffold a brand-new project and learn its structure.",
      minutes: 7,
      xp: 70,
      content: [
        {
          kind: "p",
          text: "The official way to start a Next.js project is the create-next-app CLI. It asks a few questions and writes a working, modern starter for you in seconds.",
        },
        { kind: "h", text: "The command" },
        { kind: "code", lang: "bash", code: "npx create-next-app@latest my-app" },
        {
          kind: "p",
          text: "It will prompt you for TypeScript, ESLint, Tailwind, the src/ directory, the App Router, and whether to set up a turbopack workflow. For learning, choose: TypeScript ✓, Tailwind ✓, App Router ✓.",
        },
        { kind: "h", text: "What you get" },
        {
          kind: "code",
          lang: "bash",
          code: `my-app/
├── app/                  ← your routes (App Router)
│   ├── layout.tsx        ← the root layout (shared shell)
│   ├── page.tsx          ← the / route
│   └── globals.css
├── public/               ← static files served at /
├── next.config.ts        ← framework config
├── package.json
└── tsconfig.json`,
        },
        {
          kind: "callout",
          tone: "tip",
          text: "Run npm run dev to start the dev server on http://localhost:3000. Save a file — it hot-reloads.",
        },
      ],
      exercises: [
        {
          kind: "fill",
          id: "scaffold-fill",
          title: "Fill the command",
          brief:
            "Complete the command that scaffolds a new Next.js project named my-app.",
          template: "npx {{0}}@latest {{1}}",
          blanks: [
            {
              answer: "create-next-app",
              alternates: ["create-next"],
            },
            { answer: "my-app" },
          ],
          hints: [
            "The CLI package is named after what it does: 'create-next-app'.",
            "Pin to the latest with @latest, then put the project name at the end.",
          ],
        },
        {
          kind: "quiz",
          id: "structure-quiz",
          title: "Project structure",
          questions: [
            {
              id: "q1",
              prompt:
                "Which file in app/ defines what users see at the URL '/'?",
              options: [
                "app/index.tsx",
                "app/page.tsx",
                "app/home.tsx",
                "app/layout.tsx",
              ],
              correct: 1,
              explanation:
                "In the App Router, every folder gets a page.tsx (or .jsx) that becomes its route's UI.",
            },
            {
              id: "q2",
              prompt: "What does app/layout.tsx do?",
              options: [
                "Defines a shared shell (html/body/nav) wrapping every page",
                "Configures your Tailwind theme",
                "Replaces page.tsx entirely",
                "Holds your API routes",
              ],
              correct: 0,
              explanation:
                "layout.tsx wraps its segment's pages and any nested layouts.",
            },
          ],
        },
      ],
    },
  ],
};
