import { createAction } from "@reduxjs/toolkit";
import type { ProgressState } from "../progress/progressSlice";
import type { ChatState } from "../chat/chatSlice";
import type { SettingsState } from "../settings/settingsSlice";

/**
 * Cross-slice action emitted by the SyncEngine when the server has a newer
 * snapshot than the local one. Each slice picks out its own piece in
 * `extraReducers`. Sync slice metadata (revision, profileId, etc.) is NOT
 * overwritten by this action — it's handled separately.
 */
export type RemoteSnapshot = {
  progress?: ProgressState;
  chat?: ChatState;
  settings?: Partial<SettingsState>;
};

export const applyRemoteSnapshot = createAction<RemoteSnapshot>(
  "sync/applyRemote",
);
