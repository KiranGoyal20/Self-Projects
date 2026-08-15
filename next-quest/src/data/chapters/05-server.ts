import type { Chapter } from "../../types/curriculum";

export const serverChapter: Chapter = {
  id: "server",
  title: "Server Powers",
  tagline: "Route Handlers, Server Actions, and metadata",
  emoji: "🛠️",
  accent: "from-brand-500 to-neon-green",
  lessons: [
    {
      id: "route-handlers",
      slug: "route-handlers",
      title: "Route Handlers (API routes)",
      emoji: "🛣️",
      summary:
        "Build JSON endpoints by exporting HTTP-method functions from route.ts.",
      minutes: 9,
      xp: 110,
      content: [
        {
          kind: "p",
          text: "When you need a JSON endpoint — say /api/hello — you create a route.ts file and export functions named after HTTP methods. They receive a Request and return a Response.",
        },
        {
          kind: "code",
          lang: "ts",
          code: `// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello, quester!" });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ received: body });
}`,
        },
        {
          kind: "callout",
          tone: "info",
          text: "A folder can have EITHER a page.tsx OR a route.ts — not both. They serve different shapes (HTML vs raw responses).",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "route-handler-code",
          title: "Build /api/ping",
          brief:
            "Export a GET function that responds with JSON { pong: true } using NextResponse.json.",
          filename: "app/api/ping/route.ts",
          language: "ts",
          starter: `import { NextResponse } from "next/server";

// export a GET that returns { pong: true }
`,
          checks: [
            {
              kind: "regex",
              pattern: 'import\\s+\\{\\s*NextResponse\\s*\\}\\s+from\\s+["\']next/server["\']',
              message: "Import NextResponse from 'next/server'.",
            },
            {
              kind: "regex",
              pattern: "export\\s+(async\\s+)?function\\s+GET",
              message: "Export a function named GET (async optional).",
            },
            {
              kind: "regex",
              pattern: "NextResponse\\.json\\(\\s*\\{\\s*pong\\s*:\\s*true\\s*\\}",
              message: "Return NextResponse.json({ pong: true }).",
            },
          ],
          preview: (code) => {
            const ok = /NextResponse\.json\(\s*\{\s*pong\s*:\s*true\s*\}/.test(
              code,
            );
            return {
              tag: "div",
              props: { class: "p-6 space-y-3" },
              children: [
                {
                  tag: "div",
                  props: {
                    class:
                      "inline-flex items-center gap-2 text-xs font-mono text-emerald-300",
                  },
                  children: ["GET /api/ping"],
                },
                {
                  tag: "pre",
                  props: {
                    class:
                      "p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-ink-100 font-mono",
                  },
                  children: [
                    ok
                      ? '{\n  "pong": true\n}'
                      : "// implement the handler to see a response",
                  ],
                },
              ],
            };
          },
          solution: `import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ pong: true });
}
`,
          hints: [
            "The exported function name must be exactly GET.",
            "NextResponse.json takes any JSON-serializable value.",
          ],
        },
      ],
    },
    {
      id: "server-actions",
      slug: "server-actions",
      title: "Server Actions",
      emoji: "⚡",
      summary:
        "Mutate data without writing a fetch — call a server function straight from a form.",
      minutes: 10,
      xp: 130,
      badge: "Action Hero",
      content: [
        {
          kind: "p",
          text: "A Server Action is a function marked with the 'use server' directive. You can pass it as the action prop of a <form>, and the browser will POST the form data to it on submit. No client-side fetch code required.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `// app/todos/page.tsx
async function addTodo(formData: FormData) {
  "use server";
  const text = formData.get("text") as string;
  await db.todos.insert({ text });
}

export default function TodosPage() {
  return (
    <form action={addTodo}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  );
}`,
        },
        {
          kind: "callout",
          tone: "tip",
          text: "Place 'use server' at the very top of an exported async function (or at the top of a whole file) to mark it as a server action.",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "server-action-code",
          title: "Wire up addTodo",
          brief:
            "Add the 'use server' directive in addTodo, read the 'text' field, and pass addTodo as the form's action prop.",
          filename: "app/todos/page.tsx",
          language: "tsx",
          starter: `async function addTodo(formData: FormData) {
  // directive missing
  const text = formData.get("text");
  console.log("got:", text);
}

export default function TodosPage() {
  return (
    <form>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  );
}
`,
          checks: [
            {
              kind: "regex",
              pattern: '"use server"',
              message:
                'Add the "use server" directive inside the addTodo function body (first statement).',
            },
            {
              kind: "regex",
              pattern: "<form[^>]*action\\s*=\\s*\\{\\s*addTodo\\s*\\}",
              message: "Pass addTodo as the form's action: <form action={addTodo}>.",
            },
            {
              kind: "regex",
              pattern: 'name="text"',
              message: "Keep the input named 'text' so formData.get('text') works.",
            },
          ],
          preview: (code) => {
            const ok = /"use server"/.test(code);
            return {
              tag: "div",
              props: { class: "p-6 space-y-3" },
              children: [
                {
                  tag: "form",
                  props: { class: "flex gap-2" },
                  children: [
                    {
                      tag: "input",
                      props: {
                        class:
                          "px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm flex-1",
                        placeholder: "what's the todo?",
                      },
                    },
                    {
                      tag: "button",
                      props: {
                        class:
                          "px-3 py-2 rounded-lg bg-brand-500 text-white text-sm",
                      },
                      children: ["Add"],
                    },
                  ],
                },
                {
                  tag: "p",
                  props: {
                    class: ok
                      ? "text-xs text-emerald-300"
                      : "text-xs text-amber-300",
                  },
                  children: [
                    ok
                      ? "✓ Server Action wired. The form will POST to addTodo on submit."
                      : "Mark addTodo as a Server Action with 'use server'.",
                  ],
                },
              ],
            };
          },
          solution: `async function addTodo(formData: FormData) {
  "use server";
  const text = formData.get("text") as string;
  console.log("got:", text);
}

export default function TodosPage() {
  return (
    <form action={addTodo}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  );
}
`,
          hints: [
            "First statement inside the action body: \"use server\";",
            "Reference the function (not call it) when passing as a prop: action={addTodo}",
          ],
        },
      ],
    },
    {
      id: "metadata",
      slug: "metadata",
      title: "Metadata & SEO",
      emoji: "🏷️",
      summary:
        "Set the page <title> and OpenGraph tags with a typed export — no head tag wrangling.",
      minutes: 5,
      xp: 70,
      content: [
        {
          kind: "p",
          text: "Each layout and page can export a metadata object (or a generateMetadata function) typed as Metadata. Next.js renders <title>, <meta>, OpenGraph and friends for you.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quester's Journal",
  description: "Field notes on learning Next.js",
  openGraph: {
    title: "Quester's Journal",
    description: "Field notes on learning Next.js",
  },
};

export default function Page() {
  return <article>…</article>;
}`,
        },
        {
          kind: "callout",
          tone: "tip",
          text: "Nested layouts can override metadata. The most specific one wins.",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "metadata-code",
          title: "Add a metadata export",
          brief:
            "Export a typed metadata object with title 'Next.Quest Journal' and a description. Then render the page.",
          filename: "app/journal/page.tsx",
          language: "tsx",
          starter: `import type { Metadata } from "next";

// export metadata: Metadata = { ... }

export default function Page() {
  return <h1>Journal</h1>;
}
`,
          checks: [
            {
              kind: "regex",
              pattern: 'export\\s+const\\s+metadata\\s*:\\s*Metadata',
              message:
                "Export const metadata: Metadata = { ... } so Next picks it up.",
            },
            {
              kind: "regex",
              pattern: 'title\\s*:\\s*["\']Next\\.Quest Journal["\']',
              message: 'Set title to "Next.Quest Journal" exactly.',
            },
            {
              kind: "regex",
              pattern: 'description\\s*:\\s*["\']',
              message: "Add a description field too.",
            },
          ],
          preview: (code) => {
            const titleMatch = code.match(/title\s*:\s*["']([^"']+)["']/);
            const descMatch = code.match(
              /description\s*:\s*["']([^"']+)["']/,
            );
            return {
              tag: "div",
              props: { class: "p-6 space-y-3" },
              children: [
                {
                  tag: "div",
                  props: {
                    class:
                      "rounded-lg bg-white/5 border border-white/10 p-3",
                  },
                  children: [
                    {
                      tag: "p",
                      props: {
                        class:
                          "text-[10px] uppercase tracking-wider text-ink-400 mb-1",
                      },
                      children: ["Browser tab"],
                    },
                    {
                      tag: "p",
                      props: { class: "text-sm font-medium text-ink-100" },
                      children: [titleMatch ? titleMatch[1] : "(no title set)"],
                    },
                  ],
                },
                {
                  tag: "div",
                  props: {
                    class:
                      "rounded-lg bg-white/5 border border-white/10 p-3",
                  },
                  children: [
                    {
                      tag: "p",
                      props: {
                        class:
                          "text-[10px] uppercase tracking-wider text-ink-400 mb-1",
                      },
                      children: ["<meta name='description'>"],
                    },
                    {
                      tag: "p",
                      props: { class: "text-sm text-ink-200" },
                      children: [
                        descMatch
                          ? descMatch[1]
                          : "(no description set)",
                      ],
                    },
                  ],
                },
              ],
            };
          },
          solution: `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.Quest Journal",
  description: "Field notes on learning Next.js",
};

export default function Page() {
  return <h1>Journal</h1>;
}
`,
          hints: [
            "Shape: export const metadata: Metadata = { title: ..., description: ... }",
            "Match the title exactly, including the period and capitalization.",
          ],
        },
      ],
    },
  ],
};
