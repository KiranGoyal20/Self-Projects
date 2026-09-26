import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { applyRemoteSnapshot } from "@/features/sync/applyRemote";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  lessonSlug?: string;
  timestamp: number;
};

export type ChatState = {
  messages: ChatMessage[];
  pending: boolean;
};

const initialState: ChatState = {
  messages: [],
  pending: false,
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setPending(state, action: PayloadAction<boolean>) {
      state.pending = action.payload;
    },
    clearChat(state) {
      state.messages = [];
      state.pending = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyRemoteSnapshot, (state, action) => {
      const incoming = action.payload.chat;
      if (!incoming) return;
      state.messages = incoming.messages ?? state.messages;
      state.pending = false;
    });
  },
});

export const { addMessage, setPending, clearChat } = slice.actions;
export default slice.reducer;
