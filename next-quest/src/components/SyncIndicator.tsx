import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export const SyncIndicator = () => {
  const { enabled, status, lastSyncedAt, lastError, baseUrl } = useAppSelector(
    (s) => s.sync,
  );

  if (!enabled) {
    return (
      <Link
        to="/settings"
        className="hidden sm:inline-flex chip text-ink-400 hover:text-ink-200"
        title="Backend sync is off — your data stays in this browser only."
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ink-500" />
        Local
      </Link>
    );
  }

  const { dot, label, tone } = (() => {
    switch (status) {
      case "syncing":
        return {
          dot: "bg-amber-400 animate-pulse",
          label: "Syncing",
          tone: "text-amber-200 border-amber-400/30 bg-amber-500/10",
        };
      case "synced":
      case "idle":
        return {
          dot: "bg-emerald-400",
          label: "Synced",
          tone: "text-emerald-200 border-emerald-400/30 bg-emerald-500/10",
        };
      case "offline":
        return {
          dot: "bg-rose-400",
          label: "Backend offline",
          tone: "text-rose-200 border-rose-400/30 bg-rose-500/10",
        };
      case "error":
        return {
          dot: "bg-rose-400 animate-pulse",
          label: "Sync error",
          tone: "text-rose-200 border-rose-400/30 bg-rose-500/10",
        };
      default:
        return {
          dot: "bg-ink-500",
          label: "Local",
          tone: "text-ink-400",
        };
    }
  })();

  const tooltip =
    lastError ??
    (lastSyncedAt
      ? `Last synced ${new Date(lastSyncedAt).toLocaleTimeString()}\n${baseUrl}`
      : baseUrl);

  return (
    <Link
      to="/settings"
      className={`hidden sm:inline-flex chip ${tone}`}
      title={tooltip}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </Link>
  );
};
