import type { Chapter } from "../../types/curriculum";

export const componentsChapter: Chapter = {
  id: "components",
  title: "Server vs Client",
  tagline: "The defining mental model of the App Router",
  emoji: "⚛️",
  accent: "from-neon-green to-brand-400",
  lessons: [
    {
      id: "server-components",
      slug: "server-components",
      title: "Server Components by default",
      emoji: "🛰️",
      summary:
        "Why your components run on the server first — and what that unlocks.",
      minutes: 8,
      xp: 100,
      content: [
        {
          kind: "p",
          text: "Every component you write in app/ is a Server Component unless you opt out. They run on the server (during build or per request), can fetch data directly, and never ship their code to the browser.",
        },
        { kind: "h", text: "What Server Components can do" },
        {
          kind: "list",
          items: [
            "Use async/await directly in the component body.",
            "Read files, hit a database, or call internal APIs without exposing secrets.",
            "Ship zero JavaScript to the client for that subtree.",
          ],
        },
        { kind: "h", text: "What Server Components CANNOT do" },
        {
          kind: "list",
          items: [
            "Use React hooks like useState, useEffect, or event handlers like onClick.",
            "Access browser-only APIs (window, localStorage).",
          ],
        },
        {
          kind: "code",
          lang: "tsx",
          code: `// Server Component — note the async!
export default async function Posts() {
  const posts = await fetch("https://api.example.com/posts").then(r => r.json());
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}`,
        },
        {
          kind: "callout",
          tone: "info",
          text: "If a component needs state, effects, or click handlers, it must become a Client Component (next lesson).",
        },
      ],
      exercises: [
        {
          kind: "quiz",
          id: "rsc-quiz",
          title: "Check your model",
          questions: [
            {
              id: "q1",
              prompt: "What ships to the browser for a pure Server Component?",
              options: [
                "The full component code as JavaScript",
                "Only the rendered HTML / RSC payload — no component code",
                "An empty <div>",
                "A bundle named server.js",
              ],
              correct: 1,
              explanation:
                "Server Components render on the server. The client gets the result, not the source code that produced it.",
            },
            {
              id: "q2",
              prompt:
                "Which of these is ALLOWED inside a Server Component?",
              options: [
                "useState(0)",
                "onClick handlers on a button",
                "await fetch(...)",
                "window.scrollTo(...)",
              ],
              correct: 2,
              explanation:
                "Server Components can be async functions and await anywhere — including fetch and DB calls.",
            },
            {
              id: "q3",
              prompt: "Why is server-by-default a big deal?",
              options: [
                "It removes the need to write CSS",
                "It cuts the JS shipped to users and lets you fetch data right next to the UI that needs it",
                "It auto-generates TypeScript types",
                "It replaces React entirely",
              ],
              correct: 1,
              explanation:
                "Smaller bundles + co-located server data = simpler, faster apps.",
            },
          ],
        },
      ],
    },
    {
      id: "use-client",
      slug: "use-client",
      title: "'use client' & interactivity",
      emoji: "🖱️",
      summary:
        "Opt into the browser with a single directive — and learn when to do it.",
      minutes: 7,
      xp: 90,
      badge: "Boundary Setter",
      content: [
        {
          kind: "p",
          text: "When you need state, effects, refs, or DOM events, mark the file as a Client Component by placing 'use client' at the very top. That file (and its imports that need it) get bundled for the browser.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}`,
        },
        {
          kind: "callout",
          tone: "tip",
          text: "Rule of thumb: push 'use client' as far down the tree as possible. Keep big static layouts on the server.",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "counter-code",
          title: "Build a Counter client component",
          brief:
            "Convert the starter into a working client-side Counter: directive at top, useState, onClick handler. The text should read 'Clicked N times'.",
          filename: "app/components/Counter.tsx",
          language: "tsx",
          starter: `// directive missing
import { useState } from "react";

export default function Counter() {
  // useState missing
  return (
    <button>
      Clicked 0 times
    </button>
  );
}
`,
          checks: [
            {
              kind: "regex",
              pattern: '^\\s*["\']use client["\']',
              flags: "m",
              message:
                "The very first line needs to be 'use client' (with quotes).",
            },
            {
              kind: "regex",
              pattern: "useState\\s*\\(\\s*0\\s*\\)",
              message: "Initialize useState with 0.",
            },
            {
              kind: "regex",
              pattern: "onClick\\s*=\\s*\\{",
              message: "The button needs an onClick handler.",
            },
            {
              kind: "regex",
              pattern: "set\\w+\\s*\\(\\s*(c|\\w+)\\s*=>",
              message:
                "Use the functional updater form: setCount(c => c + 1).",
            },
            {
              kind: "regex",
              pattern: "Clicked\\s*\\{[^}]+\\}\\s*times",
              message:
                'The button text should interpolate the count: "Clicked {count} times".',
            },
          ],
          preview: (code) => {
            const ok =
              /["']use client["']/.test(code) &&
              /useState\s*\(\s*0\s*\)/.test(code) &&
              /onClick/.test(code);
            return {
              tag: "div",
              props: { class: "p-8 space-y-3" },
              children: [
                {
                  tag: "p",
                  props: { class: "text-xs text-ink-400" },
                  children: [
                    ok
                      ? "✓ Boundary detected. Button will be interactive in the real app."
                      : "Add the directive, state, and onClick to make this interactive.",
                  ],
                },
                {
                  tag: "button",
                  props: {
                    class:
                      "px-4 py-2 rounded-lg bg-brand-500 text-white text-sm",
                  },
                  children: ["Clicked 0 times"],
                },
              ],
            };
          },
          solution: `"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}
`,
          hints: [
            "First non-comment line must be the string \"use client\" (with the quotes).",
            "Destructure useState: const [count, setCount] = useState(0).",
            "Curly braces around expressions in JSX: {count}.",
          ],
        },
      ],
    },
  ],
};
