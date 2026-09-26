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
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import progressReducer, {
  completeExercise,
  saveCode,
  visit,
  resetProgress,
  dismissNotification,
  clearNotifications,
} from "@/features/progress/progressSlice";
import chatReducer, {
  addMessage,
  clearChat,
} from "@/features/chat/chatSlice";
import settingsReducer, {
  markOnboarded,
  setApiKey,
  setDisplayName,
  setModel,
  setShareLessonContext,
} from "@/features/settings/settingsSlice";
import syncReducer, { bumpRevision } from "@/features/sync/syncSlice";

// SSR-safe storage: falls back to a no-op on the server
function createNoopStorage() {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
}

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

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
};

const persisted = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore() {
  const listenerMiddleware = createListenerMiddleware();
  type AppStartListening = TypedStartListening<RootState, AppDispatch>;
  const startAppListening =
    listenerMiddleware.startListening as AppStartListening;

  const store = configureStore({
    reducer: persisted,
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).prepend(listenerMiddleware.middleware),
  });

  const persistor = persistStore(store);

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
      resetProgress
    ),
    effect: (_action, api) => {
      api.dispatch(bumpRevision());
    },
  });

  void dismissNotification;
  void clearNotifications;

  return { store, persistor };
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = ReturnType<typeof makeStore>["store"]["dispatch"];
