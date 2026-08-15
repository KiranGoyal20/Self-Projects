import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DiscoverTab = "music" | "movies" | "both";

export interface PreferencesState {
  preferredTab: DiscoverTab;
  /** First-time-user onboarded */
  onboarded: boolean;
  userName: string;
}

const initialState: PreferencesState = {
  preferredTab: "both",
  onboarded: false,
  userName: "",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setPreferredTab(state, action: PayloadAction<DiscoverTab>) {
      state.preferredTab = action.payload;
    },
    setOnboarded(state, action: PayloadAction<boolean>) {
      state.onboarded = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
  },
});

export const { setPreferredTab, setOnboarded, setUserName } = preferencesSlice.actions;
export default preferencesSlice.reducer;
