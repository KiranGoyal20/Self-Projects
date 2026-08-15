export type ContentBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; tone: "info" | "tip" | "warn"; text: string }
  | { kind: "code"; lang?: string; code: string }
  | { kind: "kbd"; text: string };

export type CheckRule =
  /** Pattern (regex source) must appear in the user's code. */
  | { kind: "regex"; pattern: string; flags?: string; message: string }
  /** Pattern (regex source) must NOT appear. */
  | { kind: "regexNot"; pattern: string; flags?: string; message: string }
  /** Substring must appear (case sensitive). */
  | { kind: "includes"; text: string; message: string }
  /** Substring must NOT appear. */
  | { kind: "excludes"; text: string; message: string }
  /** All listed substrings must appear. */
  | { kind: "all"; items: string[]; message: string }
  /** A simulated answer (for non-code lessons): exact match (case insensitive, trimmed). */
  | { kind: "answer"; answer: string; message: string };

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  /** Index of the correct option. */
  correct: number;
  explanation: string;
};

export type ExerciseKind = "code" | "quiz" | "fill";

export type Exercise =
  | {
      kind: "code";
      id: string;
      title: string;
      brief: string;
      starter: string;
      language: "tsx" | "ts" | "js" | "jsx" | "json" | "bash";
      filename?: string;
      checks: CheckRule[];
      /** Optional simulated preview generator: receives code text, returns HTML string (sandboxed display). */
      preview?: (code: string) => PreviewNode;
      solution: string;
      hints: string[];
    }
  | {
      kind: "quiz";
      id: string;
      title: string;
      questions: QuizQuestion[];
    }
  | {
      kind: "fill";
      id: string;
      title: string;
      brief: string;
      /** Sentence template with {{0}}, {{1}} ... placeholders */
      template: string;
      blanks: { answer: string; alternates?: string[] }[];
      hints: string[];
    };

/** A serializable virtual DOM node we render in the simulated browser preview. */
export type PreviewNode = {
  tag: string;
  props?: Record<string, string | undefined>;
  children?: (PreviewNode | string)[];
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  summary: string;
  /** Estimated minutes to complete. */
  minutes: number;
  /** XP awarded on completion. */
  xp: number;
  /** Content blocks shown in the lesson body. */
  content: ContentBlock[];
  /** Ordered exercises learner must complete (all required). */
  exercises: Exercise[];
  /** Optional badge to award upon completing this lesson. */
  badge?: string;
};

export type Chapter = {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  /** Tailwind gradient stops for accents */
  accent: string;
  lessons: Lesson[];
};
