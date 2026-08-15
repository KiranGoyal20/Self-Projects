import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { dismissNotification } from "../features/progress/progressSlice";

export const NotificationStack = () => {
  const notifications = useAppSelector((s) => s.progress.notifications);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (notifications.length === 0) return;
    const first = notifications[0];
    const timer = setTimeout(() => {
      dispatch(dismissNotification(first.id));
    }, first.kind === "level" || first.kind === "badge" ? 3500 : 1800);
    return () => clearTimeout(timer);
  }, [notifications, dispatch]);

  return (
    <div className="pointer-events-none fixed top-20 right-5 z-40 flex flex-col gap-2 max-w-xs">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            className={`pointer-events-auto rounded-xl px-4 py-2.5 shadow-card border backdrop-blur-xl flex items-center gap-3 ${
              n.kind === "level"
                ? "bg-gradient-to-r from-brand-500/40 to-neon-pink/40 border-brand-300/30 text-ink-50"
                : n.kind === "badge"
                  ? "bg-gradient-to-r from-amber-500/30 to-neon-pink/30 border-amber-300/30 text-ink-50"
                  : n.kind === "streak"
                    ? "bg-amber-500/15 border-amber-400/30 text-amber-100"
                    : "bg-white/8 border-white/10 text-ink-100"
            }`}
          >
            <span className="text-xl">{n.emoji ?? "✨"}</span>
            <span className="text-sm font-medium">{n.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
