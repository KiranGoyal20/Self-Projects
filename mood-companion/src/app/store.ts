import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import moodReducer from "../features/mood/moodSlice";
import historyReducer from "../features/history/historySlice";
import preferencesReducer from "../features/preferences/preferencesSlice";

const rootReducer = combineReducers({
  mood: moodReducer,
  history: historyReducer,
  preferences: preferencesReducer,
});

const persistedReducer = persistReducer(
  {
    key: "mood-companion",
    version: 1,
    storage,
    // mood is transient session state; we don't want to rehydrate it
    blacklist: ["mood"],
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
