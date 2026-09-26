export type ContentBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; tone: "info" | "tip" | "warn"; text: string }
  | { kind: "code"; lang?: string; code: string }
  | { kind: "kbd"; text: string };

export type CheckRule =
  | { kind: "regex"; pattern: string; flags?: string; message: string }
  | { kind: "regexNot"; pattern: string; flags?: string; message: string }
  | { kind: "includes"; text: string; message: string }
  | { kind: "excludes"; text: string; message: string }
  | { kind: "all"; items: string[]; message: string }
  | { kind: "answer"; answer: string; message: string };

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
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
      template: string;
      blanks: { answer: string; alternates?: string[] }[];
      hints: string[];
    };

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
  minutes: number;
  xp: number;
  content: ContentBlock[];
  exercises: Exercise[];
  badge?: string;
};

export type Chapter = {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  accent: string;
  lessons: Lesson[];
};
