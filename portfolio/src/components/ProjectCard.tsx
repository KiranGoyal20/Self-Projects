import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Project } from "../data/projects";

type Props = {
  project: Project;
  children: ReactNode;
};

export function ProjectCard({ project, children }: Props) {
  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.name}`}
      className={`group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 outline-none transition-colors hover:border-white/25 focus-visible:ring-2 focus-visible:ring-[#e8c39e] sm:min-h-[380px] sm:p-4 ${project.span}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <div className="mb-3 flex items-start justify-between gap-3 px-1">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-studio-300">
            {project.product}
          </p>
          <h2 className="font-display text-xl font-semibold tracking-tight text-studio-50 sm:text-2xl">
            {project.name}
          </h2>
          <p className="mt-1 max-w-md text-sm text-studio-200">{project.tagline}</p>
        </div>
        <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-studio-100 transition group-hover:border-[#e8c39e]/40 group-hover:text-[#e8c39e]">
          Open
          <span aria-hidden>↗</span>
        </span>
      </div>

      <div className="min-h-0 flex-1 pointer-events-none">{children}</div>

      <div className="mt-3 flex flex-wrap gap-1.5 px-1">
        {project.stack.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  );
}
