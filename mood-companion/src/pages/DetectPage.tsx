import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const paths = [
  {
    to: "/detect/quiz",
    title: "The mood quiz",
    body: "Five short questions about how your body, mind, and evening feel.",
    bullets: ["~30 seconds", "Best for clarity", "Highest confidence"],
    icon: "🧠",
    gradient: "from-violet-500/30 via-fuchsia-500/20 to-rose-500/10",
  },
  {
    to: "/detect/journal",
    title: "Write a journal entry",
    body: "Type anything — what happened today, what you're feeling, even a fragment.",
    bullets: ["Free-form", "Sentiment-aware", "Saved with your entry"],
    icon: "📓",
    gradient: "from-cyan-500/25 via-blue-500/20 to-violet-500/10",
  },
  {
    to: "/detect/pick",
    title: "Pick a mood",
    body: "You already know how you feel. Tap one and we'll do the rest.",
    bullets: ["Instant", "Manual control", "Great for repeat moods"],
    icon: "🎯",
    gradient: "from-amber-500/25 via-rose-500/20 to-fuchsia-500/10",
  },
];

export const DetectPage = () => (
  <div className="space-y-8">
    <header className="max-w-2xl">
      <h1 className="heading text-3xl md:text-4xl text-ink-50">
        How would you like to find your mood?
      </h1>
      <p className="text-ink-300 mt-2">
        Three paths, same destination. Pick whichever fits the moment.
      </p>
    </header>
    <div className="grid md:grid-cols-3 gap-4">
      {paths.map((p, i) => (
        <motion.div
          key={p.to}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 * i }}
        >
          <Link
            to={p.to}
            className={`block card p-6 hover:bg-white/[0.08] h-full bg-gradient-to-br ${p.gradient} transition-all`}
          >
            <div className="text-3xl mb-3">{p.icon}</div>
            <h3 className="font-display font-semibold text-ink-50 text-lg">
              {p.title}
            </h3>
            <p className="text-sm text-ink-200 mt-1.5">{p.body}</p>
            <ul className="mt-4 space-y-1.5">
              {p.bullets.map((b) => (
                <li
                  key={b}
                  className="text-xs text-ink-300 flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" />
                  {b}
                </li>
              ))}
            </ul>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);
