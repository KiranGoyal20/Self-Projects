import type { Chapter, Lesson } from "../types/curriculum";
import { foundationsChapter } from "./chapters/01-foundations";
import { routingChapter } from "./chapters/02-routing";
import { componentsChapter } from "./chapters/03-components";
import { dataChapter } from "./chapters/04-data";
import { serverChapter } from "./chapters/05-server";
import { shipChapter } from "./chapters/06-ship";

export const chapters: Chapter[] = [
  foundationsChapter,
  routingChapter,
  componentsChapter,
  dataChapter,
  serverChapter,
  shipChapter,
];

export type LessonRef = {
  chapter: Chapter;
  lesson: Lesson;
  globalIndex: number;
};

export const flatLessons: LessonRef[] = chapters.flatMap((chapter, ci) =>
  chapter.lessons.map((lesson, li) => ({
    chapter,
    lesson,
    globalIndex:
      chapters.slice(0, ci).reduce((sum, c) => sum + c.lessons.length, 0) + li,
  })),
);

export const totalLessons = flatLessons.length;

export const totalXp = flatLessons.reduce(
  (sum, l) => sum + l.lesson.xp,
  0,
);

export function findLesson(slug: string): LessonRef | undefined {
  return flatLessons.find((r) => r.lesson.slug === slug);
}

export function nextLesson(slug: string): LessonRef | undefined {
  const i = flatLessons.findIndex((r) => r.lesson.slug === slug);
  return i >= 0 && i < flatLessons.length - 1 ? flatLessons[i + 1] : undefined;
}

export function prevLesson(slug: string): LessonRef | undefined {
  const i = flatLessons.findIndex((r) => r.lesson.slug === slug);
  return i > 0 ? flatLessons[i - 1] : undefined;
}

export const allBadges: { id: string; lessonSlug: string }[] = flatLessons
  .filter((r) => !!r.lesson.badge)
  .map((r) => ({ id: r.lesson.badge!, lessonSlug: r.lesson.slug }));
