import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { applyRemoteSnapshot } from "../sync/applyRemote";

export type SettingsState = {
  /** User's display name. */
  displayName: string;
  /** Optional OpenAI-compatible API key for the AI tutor. Stored locally only. */
  apiKey: string;
  /** Model name; defaults to gpt-4o-mini for cost. */
  model: string;
  /** Whether to send the current lesson code as additional context to the AI. */
  shareLessonContext: boolean;
  /** Has the user dismissed onboarding? */
  onboarded: boolean;
};

const initialState: SettingsState = {
  displayName: "Quester",
  apiKey: "",
  model: "gpt-4o-mini",
  shareLessonContext: true,
  onboarded: false,
};

const slice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setDisplayName(state, action: PayloadAction<string>) {
      state.displayName = action.payload.trim().slice(0, 32) || "Quester";
    },
    setApiKey(state, action: PayloadAction<string>) {
      state.apiKey = action.payload.trim();
    },
    setModel(state, action: PayloadAction<string>) {
      state.model = action.payload.trim() || "gpt-4o-mini";
    },
    setShareLessonContext(state, action: PayloadAction<boolean>) {
      state.shareLessonContext = action.payload;
    },
    markOnboarded(state) {
      state.onboarded = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyRemoteSnapshot, (state, action) => {
      const incoming = action.payload.settings;
      if (!incoming) return;
      if (incoming.displayName !== undefined) state.displayName = incoming.displayName;
      if (incoming.model !== undefined) state.model = incoming.model;
      if (incoming.shareLessonContext !== undefined)
        state.shareLessonContext = incoming.shareLessonContext;
      if (incoming.onboarded !== undefined) state.onboarded = incoming.onboarded;
      // NOTE: deliberately NOT syncing apiKey from remote — keep secrets per-browser.
    });
  },
});

export const {
  setDisplayName,
  setApiKey,
  setModel,
  setShareLessonContext,
  markOnboarded,
} = slice.actions;
export default slice.reducer;
