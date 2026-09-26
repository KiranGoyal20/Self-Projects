"use client";
import { useEffect, useRef, useState, type ReactElement } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addMessage,
  clearChat,
  setPending,
  type ChatMessage,
} from "@/features/chat/chatSlice";
import { callOpenAi, fallbackTutor } from "@/utils/aiTutor";
import { flatLessons } from "@/data/curriculum";

const suggestions = [
  "What's a Server Component, in plain English?",
  "When should I use 'use client'?",
  "Explain dynamic routes with an example.",
  "How does fetch caching work in Next.js?",
  "What's the difference between layout.tsx and template.tsx?",
  "Show me a minimal Server Action.",
];

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((s) => s.chat.messages);
  const pending = useAppSelector((s) => s.chat.pending);
  const settings = useAppSelector((s) => s.settings);
  const progress = useAppSelector((s) => s.progress.lessons);

  const [input, setInput] = useState("");
  const [activeLessonSlug, setActiveLessonSlug] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeLesson = activeLessonSlug
    ? flatLessons.find((r) => r.lesson.slug === activeLessonSlug)?.lesson
    : undefined;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const handleSend = async (text: string) => {
    const content = text.trim();
    if (!content || pending) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      lessonSlug: activeLessonSlug || undefined,
      timestamp: Date.now(),
    };
    dispatch(addMessage(userMsg));
    dispatch(setPending(true));

    try {
      let reply: string;
      if (settings.apiKey) {
        const lessonCode =
          settings.shareLessonContext && activeLessonSlug
            ? progress[activeLessonSlug]?.code
            : undefined;
        reply = await callOpenAi({
          apiKey: settings.apiKey,
          model: settings.model || "gpt-4o-mini",
          messages: [...messages, userMsg],
          lesson: activeLesson,
          lessonCode,
        });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        reply = fallbackTutor(content, activeLesson);
      }

      dispatch(
        addMessage({
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
          lessonSlug: activeLessonSlug || undefined,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? `**Error calling the AI:** ${err.message}\n\nDouble-check your API key in Settings, or remove it to use the built-in tutor.`
          : "Something went wrong calling the AI.";
      dispatch(
        addMessage({ id: `e-${Date.now()}`, role: "assistant", content: msg, timestamp: Date.now() })
      );
    } finally {
      dispatch(setPending(false));
    }
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6 max-w-5xl">
      <aside className="space-y-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-400 via-neon-violet to-neon-pink flex items-center justify-center text-lg">🧙</div>
            <div>
              <p className="font-display font-bold text-ink-50">NextSage</p>
              <p className="text-[10px] uppercase tracking-wider font-mono text-ink-400">
                {settings.apiKey ? "Live · OpenAI" : "Offline · built-in"}
              </p>
            </div>
          </div>
          {!settings.apiKey && (
            <p className="text-xs text-ink-300 leading-relaxed">
              I'll answer from a built-in knowledge base. For deeper, free-form conversations, add an OpenAI key in{" "}
              <Link href="/settings" className="text-brand-300 hover:text-brand-200">Settings</Link>.
            </p>
          )}
          {settings.apiKey && (
            <p className="text-xs text-ink-300 leading-relaxed">
              Routing through model <code className="code-inline">{settings.model}</code>. Your key stays in this browser only.
            </p>
          )}
        </div>

        <div className="card p-4">
          <label className="text-[10px] uppercase tracking-wider font-mono text-ink-400">
            Lesson context
          </label>
          <select
            value={activeLessonSlug}
            onChange={(e) => setActiveLessonSlug(e.target.value)}
            className="mt-2 w-full bg-ink-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-ink-100"
          >
            <option value="">— No specific lesson —</option>
            {flatLessons.map((r) => (
              <option key={r.lesson.id} value={r.lesson.slug}>
                {r.chapter.title} · {r.lesson.title}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-ink-400 mt-2">
            Pick a lesson and I'll tie my answers back to it.
          </p>
        </div>

        <div className="card p-4">
          <p className="text-[10px] uppercase tracking-wider font-mono text-ink-400 mb-2">Try asking</p>
          <div className="flex flex-col gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                className="text-left text-xs text-ink-200 hover:text-brand-200 rounded-lg px-2 py-1.5 hover:bg-white/5"
                onClick={() => handleSend(s)}
              >
                → {s}
              </button>
            ))}
          </div>
        </div>

        {messages.length > 0 && (
          <button className="btn-ghost w-full text-xs" onClick={() => dispatch(clearChat())}>
            🧹 Clear chat
          </button>
        )}
      </aside>

      <section className="card flex flex-col h-[calc(100vh-12rem)] min-h-[520px]">
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-ink-50">Chat with NextSage</p>
            <p className="text-[11px] text-ink-400">
              {activeLesson ? `Context: ${activeLesson.title}` : "General chat"}
            </p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🧙‍♂️</div>
              <p className="font-display text-lg text-ink-100">Ask me anything about Next.js.</p>
              <p className="text-sm text-ink-300 mt-1 max-w-md mx-auto">
                I know the App Router, Server Components, Server Actions, caching, deployment — and I can connect ideas back to your current lesson.
              </p>
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-brand-500/80 to-neon-violet/80 text-white"
                      : "bg-white/[0.05] border border-white/10 text-ink-100"
                  }`}
                >
                  <Markdownish text={m.content} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {pending && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-white/[0.05] border border-white/10 text-ink-300">
                <span className="inline-flex gap-1.5">
                  <Dot delay={0} /><Dot delay={0.12} /><Dot delay={0.24} />
                </span>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="px-4 py-3 border-t border-white/5 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Server Components, dynamic routes, anything…"
            className="flex-1 bg-ink-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ink-100 placeholder-ink-400 focus:outline-none focus:border-brand-300/60"
          />
          <button type="submit" disabled={!input.trim() || pending} className="btn-primary">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

const Dot = ({ delay }: { delay: number }) => (
  <motion.span
    className="h-1.5 w-1.5 rounded-full bg-ink-300 inline-block"
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 0.8, repeat: Infinity, delay }}
  />
);

const Markdownish = ({ text }: { text: string }) => {
  const parts: (string | ReactElement)[] = [];
  const re = /```([a-z]*)\n([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(...inline(text.slice(last, m.index), key++));
    parts.push(
      <pre key={`pre-${key++}`} className="my-2 p-3 rounded-lg bg-black/40 border border-white/10 overflow-x-auto text-[12.5px] font-mono text-ink-100">
        <code>{m[2].trimEnd()}</code>
      </pre>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(...inline(text.slice(last), key++));
  return <>{parts}</>;
};

function inline(text: string, key: number): (string | ReactElement)[] {
  const out: (string | ReactElement)[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let kk = key * 100;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      out.push(<strong key={kk++} className="font-semibold text-ink-50">{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      out.push(<code key={kk++} className="code-inline">{m[3]}</code>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
