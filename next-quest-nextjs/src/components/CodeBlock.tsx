"use client";
import { useState, type ReactElement } from "react";

type Props = {
  code: string;
  language: string;
};

export const CodeBlock = ({ code, language }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-ink-900/70">
      <div className="flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-wider border-b border-white/5 bg-white/[0.03]">
        <span className="font-mono text-ink-400">{language}</span>
        <button
          onClick={handleCopy}
          className="text-ink-300 hover:text-brand-200 transition-colors"
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre className="p-4 text-[13px] leading-relaxed font-mono text-ink-100 overflow-x-auto">
        <code>{tokenize(code)}</code>
      </pre>
    </div>
  );
};

function tokenize(code: string): ReactElement[] {
  const out: ReactElement[] = [];
  const keywords = new Set([
    "import", "from", "export", "default", "const", "let", "var", "function",
    "return", "async", "await", "if", "else", "for", "while", "true", "false",
    "null", "undefined", "new", "class", "extends", "this", "type", "interface",
    "as", "in", "of",
  ]);
  const tokenRe =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|([{}()[\]<>;:,.=+\-*/!?&|]+)|(\s+)|([^\s])/g;
  let i = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = tokenRe.exec(code))) {
    if (m.index > i) {
      out.push(<span key={key++}>{code.slice(i, m.index)}</span>);
    }
    i = m.index + m[0].length;
    if (m[1]) {
      out.push(<span key={key++} className="text-ink-400 italic">{m[0]}</span>);
    } else if (m[2]) {
      out.push(<span key={key++} className="text-emerald-300">{m[0]}</span>);
    } else if (m[3]) {
      out.push(<span key={key++} className="text-amber-300">{m[0]}</span>);
    } else if (m[4]) {
      if (keywords.has(m[0])) {
        out.push(<span key={key++} className="text-violet-300">{m[0]}</span>);
      } else if (/^[A-Z]/.test(m[0])) {
        out.push(<span key={key++} className="text-brand-200">{m[0]}</span>);
      } else {
        out.push(<span key={key++}>{m[0]}</span>);
      }
    } else if (m[5]) {
      out.push(<span key={key++} className="text-pink-300">{m[0]}</span>);
    } else {
      out.push(<span key={key++}>{m[0]}</span>);
    }
  }
  if (i < code.length) {
    out.push(<span key={key++}>{code.slice(i)}</span>);
  }
  return out;
}
