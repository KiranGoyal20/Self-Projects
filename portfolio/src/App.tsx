import { ProjectCard } from "./components/ProjectCard";
import { AdminWidget } from "./components/widgets/AdminWidget";
import { AnalyticsWidget } from "./components/widgets/AnalyticsWidget";
import { CalendarWidget } from "./components/widgets/CalendarWidget";
import { MoodWidget } from "./components/widgets/MoodWidget";
import { OnboardingWidget } from "./components/widgets/OnboardingWidget";
import { QuestWidget } from "./components/widgets/QuestWidget";
import { projects, type ProjectId } from "./data/projects";
import type { ReactNode } from "react";

const widgets: Record<ProjectId, ReactNode> = {
  analytics: <AnalyticsWidget />,
  mood: <MoodWidget />,
  calendar: <CalendarWidget />,
  quest: <QuestWidget />,
  onboarding: <OnboardingWidget />,
  admin: <AdminWidget />,
};

export default function App() {
  return (
    <div className="relative min-h-screen">
      <div className="grain pointer-events-none absolute inset-0" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <p className="font-display text-lg font-semibold tracking-tight">Kiran Goyal</p>
        <p className="flex items-center gap-2 text-sm text-studio-300">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {projects.length} live apps
        </p>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <section className="max-w-2xl pb-10 pt-4 sm:pb-14 sm:pt-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#e8c39e]">
            Selected work
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            A gallery of products you can open.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-studio-200 sm:text-lg">
            Each tile is a live widget from an app I’ve shipped. Click anywhere on a card to
            launch it.
          </p>
        </section>

        <section
          aria-label="Projects"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project}>
              {widgets[project.id]}
            </ProjectCard>
          ))}
        </section>
      </main>

      <footer className="relative mx-auto max-w-6xl px-5 pb-10 text-sm text-studio-400 sm:px-8">
        Built as a portfolio surface for live Netlify apps. Click a widget to go to the product.
      </footer>
    </div>
  );
}
