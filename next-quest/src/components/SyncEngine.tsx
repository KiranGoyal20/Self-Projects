import { useEffect, useRef } from "react";
import { useStore } from "react-redux";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { RootState } from "../app/store";
import {
  acceptServerRevision,
  markSynced,
  setStatus,
} from "../features/sync/syncSlice";
import { applyRemoteSnapshot } from "../features/sync/applyRemote";
import {
  checkHealth,
  fetchProfile,
  putProfile,
  type RemoteProfile,
} from "../utils/syncClient";

const PUSH_DEBOUNCE_MS = 800;
const HEALTH_INTERVAL_MS = 15000;

/**
 * Background sync loop. Renders nothing.
 *
 *   1. When enabled, ping /api/health.
 *   2. Pull remote profile. If newer, replace local state via applyRemoteSnapshot.
 *      Otherwise push local up.
 *   3. Listen for revision bumps and push (debounced).
 *   4. Re-check health on a timer to flip the indicator.
 */
export const SyncEngine = () => {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();

  const enabled = useAppSelector((s) => s.sync.enabled);
  const baseUrl = useAppSelector((s) => s.sync.baseUrl);
  const profileId = useAppSelector((s) => s.sync.profileId);
  const revision = useAppSelector((s) => s.sync.revision);

  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushedRev = useRef<number>(-1);
  const initialDone = useRef<boolean>(false);

  const applyRemote = (remote: RemoteProfile) => {
    const s = (remote.state ?? {}) as {
      progress?: RootState["progress"];
      chat?: RootState["chat"];
      settings?: Partial<RootState["settings"]>;
    };
    dispatch(
      applyRemoteSnapshot({
        progress: s.progress,
        chat: s.chat,
        settings: s.settings,
      }),
    );
  };

  const pushNow = async () => {
    const state = store.getState();
    const myRev = state.sync.revision;
    if (myRev === lastPushedRev.current) return;
    lastPushedRev.current = myRev;

    dispatch(setStatus({ status: "syncing" }));

    const stateToPush = {
      progress: state.progress,
      chat: state.chat,
      settings: { ...state.settings, apiKey: "" }, // never persist API key remotely
    };

    const result = await putProfile(baseUrl, profileId, {
      revision: myRev,
      state: stateToPush,
      displayName: state.settings.displayName,
    });

    if (result.ok) {
      dispatch(
        markSynced({ serverRevision: result.revision, at: result.updatedAt }),
      );
    } else if (result.reason === "stale") {
      applyRemote(result.server);
      dispatch(acceptServerRevision(result.server.revision));
    } else {
      dispatch(setStatus({ status: "offline", error: result.error }));
    }
  };

  // Initial pull + periodic health check.
  useEffect(() => {
    if (!enabled) {
      dispatch(setStatus({ status: "disabled" }));
      initialDone.current = false;
      lastPushedRev.current = -1;
      return;
    }

    let cancelled = false;

    const runInitial = async () => {
      dispatch(setStatus({ status: "syncing" }));
      const ok = await checkHealth(baseUrl);
      if (cancelled) return;
      if (!ok) {
        dispatch(
          setStatus({
            status: "offline",
            error: `Cannot reach ${baseUrl}`,
          }),
        );
        return;
      }

      let remote: RemoteProfile | null = null;
      try {
        remote = await fetchProfile(baseUrl, profileId);
      } catch (err) {
        if (!cancelled) {
          dispatch(
            setStatus({
              status: "error",
              error: err instanceof Error ? err.message : String(err),
            }),
          );
        }
        return;
      }
      if (cancelled) return;

      const localRev = store.getState().sync.revision;
      if (remote && remote.revision > localRev) {
        applyRemote(remote);
        dispatch(acceptServerRevision(remote.revision));
      } else {
        await pushNow();
      }
      initialDone.current = true;
    };

    runInitial();

    const interval = setInterval(async () => {
      if (cancelled) return;
      const ok = await checkHealth(baseUrl);
      if (cancelled) return;
      const current = store.getState().sync.status;
      if (!ok && current !== "offline") {
        dispatch(
          setStatus({
            status: "offline",
            error: `Cannot reach ${baseUrl}`,
          }),
        );
      } else if (ok && current === "offline") {
        // Came back online — push pending changes.
        initialDone.current = true;
        pushNow();
      }
    }, HEALTH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, baseUrl, profileId]);

  // Debounced push whenever revision bumps.
  useEffect(() => {
    if (!enabled || !initialDone.current) return;
    if (revision === lastPushedRev.current) return;

    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      pushNow();
    }, PUSH_DEBOUNCE_MS);

    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision, enabled]);

  return null;
};
