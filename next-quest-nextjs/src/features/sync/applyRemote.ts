import { createAction } from "@reduxjs/toolkit";
import type { ProgressState } from "@/features/progress/progressSlice";
import type { ChatState } from "@/features/chat/chatSlice";
import type { SettingsState } from "@/features/settings/settingsSlice";

export type RemoteSnapshot = {
  progress?: ProgressState;
  chat?: ChatState;
  settings?: Partial<SettingsState>;
};

export const applyRemoteSnapshot = createAction<RemoteSnapshot>(
  "sync/applyRemote"
);
