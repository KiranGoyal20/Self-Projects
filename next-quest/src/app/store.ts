import {
  combineReducers,
  configureStore,
  isAnyOf,
  createListenerMiddleware,
  type TypedStartListening,
} from "@reduxjs/toolkit";
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
import progressReducer, {
  completeExercise,
  saveCode,
  visit,
  resetProgress,
  dismissNotification,
  clearNotifications,
} from "../features/progress/progressSlice";
import chatReducer, {
  addMessage,
  clearChat,
} from "../features/chat/chatSlice";
import settingsReducer, {
  markOnboarded,
  setApiKey,
  setDisplayName,
  setModel,
  setShareLessonContext,
} from "../features/settings/settingsSlice";
import syncReducer, { bumpRevision } from "../features/sync/syncSlice";

const rootReducer = combineReducers({
  progress: progressReducer,
  chat: chatReducer,
  settings: settingsReducer,
  sync: syncReducer,
});

const persistConfig = {
  key: "next-quest",
  version: 1,
  storage,
  blacklist: [],
};

const persisted = persistReducer(persistConfig, rootReducer);

export const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

/**
 * Whenever a "meaningful" mutation happens, bump the sync revision.
 * The sync engine watches this and pushes to the backend (debounced) if enabled.
 *
 * We intentionally exclude purely-cosmetic actions (notifications, visit, code typing-by-keystroke)
 * to avoid spamming the backend. saveCode IS included but the sync engine debounces.
 */
startAppListening({
  matcher: isAnyOf(
    completeExercise,
    saveCode,
    visit,
    addMessage,
    clearChat,
    setDisplayName,
    setApiKey,
    setModel,
    setShareLessonContext,
    markOnboarded,
    resetProgress,
  ),
  effect: (_action, api) => {
    api.dispatch(bumpRevision());
  },
});

// Allow notification & sync actions to flow without bumping revision.
void dismissNotification;
void clearNotifications;
