import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SyncStatus =
  | "idle"
  | "offline"
  | "syncing"
  | "synced"
  | "error"
  | "disabled";

export type SyncState = {
  /** Stable user id for this browser/profile. Generated once on first run. */
  profileId: string;
  /** Has the user explicitly enabled backend sync? */
  enabled: boolean;
  /** Base URL of the backend. */
  baseUrl: string;
  /** Monotonic counter; bumped on every state mutation. */
  revision: number;
  /** Revision the server last accepted (we know remote is at-least this). */
  serverRevision: number;
  /** ISO timestamp of last successful sync. */
  lastSyncedAt?: string;
  /** Reachability/status. */
  status: SyncStatus;
  /** Last error message (for UI). */
  lastError?: string;
};

function makeProfileId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

const initialState: SyncState = {
  profileId: makeProfileId(),
  enabled: false,
  baseUrl: "http://localhost:4000",
  revision: 0,
  serverRevision: 0,
  status: "disabled",
};

const slice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    /** Increment our local revision; called whenever progress/chat/settings change. */
    bumpRevision(state) {
      state.revision += 1;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.enabled = action.payload;
      state.status = action.payload ? "idle" : "disabled";
      if (!action.payload) state.lastError = undefined;
    },
    setBaseUrl(state, action: PayloadAction<string>) {
      state.baseUrl = action.payload.replace(/\/+$/, "");
    },
    setProfileId(state, action: PayloadAction<string>) {
      state.profileId = action.payload;
    },
    setStatus(
      state,
      action: PayloadAction<{ status: SyncStatus; error?: string }>,
    ) {
      state.status = action.payload.status;
      state.lastError = action.payload.error;
    },
    markSynced(
      state,
      action: PayloadAction<{ serverRevision: number; at: string }>,
    ) {
      state.serverRevision = action.payload.serverRevision;
      state.lastSyncedAt = action.payload.at;
      state.status = "synced";
      state.lastError = undefined;
    },
    /** Used after we accept the server's copy (remote was newer). */
    acceptServerRevision(state, action: PayloadAction<number>) {
      state.revision = action.payload;
      state.serverRevision = action.payload;
      state.status = "synced";
    },
    resetSync(state) {
      state.revision = 0;
      state.serverRevision = 0;
      state.lastSyncedAt = undefined;
      state.lastError = undefined;
      state.status = state.enabled ? "idle" : "disabled";
    },
  },
});

export const {
  bumpRevision,
  setEnabled,
  setBaseUrl,
  setProfileId,
  setStatus,
  markSynced,
  acceptServerRevision,
  resetSync,
} = slice.actions;

export default slice.reducer;
