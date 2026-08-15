import type { Chapter } from "../../types/curriculum";

export const shipChapter: Chapter = {
  id: "ship",
  title: "Ship It",
  tagline: "Performance instincts & deployment",
  emoji: "🚢",
  accent: "from-neon-pink to-neon-amber",
  lessons: [
    {
      id: "image-font",
      slug: "image-font",
      title: "Images, fonts & scripts",
      emoji: "🖼️",
      summary:
        "Three little components that single-handedly fix most performance regressions.",
      minutes: 7,
      xp: 90,
      content: [
        {
          kind: "p",
          text: "Next.js ships drop-in components for the three biggest performance footguns: images, fonts, and third-party scripts. Reach for them instead of raw <img>, font CDNs, and <script> tags.",
        },
        {
          kind: "code",
          lang: "tsx",
          code: `import Image from "next/image";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  return (
    <main className={inter.className}>
      <Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
      <Script src="https://example.com/analytics.js" strategy="afterInteractive" />
    </main>
  );
}`,
        },
        {
          kind: "list",
          items: [
            "next/image: resizes, lazy-loads, serves modern formats automatically.",
            "next/font: self-hosts Google fonts to avoid layout shift & extra requests.",
            "next/script: lets you defer or post-hydrate third-party JS.",
          ],
        },
      ],
      exercises: [
        {
          kind: "quiz",
          id: "perf-quiz",
          title: "Which tool?",
          questions: [
            {
              id: "q1",
              prompt:
                "You're adding a hero banner photo. Which component should you use?",
              options: ["<img>", "next/image", "next/picture", "next/banner"],
              correct: 1,
              explanation:
                "next/image gives you automatic optimization, responsive sizes, and lazy loading.",
            },
            {
              id: "q2",
              prompt: "Why prefer next/font over <link rel='stylesheet'>?",
              options: [
                "It auto-translates fonts to emoji",
                "It self-hosts the font and removes the extra network request",
                "It enforces uppercase",
                "It bans Google Fonts",
              ],
              correct: 1,
              explanation:
                "next/font self-hosts and inlines critical CSS — one request gone, no layout shift.",
            },
          ],
        },
      ],
    },
    {
      id: "deploy",
      slug: "deploy",
      title: "Deploying to production",
      emoji: "🌐",
      summary:
        "From git push to live URL — the typical Next.js deployment flow.",
      minutes: 6,
      xp: 80,
      badge: "Launched",
      content: [
        {
          kind: "p",
          text: "Next.js is framework-agnostic to host, but Vercel (its maker) gives you zero-config deploys. The flow is: push to GitHub, import the repo on Vercel, you get a live URL.",
        },
        { kind: "h", text: "What gets deployed" },
        {
          kind: "list",
          items: [
            "Your static pages become CDN-cached HTML.",
            "Your server components & route handlers run as serverless functions.",
            "Environment variables you set in the dashboard are injected into the server runtime.",
          ],
        },
        {
          kind: "callout",
          tone: "info",
          text: "You can also self-host with `next build && next start` on any Node host, or use Docker. The framework doesn't lock you to Vercel.",
        },
        { kind: "h", text: "Pre-deploy checklist" },
        {
          kind: "list",
          items: [
            "Run `npm run build` locally — it surfaces type and lint errors.",
            "Move secrets out of code into environment variables (NEVER commit them).",
            "Set <Image> dimensions to avoid layout shift.",
            "Verify metadata: title, description, og:image.",
          ],
        },
      ],
      exercises: [
        {
          kind: "fill",
          id: "deploy-fill",
          title: "The build command",
          brief:
            "Complete the two commands you'd run to build a production bundle and then serve it.",
          template: "npm run {{0}} && npm run {{1}}",
          blanks: [
            { answer: "build" },
            { answer: "start", alternates: ["preview"] },
          ],
          hints: [
            "Look at the scripts a fresh create-next-app generates.",
            "`build` produces .next/, `start` runs the server.",
          ],
        },
        {
          kind: "quiz",
          id: "deploy-quiz",
          title: "Quiz: deploy day",
          questions: [
            {
              id: "q1",
              prompt: "Where should secrets live?",
              options: [
                "Hard-coded in pages",
                "In a public folder file",
                "In environment variables, configured in your host's dashboard",
                "Committed to .env.example",
              ],
              correct: 2,
              explanation:
                "Production secrets belong in the host's encrypted env var store, never in version control.",
            },
            {
              id: "q2",
              prompt: "Which command produces the optimized production bundle?",
              options: [
                "npm run dev",
                "npm run build",
                "npm run lint",
                "npm install",
              ],
              correct: 1,
              explanation:
                "`next build` performs the optimized production compilation.",
            },
          ],
        },
      ],
    },
  ],
};
