"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/hooks";
import { xpProgressInLevel } from "@/features/progress/progressSlice";
import { SyncIndicator } from "@/components/SyncIndicator";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/learn", label: "Roadmap", icon: "🗺️" },
  { href: "/badges", label: "Badges", icon: "🏆" },
  { href: "/chat", label: "Tutor", icon: "💬" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export const Navbar = () => {
  const { xp, level, streak, displayName } = useAppSelector((s) => ({
    xp: s.progress.xp,
    level: s.progress.level,
    streak: s.progress.streak,
    displayName: s.settings.displayName,
  }));
  const xpInfo = xpProgressInLevel(xp);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <motion.div
            initial={{ rotate: -20, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-400 via-neon-violet to-neon-pink flex items-center justify-center shadow-glow font-bold text-white"
          >
            N<span className="text-neon-amber">.</span>
          </motion.div>
          <div className="hidden sm:block">
            <p className="font-display font-extrabold text-base leading-none text-ink-50">
              Next<span className="text-brand-300">.</span>Quest
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 mt-0.5">
              learn · play · ship
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl glass">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                isActive(item.href)
                  ? "bg-white/10 text-ink-50 shadow-card"
                  : "text-ink-300 hover:text-ink-100 hover:bg-white/5"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <SyncIndicator />
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">
              {displayName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-brand-300">Lv {level}</span>
              <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-400 via-neon-violet to-neon-pink"
                  style={{ width: `${Math.round(xpInfo.pct * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-ink-300">
                {xpInfo.inLevel}/{xpInfo.toNext}
              </span>
            </div>
          </div>
          {streak > 0 && (
            <div
              className="chip text-amber-200 border-amber-500/30 bg-amber-500/10"
              title={`${streak}-day streak`}
            >
              🔥 <span>{streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-xl bg-ink-950/85 border-t border-white/5">
        <div className="grid grid-cols-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2.5 text-[10px] gap-0.5 ${
                isActive(item.href) ? "text-brand-200" : "text-ink-400"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};
