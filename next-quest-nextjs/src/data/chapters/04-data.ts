import type { Chapter } from "../../types/curriculum";

export const dataChapter: Chapter = {
  id: "data",
  title: "Data, Layouts & Loading",
  tagline: "Fetch on the server, share UI with layouts, suspend with grace",
  emoji: "📡",
  accent: "from-neon-amber to-neon-pink",
  lessons: [
    {
      id: "fetch-on-server",
      slug: "fetch-on-server",
      title: "Fetching on the server",
      emoji: "📥",
      summary:
        "Make HTTP calls right in your page component — and let Next cache the result.",
      minutes: 9,
      xp: 110,
      content: [
        {
          kind: "p",
          text: "Inside a Server Component you can simply await fetch(). Next.js extends the native fetch with caching and revalidation options, so you don't need React Query just to grab JSON.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `export default async function Posts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    next: { revalidate: 60 }, // re-fetch at most every 60s
  });
  const posts: { id: number; title: string }[] = await res.json();

  return (
    <ul>
      {posts.slice(0, 5).map(p => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}`,
        },
        { kind: "h", text: "Cache options at a glance" },
        {
          kind: "list",
          items: [
            "Default: cached forever (until you redeploy).",
            "next: { revalidate: 60 } → ISR, refresh every 60s.",
            "cache: 'no-store' → always fresh, never cached.",
          ],
        },
        {
          kind: "callout",
          tone: "info",
          text: "Server fetches happen on the server — your API key stays secret as long as you never import it into a Client Component.",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "fetch-code",
          title: "Fetch the planets",
          brief:
            "Write an async page that fetches https://api.example.com/planets, sets revalidate to 30 seconds, and renders each planet's name in an <li>.",
          filename: "app/planets/page.tsx",
          language: "tsx",
          starter: `// make this async and call fetch with a revalidate option
export default function Planets() {
  return <ul>{/* render planet names here */}</ul>;
}
`,
          checks: [
            {
              kind: "regex",
              pattern: "export\\s+default\\s+async\\s+function",
              message:
                "The page component needs to be async — fetching on the server uses await.",
            },
            {
              kind: "regex",
              pattern: 'fetch\\(\\s*["\']https://api\\.example\\.com/planets["\']',
              message: "Call fetch with the planets URL.",
            },
            {
              kind: "regex",
              pattern: "revalidate\\s*:\\s*30",
              message: "Pass { next: { revalidate: 30 } } to fetch.",
            },
            {
              kind: "regex",
              pattern: "\\.map\\(",
              message: "Use .map() to render each planet inside an <li>.",
            },
            {
              kind: "regex",
              pattern: "<li[^>]*>",
              message: "Each planet should render inside an <li>.",
            },
          ],
          preview: (code) => {
            const hasFetch = /fetch\(/.test(code);
            const items = [
              "Mercury",
              "Venus",
              "Earth",
              "Mars",
              "Jupiter",
            ];
            return {
              tag: "div",
              props: { class: "p-8" },
              children: [
                {
                  tag: "h2",
                  props: {
                    class:
                      "text-lg font-semibold mb-3 text-ink-100",
                  },
                  children: [
                    hasFetch
                      ? "Planets (simulated response)"
                      : "Add a fetch() to see the planets",
                  ],
                },
                {
                  tag: "ul",
                  props: {
                    class:
                      "list-disc list-inside text-ink-200 space-y-1",
                  },
                  children: hasFetch
                    ? items.map((p) => ({
                        tag: "li",
                        children: [p],
                      }))
                    : [],
                },
              ],
            };
          },
          solution: `export default async function Planets() {
  const res = await fetch("https://api.example.com/planets", {
    next: { revalidate: 30 },
  });
  const planets: { name: string }[] = await res.json();

  return (
    <ul>
      {planets.map(p => <li key={p.name}>{p.name}</li>)}
    </ul>
  );
}
`,
          hints: [
            "Mark the function async so you can await fetch.",
            "Cache option shape: fetch(url, { next: { revalidate: 30 } })",
          ],
        },
      ],
    },
    {
      id: "layouts",
      slug: "layouts",
      title: "Layouts that share UI",
      emoji: "🧱",
      summary:
        "One layout.tsx wraps a whole segment without rerendering on navigation.",
      minutes: 7,
      xp: 90,
      content: [
        {
          kind: "p",
          text: "A layout.tsx wraps every page within its folder (and any nested folders). State inside a layout survives navigation between sibling pages — perfect for nav, sidebars, and shells.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-[200px_1fr]">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </section>
  );
}`,
        },
        {
          kind: "callout",
          tone: "tip",
          text: "Layouts MUST render the children prop somewhere — otherwise nested pages disappear.",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "layout-code",
          title: "Author a DashboardLayout",
          brief:
            "Default-export a function DashboardLayout that takes { children } and renders an <aside> and a <main> containing children.",
          filename: "app/dashboard/layout.tsx",
          language: "tsx",
          starter: `export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // return JSX with an aside and a main containing children
}
`,
          checks: [
            {
              kind: "regex",
              pattern: "export\\s+default\\s+function\\s+DashboardLayout",
              message: "Default-export a function named DashboardLayout.",
            },
            {
              kind: "regex",
              pattern: "\\{\\s*children\\s*\\}",
              message: "Destructure { children } in the props.",
            },
            {
              kind: "regex",
              pattern: "<aside[^>]*>",
              message: "Render an <aside> for the sidebar.",
            },
            {
              kind: "regex",
              pattern: "<main[^>]*>[\\s\\S]*\\{children\\}",
              message: "Render {children} inside a <main>.",
            },
          ],
          preview: (code) => {
            const ok = /\{children\}/.test(code);
            return {
              tag: "div",
              props: {
                class: "grid grid-cols-[120px_1fr] gap-4 p-6",
              },
              children: [
                {
                  tag: "aside",
                  props: {
                    class:
                      "p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-ink-300",
                  },
                  children: ["Sidebar"],
                },
                {
                  tag: "main",
                  props: {
                    class:
                      "p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-ink-100",
                  },
                  children: [
                    ok
                      ? "→ {children} renders here"
                      : "(children not rendered yet)",
                  ],
                },
              ],
            };
          },
          solution: `export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-[200px_1fr]">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </section>
  );
}
`,
          hints: [
            "Destructure children from props: { children }.",
            "Wrap everything in any tag you want; just make sure {children} appears in your JSX.",
          ],
        },
      ],
    },
    {
      id: "loading-error",
      slug: "loading-error",
      title: "Loading & error UI",
      emoji: "⏳",
      summary:
        "Two magic filenames give your route streaming skeletons and friendly errors.",
      minutes: 6,
      xp: 80,
      content: [
        {
          kind: "p",
          text: "Drop a loading.tsx next to your page and Next.js will show it while the server is still computing the page. Drop an error.tsx and it becomes the React error boundary for that route segment.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `// app/blog/loading.tsx
export default function Loading() {
  return <p>Loading posts…</p>;
}

// app/blog/error.tsx — must be a Client Component
"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`,
        },
        {
          kind: "callout",
          tone: "warn",
          text: "error.tsx must be a Client Component (\"use client\" at top) because it needs the reset() handler.",
        },
      ],
      exercises: [
        {
          kind: "quiz",
          id: "loading-quiz",
          title: "Quiz: route conventions",
          questions: [
            {
              id: "q1",
              prompt:
                "Which file shows UI while a Server Component is still streaming?",
              options: ["page.tsx", "loading.tsx", "not-found.tsx", "spinner.tsx"],
              correct: 1,
              explanation:
                "loading.tsx becomes a Suspense fallback for its segment.",
            },
            {
              id: "q2",
              prompt: "What MUST be true of error.tsx?",
              options: [
                "It must be in app/api/",
                "It must be a Client Component",
                "It must return JSON",
                "It must export a named 'ErrorPage'",
              ],
              correct: 1,
              explanation:
                "error.tsx needs the 'use client' directive because it uses reset() (a function prop).",
            },
          ],
        },
      ],
    },
  ],
};
