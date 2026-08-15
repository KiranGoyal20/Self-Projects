import type { ChatMessage } from "../features/chat/chatSlice";
import type { Lesson } from "../types/curriculum";

const SYSTEM_PROMPT = `You are NextSage, a friendly, concise AI tutor for Next.js (App Router, Next 14+). 
Explain ideas clearly with small code snippets in tsx/ts when relevant. 
Prefer the App Router (app/ directory), Server Components by default, 'use client' for interactivity. 
When the user is on a specific lesson, tie your answers back to that lesson's concept.
Keep replies under ~200 words unless asked for depth.`;

export type TutorCallOptions = {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  lesson?: Lesson;
  lessonCode?: Record<string, string>;
};

/** Call an OpenAI-compatible /v1/chat/completions endpoint. */
export async function callOpenAi({
  apiKey,
  model,
  messages,
  lesson,
  lessonCode,
}: TutorCallOptions): Promise<string> {
  const lessonContext = lesson
    ? `\n\nCurrent lesson context — Title: "${lesson.title}". Summary: ${lesson.summary}.${
        lessonCode && Object.keys(lessonCode).length > 0
          ? `\n\nUser's most recent code:\n${Object.entries(lessonCode)
              .map(([k, v]) => `// exercise ${k}\n${v}`)
              .join("\n\n")}`
          : ""
      }`
    : "";

  const payload = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT + lessonContext },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.4,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "(no reply)";
}

/* ------------------------------------------------------------------------- */
/* Offline knowledge base — used when the user hasn't supplied an API key.    */
/* ------------------------------------------------------------------------- */

type Topic = {
  match: RegExp;
  reply: string;
};

const topics: Topic[] = [
  {
    match: /(server\s*component|rsc)/i,
    reply: `**Server Components** are the default in the App Router. They run on the server, can be async, can fetch data directly, and ship zero JS to the client.

\`\`\`tsx
export default async function Posts() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
\`\`\`

What they can't do: useState, useEffect, onClick, or browser APIs. If you need those, mark the file as a Client Component with \`"use client"\` at the top.`,
  },
  {
    match: /use\s*client/i,
    reply: `\`"use client"\` is a directive you put at the very top of a file to opt that component into the browser bundle. Use it when you need:
- React hooks (useState, useEffect, useRef)
- Event handlers like onClick
- Browser APIs (window, localStorage, IntersectionObserver)

Rule of thumb: keep \`"use client"\` as far down the tree as you can — bigger trees stay on the server, smaller interactive leaves go to the client.`,
  },
  {
    match: /(server\s*action|use\s*server)/i,
    reply: `**Server Actions** are async functions you can call directly from your UI — Next.js wires up the form POST or fetch behind the scenes. Mark them with \`"use server"\`:

\`\`\`tsx
async function addTodo(formData: FormData) {
  "use server";
  await db.todos.insert({ text: formData.get("text") });
}

export default function Page() {
  return <form action={addTodo}>{/* ... */}</form>;
}
\`\`\`

They're perfect for mutations: no manual API route, no client fetch logic.`,
  },
  {
    match: /(route\s*handler|api\s*route|route\.ts)/i,
    reply: `**Route Handlers** are how you build JSON / non-HTML endpoints. Create \`app/api/something/route.ts\` and export functions named after HTTP methods:

\`\`\`ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ hello: "world" });
}
\`\`\`

A folder can have a \`page.tsx\` (HTML) OR a \`route.ts\` (data) — not both.`,
  },
  {
    match: /(dynamic\s*route|\[slug\]|param)/i,
    reply: `**Dynamic segments** wrap a folder name in square brackets. \`app/blog/[slug]/page.tsx\` matches \`/blog/anything\`.

The page receives a \`params\` prop containing the captured value:

\`\`\`tsx
export default function PostPage({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
\`\`\`

In Next 15+, \`params\` is async — you'll see \`params: Promise<{ slug: string }>\` that you await.`,
  },
  {
    match: /(layout|nested)/i,
    reply: `A **layout.tsx** wraps every page within its segment and survives navigation between sibling routes (great for nav, sidebars, persistent state).

\`\`\`tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <aside>Sidebar</aside>
      <main>{children}</main>
    </section>
  );
}
\`\`\`

Always render \`{children}\` somewhere or nested pages disappear.`,
  },
  {
    match: /(loading|suspense)/i,
    reply: `Drop a **loading.tsx** next to your page and Next.js automatically wraps the segment in Suspense, showing your loading UI while the server is still streaming.

\`\`\`tsx
// app/blog/loading.tsx
export default function Loading() {
  return <p>Loading posts…</p>;
}
\`\`\`

It works seamlessly with async Server Components.`,
  },
  {
    match: /(error|catch|exception)/i,
    reply: `**error.tsx** becomes the error boundary for its segment. It MUST be a Client Component because it uses a \`reset()\` callback:

\`\`\`tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Oops: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\``,
  },
  {
    match: /(metadata|seo|title)/i,
    reply: `Each page or layout can export a typed \`metadata\` object — Next.js renders the head tags for you:

\`\`\`tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page",
  description: "A short summary",
  openGraph: { title: "My Page" },
};
\`\`\`

For dynamic titles, export an async \`generateMetadata({ params })\` instead.`,
  },
  {
    match: /(image|next\/image|<img)/i,
    reply: `Use **\`next/image\`** instead of \`<img>\`. It auto-optimizes, lazy-loads, and serves WebP/AVIF:

\`\`\`tsx
import Image from "next/image";

<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
\`\`\`

The \`priority\` prop is for the LCP image. Width & height prevent layout shift.`,
  },
  {
    match: /(font|next\/font)/i,
    reply: `**\`next/font\`** self-hosts Google Fonts to remove the extra request and prevent flash-of-unstyled-text:

\`\`\`tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return <html className={inter.className}>{children}</html>;
}
\`\`\``,
  },
  {
    match: /(cache|revalidate|isr)/i,
    reply: `Next.js wraps the native \`fetch\` with caching. Options:

- **Default** — cache forever (until you redeploy).
- **\`{ next: { revalidate: 60 } }\`** — ISR: refresh at most every 60s.
- **\`{ cache: "no-store" }\`** — always fresh, never cached.

\`\`\`tsx
const res = await fetch(url, { next: { revalidate: 60 } });
\`\`\`

You can also call \`revalidatePath\` or \`revalidateTag\` from a Server Action to bust the cache on demand.`,
  },
  {
    match: /(deploy|vercel|production|build)/i,
    reply: `Production workflow:

1. \`npm run build\` — generates the optimized output (.next/).
2. \`npm run start\` — serves the build on a Node host.

On **Vercel**, push to GitHub and import the repo: pages become CDN HTML, server code becomes serverless functions, env vars are configured in the dashboard.

Always run \`npm run build\` locally before deploying — it surfaces type and lint errors.`,
  },
  {
    match: /(link|navigate|navigation)/i,
    reply: `Use **\`next/link\`** for in-app navigation — it prefetches the destination and avoids a full reload:

\`\`\`tsx
import Link from "next/link";
<Link href="/blog">Blog</Link>
\`\`\`

Save plain \`<a>\` for external URLs. For programmatic navigation in a Client Component, use \`useRouter\` from \`next/navigation\`.`,
  },
  {
    match: /(env|environment|secret)/i,
    reply: `Environment variables:
- \`process.env.MY_VAR\` works in Server Components & API routes.
- \`process.env.NEXT_PUBLIC_*\` is the ONLY prefix exposed to the browser.
- Keep production secrets in your host's dashboard (Vercel "Environment Variables") — never commit them.

A common .env.local:
\`\`\`bash
DATABASE_URL="postgres://..."
NEXT_PUBLIC_SITE_URL="https://example.com"
\`\`\``,
  },
  {
    match: /(middleware)/i,
    reply: `**Middleware** runs before a request finishes matching. Drop a \`middleware.ts\` at the project root:

\`\`\`ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.cookies.get("session")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: ["/dashboard/:path*"] };
\`\`\`

Great for auth gates, A/B routing, geo redirects.`,
  },
  {
    match: /(hello|hi|hey|start|help)/i,
    reply: `Hey! I'm **NextSage** — your built-in Next.js tutor. Ask me anything: Server vs Client Components, dynamic routes, Server Actions, deployment, caching, anything goes.

Some questions to try:
- "What's a Server Component, in one paragraph?"
- "How do I fetch data with caching?"
- "What does 'use client' actually do?"
- "How do dynamic routes work?"

If you add an OpenAI API key in **Settings**, I'll use a real LLM. Otherwise I'll do my best with built-in knowledge.`,
  },
];

const fallbackReply = `I have a small offline knowledge base — try asking about Server Components, "use client", dynamic routes, layouts, loading.tsx, route handlers, Server Actions, metadata, fetch caching, next/image, next/font, environment variables, middleware, or deployment.

For deeper conversations, drop an OpenAI API key in **Settings** and I'll route the question through a real model.`;

export function fallbackTutor(prompt: string, lesson?: Lesson): string {
  const hit = topics.find((t) => t.match.test(prompt));
  if (hit) {
    if (lesson) {
      return (
        hit.reply +
        `\n\n*Tying it to your current lesson — "${lesson.title}": ${lesson.summary}*`
      );
    }
    return hit.reply;
  }
  return fallbackReply;
}
