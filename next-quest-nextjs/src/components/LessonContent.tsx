import type { ReactElement } from "react";
import type { ContentBlock } from "@/types/curriculum";
import { CodeBlock } from "./CodeBlock";

type Props = {
  blocks: ContentBlock[];
};

export const LessonContent = ({ blocks }: Props) => (
  <div className="space-y-4">
    {blocks.map((block, i) => {
      switch (block.kind) {
        case "h":
          return (
            <h3
              key={i}
              className="font-display text-lg font-bold tracking-tight text-ink-50 mt-6 first:mt-0"
            >
              {block.text}
            </h3>
          );
        case "p":
          return (
            <p key={i} className="text-ink-200 leading-relaxed">
              {renderInline(block.text)}
            </p>
          );
        case "list":
          return (
            <ul key={i} className="space-y-2 text-ink-200">
              {block.items.map((item, ii) => (
                <li key={ii} className="flex gap-2 leading-relaxed">
                  <span className="text-brand-300 mt-1">▸</span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        case "callout":
          return (
            <div
              key={i}
              className={`rounded-xl p-4 border text-sm leading-relaxed ${
                block.tone === "info"
                  ? "border-brand-400/30 bg-brand-500/10 text-brand-100"
                  : block.tone === "tip"
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                  : "border-amber-400/30 bg-amber-500/10 text-amber-100"
              }`}
            >
              <span className="font-semibold uppercase tracking-wider text-[10px] mr-2 opacity-80">
                {block.tone === "info"
                  ? "ℹ Info"
                  : block.tone === "tip"
                  ? "💡 Tip"
                  : "⚠ Heads up"}
              </span>
              {renderInline(block.text)}
            </div>
          );
        case "code":
          return (
            <CodeBlock key={i} code={block.code} language={block.lang ?? "tsx"} />
          );
        case "kbd":
          return (
            <kbd
              key={i}
              className="inline-block px-2 py-0.5 rounded-md border border-white/15 bg-white/5 font-mono text-xs text-ink-100"
            >
              {block.text}
            </kbd>
          );
      }
    })}
  </div>
);

function renderInline(text: string) {
  const parts: (string | ReactElement)[] = [];
  const re = /`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <code key={key++} className="code-inline">
        {m[1]}
      </code>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
