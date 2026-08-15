import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/detect", label: "Detect", icon: "🌀" },
  { to: "/discover", label: "Discover", icon: "🎧" },
  { to: "/history", label: "History", icon: "🗓️" },
];

export const Layout = () => (
  <div className="min-h-full flex flex-col">
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-ink-950/60 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-glow"
          >
            <span className="text-lg">◐</span>
          </motion.div>
          <span className="font-display font-bold text-lg text-ink-50">
            Mood<span className="text-fuchsia-300">·</span>Companion
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl glass">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-white/10 text-ink-50 shadow-card"
                    : "text-ink-300 hover:text-ink-100 hover:bg-white/5"
                }`
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>

    <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-8 md:py-12">
      <Outlet />
    </main>

    <nav className="md:hidden sticky bottom-0 z-30 backdrop-blur-xl bg-ink-950/80 border-t border-white/5">
      <div className="grid grid-cols-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center py-3 text-xs gap-0.5 ${
                isActive ? "text-fuchsia-200" : "text-ink-400"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  </div>
);
