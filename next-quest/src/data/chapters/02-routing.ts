import type { Chapter } from "../../types/curriculum";

export const routingChapter: Chapter = {
  id: "routing",
  title: "Routing & Pages",
  tagline: "Folders are routes. Files are UI.",
  emoji: "🗺️",
  accent: "from-neon-violet to-neon-pink",
  lessons: [
    {
      id: "first-page",
      slug: "first-page",
      title: "Your first page",
      emoji: "📄",
      summary:
        "Create a homepage component the Next.js way using app/page.tsx.",
      minutes: 8,
      xp: 90,
      badge: "Page Wizard",
      content: [
        {
          kind: "p",
          text: "In the App Router, every folder under app/ that contains a page.tsx file becomes a route. The default export of that file is the React component rendered at that URL.",
        },
        { kind: "h", text: "The rules" },
        {
          kind: "list",
          items: [
            "app/page.tsx → /",
            "app/about/page.tsx → /about",
            "app/blog/posts/page.tsx → /blog/posts",
          ],
        },
        {
          kind: "callout",
          tone: "info",
          text: "A page component MUST be the default export and MUST return JSX.",
        },
        {
          kind: "p",
          text: "Below, write a tiny Next.js page that renders a heading. Don't worry about styling — focus on the shape of the file.",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "first-page-code",
          title: "Build app/page.tsx",
          brief:
            "Export a default React component named Home that returns an <h1> with the text 'Hello, Next.quest!'.",
          filename: "app/page.tsx",
          language: "tsx",
          starter: `export default function Home() {
  // return your JSX here
}
`,
          checks: [
            {
              kind: "regex",
              pattern: "export\\s+default\\s+function\\s+Home",
              message:
                "Use 'export default function Home' so Next.js can pick it up.",
            },
            {
              kind: "regex",
              pattern: "<h1[^>]*>\\s*Hello,\\s*Next\\.quest!\\s*</h1>",
              message:
                "Render an <h1>Hello, Next.quest!</h1> — exact text, exact tag.",
            },
            {
              kind: "regexNot",
              pattern: '"use client"',
              message:
                "No need for 'use client' here — server components are the default.",
            },
          ],
          preview: (code) => {
            const m = code.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
            const heading = m ? m[1].trim() : "Hello, world!";
            return {
              tag: "div",
              props: { class: "p-8" },
              children: [
                {
                  tag: "h1",
                  props: {
                    class:
                      "text-3xl font-bold tracking-tight text-ink-50",
                  },
                  children: [heading],
                },
              ],
            };
          },
          solution: `export default function Home() {
  return <h1>Hello, Next.quest!</h1>;
}
`,
          hints: [
            "The component needs to be 'export default' — Next.js relies on that.",
            "JSX heading: <h1>...</h1>. The text must be exact: Hello, Next.quest!",
          ],
        },
      ],
    },
    {
      id: "nested-routes",
      slug: "nested-routes",
      title: "Nested & dynamic routes",
      emoji: "🌿",
      summary:
        "Build nested URLs with folders and capture URL params with [bracket] segments.",
      minutes: 10,
      xp: 110,
      content: [
        {
          kind: "p",
          text: "Want a URL like /blog/hello-world? Make the folders match. Every URL segment is a folder; the file at the leaf is page.tsx.",
        },
        {
          kind: "code",
          lang: "bash",
          code: `app/
└── blog/
    ├── page.tsx              ← /blog
    └── [slug]/
        └── page.tsx          ← /blog/anything`,
        },
        {
          kind: "p",
          text: "Square brackets capture a dynamic segment. The captured value arrives as a prop named params on your component.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  return <h1>Post: {params.slug}</h1>;
}`,
        },
        {
          kind: "callout",
          tone: "warn",
          text: "In Next 15+, params is async — you can also write 'params: Promise<{ slug: string }>' and await it. For now, the simple shape above is fine to learn the model.",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "dynamic-route-code",
          title: "Render the slug",
          brief:
            "Inside app/blog/[slug]/page.tsx, render an <h1> that says 'Post: ' followed by the slug pulled from params.",
          filename: "app/blog/[slug]/page.tsx",
          language: "tsx",
          starter: `export default function PostPage({ params }: { params: { slug: string } }) {
  // render the slug inside an <h1>
}
`,
          checks: [
            {
              kind: "regex",
              pattern: "export\\s+default\\s+function\\s+\\w+",
              message:
                "Keep the default-exported function — Next.js needs it to mount the page.",
            },
            {
              kind: "regex",
              pattern: "params\\.slug",
              message: "Read params.slug somewhere in your JSX.",
            },
            {
              kind: "regex",
              pattern: "<h1[^>]*>[^<]*Post:\\s*\\{?[^<]*<\\/h1>",
              message:
                "Wrap your output in an <h1>...</h1> that starts with 'Post:'.",
            },
          ],
          preview: (code) => {
            const hasSlug = /params\.slug/.test(code);
            return {
              tag: "div",
              props: { class: "p-8" },
              children: [
                {
                  tag: "h1",
                  props: {
                    class: "text-2xl font-semibold text-ink-50",
                  },
                  children: [
                    hasSlug
                      ? "Post: hello-world"
                      : "Post: (slug not interpolated yet)",
                  ],
                },
                {
                  tag: "p",
                  props: { class: "mt-2 text-xs text-ink-400" },
                  children: ["URL: /blog/hello-world"],
                },
              ],
            };
          },
          solution: `export default function PostPage({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
`,
          hints: [
            "JSX interpolation: { params.slug }.",
            "The h1 should read like <h1>Post: {params.slug}</h1>.",
          ],
        },
        {
          kind: "quiz",
          id: "routing-quiz",
          title: "Routing trivia",
          questions: [
            {
              id: "q1",
              prompt: "Which folder maps to /docs/getting-started?",
              options: [
                "app/getting-started/docs/page.tsx",
                "app/docs/getting-started/page.tsx",
                "app/docs-getting-started/page.tsx",
                "pages/docs/getting-started.tsx",
              ],
              correct: 1,
              explanation:
                "Each URL segment is its own folder; page.tsx renders that segment.",
            },
            {
              id: "q2",
              prompt: "How do you capture a [slug] segment in the App Router?",
              options: [
                "Read window.location.pathname",
                "Import useRouter and call router.query",
                "Receive a params prop on the page component",
                "Use process.env.SLUG",
              ],
              correct: 2,
              explanation:
                "Server pages get params as a prop. Client components can also useParams().",
            },
          ],
        },
      ],
    },
    {
      id: "linking",
      slug: "linking",
      title: "Linking between pages",
      emoji: "🔗",
      summary:
        "Use <Link> for client-side navigation instead of plain <a> tags.",
      minutes: 5,
      xp: 70,
      content: [
        {
          kind: "p",
          text: "Plain <a href> works but does a full page reload. Next.js ships a <Link> component that prefetches and navigates without throwing away your React tree.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  );
}`,
        },
        {
          kind: "callout",
          tone: "tip",
          text: "Always reach for <Link> when navigating within the app. Use plain <a> only for external links.",
        },
      ],
      exercises: [
        {
          kind: "code",
          id: "linking-code",
          title: "Wire up the nav",
          brief:
            "Import Link from next/link and create two links: Home (/) and About (/about).",
          filename: "app/components/Nav.tsx",
          language: "tsx",
          starter: `// import Link here

export default function Nav() {
  return (
    <nav>
      {/* two Link tags here */}
    </nav>
  );
}
`,
          checks: [
            {
              kind: "regex",
              pattern: 'import\\s+Link\\s+from\\s+["\']next/link["\']',
              message: "Import Link from 'next/link' at the top.",
            },
            {
              kind: "regex",
              pattern: '<Link\\s+href=["\']/["\'][^>]*>\\s*Home',
              message: 'Add a <Link href="/">Home</Link>.',
            },
            {
              kind: "regex",
              pattern: '<Link\\s+href=["\']/about["\'][^>]*>\\s*About',
              message: 'Add a <Link href="/about">About</Link>.',
            },
            {
              kind: "regexNot",
              pattern: '<a\\s+href',
              message:
                "Don't use a plain <a> here — Link is the Next.js way.",
            },
          ],
          preview: (code) => {
            const linkRe = /<Link[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Link>/g;
            const links: { href: string; label: string }[] = [];
            let m: RegExpExecArray | null;
            while ((m = linkRe.exec(code))) {
              links.push({ href: m[1], label: m[2].trim() });
            }
            return {
              tag: "div",
              props: { class: "p-8" },
              children: [
                {
                  tag: "nav",
                  props: { class: "flex gap-4 text-brand-300" },
                  children:
                    links.length > 0
                      ? links.map((l) => ({
                          tag: "a",
                          props: {
                            class:
                              "underline hover:text-brand-200",
                            "data-href": l.href,
                          },
                          children: [`${l.label} → ${l.href}`],
                        }))
                      : [
                          {
                            tag: "span",
                            props: { class: "text-ink-400 italic" },
                            children: ["(no links yet)"],
                          },
                        ],
                },
              ],
            };
          },
          solution: `import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  );
}
`,
          hints: [
            "next/link's default export is the Link component.",
            "Pass href='/' for Home and href='/about' for About.",
          ],
        },
      ],
    },
  ],
};
