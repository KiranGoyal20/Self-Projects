import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

type Props = {
  value: string;
  onChange: (next: string) => void;
  language: "tsx" | "ts" | "js" | "jsx" | "json" | "bash";
  filename?: string;
  height?: number | string;
  readOnly?: boolean;
};

const baseTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    color: "#e6eaf5",
    fontSize: "13.5px",
  },
  ".cm-content": {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    padding: "12px 0",
  },
  ".cm-line": {
    padding: "0 14px",
  },
  ".cm-gutters": {
    backgroundColor: "rgba(255,255,255,0.02)",
    border: "none",
    color: "#6f779e",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "#9ba3c2",
  },
  ".cm-cursor": { borderLeftColor: "#75d5ff" },
});

export const CodeEditor = ({
  value,
  onChange,
  language,
  filename,
  height = 320,
  readOnly,
}: Props) => {
  const langJs =
    language === "tsx" || language === "ts"
      ? javascript({ jsx: language === "tsx", typescript: true })
      : language === "jsx"
        ? javascript({ jsx: true })
        : javascript();

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/60 overflow-hidden">
      {filename && (
        <div className="px-4 py-2 flex items-center justify-between text-xs border-b border-white/5 bg-white/[0.03]">
          <span className="font-mono text-ink-300">{filename}</span>
          <span className="font-mono uppercase tracking-wider text-[10px] text-ink-400">
            {language}
          </span>
        </div>
      )}
      <CodeMirror
        value={value}
        height={typeof height === "number" ? `${height}px` : height}
        theme={[oneDark, baseTheme]}
        extensions={[langJs, EditorView.lineWrapping]}
        readOnly={readOnly}
        basicSetup={{
          highlightActiveLine: true,
          highlightActiveLineGutter: false,
          foldGutter: false,
          autocompletion: false,
          searchKeymap: false,
        }}
        onChange={onChange}
      />
    </div>
  );
};
