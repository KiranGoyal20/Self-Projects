import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setApiKey,
  setDisplayName,
  setModel,
  setShareLessonContext,
} from "../features/settings/settingsSlice";
import { resetProgress } from "../features/progress/progressSlice";
import { clearChat } from "../features/chat/chatSlice";
import {
  resetSync,
  setBaseUrl,
  setEnabled,
  setProfileId,
} from "../features/sync/syncSlice";
import { checkHealth } from "../utils/syncClient";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s) => s.settings);
  const sync = useAppSelector((s) => s.sync);
  const [showKey, setShowKey] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pinging, setPinging] = useState<null | "ok" | "fail">(null);

  const handleTestConnection = async () => {
    setPinging(null);
    const ok = await checkHealth(sync.baseUrl);
    setPinging(ok ? "ok" : "fail");
    setTimeout(() => setPinging(null), 2500);
  };

  const handleCopyProfileId = async () => {
    try {
      await navigator.clipboard.writeText(sync.profileId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 font-mono mb-1.5">
          Settings
        </p>
        <h1 className="heading text-3xl md:text-4xl text-ink-50">
          Make the quest yours.
        </h1>
        <p className="mt-2 text-ink-300">
          Local-only — nothing here leaves your browser.
        </p>
      </header>

      <section className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-ink-50">Profile</h2>
        <Field label="Display name">
          <input
            value={settings.displayName}
            onChange={(e) => dispatch(setDisplayName(e.target.value))}
            className="settings-input"
            placeholder="Your name"
          />
        </Field>
      </section>

      <section className="card p-6 space-y-4">
        <div>
          <h2 className="font-display font-bold text-lg text-ink-50">
            AI tutor (NextSage)
          </h2>
          <p className="text-sm text-ink-300 mt-1">
            Bring your own OpenAI-compatible API key for richer, free-form
            conversations. Without a key, NextSage uses a curated offline
            knowledge base.
          </p>
        </div>

        <Field label="OpenAI API key">
          <div className="flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={settings.apiKey}
              onChange={(e) => dispatch(setApiKey(e.target.value))}
              placeholder="sk-..."
              className="settings-input flex-1 font-mono"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => setShowKey((v) => !v)}
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-[11px] text-ink-400 mt-1">
            Stored only in localStorage. Calls go directly from your browser to
            OpenAI.
          </p>
        </Field>

        <Field label="Model">
          <input
            value={settings.model}
            onChange={(e) => dispatch(setModel(e.target.value))}
            className="settings-input font-mono"
            placeholder="gpt-4o-mini"
          />
          <p className="text-[11px] text-ink-400 mt-1">
            Defaults to <code className="code-inline">gpt-4o-mini</code>. Any
            OpenAI chat model works.
          </p>
        </Field>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.shareLessonContext}
            onChange={(e) =>
              dispatch(setShareLessonContext(e.target.checked))
            }
            className="mt-1 accent-brand-400"
          />
          <span className="text-sm text-ink-200">
            Send my current lesson code as context to the AI.{" "}
            <span className="text-ink-400">
              (Helps NextSage debug your specific code.)
            </span>
          </span>
        </label>
      </section>

      <section className="card p-6 space-y-4">
        <div>
          <h2 className="font-display font-bold text-lg text-ink-50">
            Backend sync
          </h2>
          <p className="text-sm text-ink-300 mt-1">
            Mirror your progress to a MongoDB-backed server running on your
            machine. Survives clearing browser data, syncs across devices, and
            keeps every byte under your control. Off by default — the app works
            fully offline without it.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sync.enabled}
            onChange={(e) => dispatch(setEnabled(e.target.checked))}
            className="mt-1 accent-brand-400"
          />
          <span className="text-sm text-ink-200">
            <span className="font-semibold text-ink-50">
              Enable backend sync
            </span>
            <br />
            <span className="text-ink-400">
              Pushes after every change (debounced 800ms) and pulls on every
              load. Falls back to local-only when the server is unreachable.
            </span>
          </span>
        </label>

        <Field label="Backend URL">
          <div className="flex gap-2">
            <input
              value={sync.baseUrl}
              onChange={(e) => dispatch(setBaseUrl(e.target.value))}
              placeholder="http://localhost:4000"
              className="settings-input flex-1 font-mono"
              spellCheck={false}
            />
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={handleTestConnection}
            >
              {pinging === "ok"
                ? "✓ reachable"
                : pinging === "fail"
                  ? "✕ no reply"
                  : "Test"}
            </button>
          </div>
          <p className="text-[11px] text-ink-400 mt-1">
            Default <code className="code-inline">http://localhost:4000</code>.
            Run the server with{" "}
            <code className="code-inline">npm run dev:server</code>.
          </p>
        </Field>

        <Field label="Profile ID">
          <div className="flex gap-2">
            <input
              value={sync.profileId}
              onChange={(e) => dispatch(setProfileId(e.target.value.trim()))}
              className="settings-input flex-1 font-mono text-xs"
              spellCheck={false}
            />
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={handleCopyProfileId}
            >
              Copy
            </button>
          </div>
          <p className="text-[11px] text-ink-400 mt-1">
            This identifies your save on the server. Copy it onto another
            device to continue your quest there.
          </p>
        </Field>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Stat
            label="Status"
            value={statusLabel(sync.status, sync.enabled)}
          />
          <Stat
            label="Local revision"
            value={`${sync.revision} (server: ${sync.serverRevision})`}
          />
          <Stat
            label="Last synced"
            value={
              sync.lastSyncedAt
                ? new Date(sync.lastSyncedAt).toLocaleString()
                : "—"
            }
          />
          <Stat
            label="Last error"
            value={sync.lastError ?? "—"}
            tone={sync.lastError ? "warn" : undefined}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="btn-ghost text-xs"
            onClick={() => dispatch(resetSync())}
          >
            Reset sync counters
          </button>
        </div>
      </section>

      <section className="card p-6 space-y-4 border-rose-400/30">
        <h2 className="font-display font-bold text-lg text-ink-50">
          Danger zone
        </h2>
        <p className="text-sm text-ink-300">
          Wipe all progress (XP, badges, lesson completion, chat history). This
          cannot be undone.
        </p>
        {!confirmReset ? (
          <button
            className="btn-outline text-rose-200 border-rose-400/40 hover:border-rose-400"
            onClick={() => setConfirmReset(true)}
          >
            Reset everything
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="btn"
              style={{
                background: "rgb(244 63 94)",
                color: "white",
              }}
              onClick={() => {
                dispatch(resetProgress());
                dispatch(clearChat());
                setConfirmReset(false);
              }}
            >
              Yes — reset everything
            </button>
            <button
              className="btn-ghost"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      <style>{`
        .settings-input {
          width: 100%;
          background: rgba(7,8,21,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.6rem 0.9rem;
          color: var(--ink-100, #e6eaf5);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .settings-input:focus {
          border-color: rgba(117,213,255,0.5);
        }
      `}</style>
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="block text-[10px] uppercase tracking-wider font-mono text-ink-400 mb-1.5">
      {label}
    </span>
    {children}
  </label>
);

const Stat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn";
}) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
    <p className="text-[10px] uppercase tracking-wider font-mono text-ink-400">
      {label}
    </p>
    <p
      className={`text-sm mt-0.5 break-words ${
        tone === "warn" ? "text-amber-200" : "text-ink-100"
      }`}
    >
      {value}
    </p>
  </div>
);

function statusLabel(status: string, enabled: boolean): string {
  if (!enabled) return "Disabled";
  switch (status) {
    case "syncing":
      return "Syncing…";
    case "synced":
    case "idle":
      return "Synced";
    case "offline":
      return "Offline";
    case "error":
      return "Error";
    default:
      return status;
  }
}
