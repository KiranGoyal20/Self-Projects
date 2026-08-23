export type ProjectId =
  | "analytics"
  | "onboarding"
  | "mood"
  | "calendar"
  | "quest"
  | "admin";

export type Project = {
  id: ProjectId;
  name: string;
  product: string;
  tagline: string;
  href: string;
  stack: string[];
  span: string;
};

export const projects: Project[] = [
  {
    id: "analytics",
    name: "Analytics Dashboard",
    product: "Ops insights",
    tagline: "KPIs, Highcharts, and a draggable widget grid across sales and traffic.",
    href: "https://analytics-dashboard20.netlify.app/",
    stack: ["React", "MUI", "Highcharts"],
    span: "lg:col-span-7 lg:row-span-2",
  },
  {
    id: "mood",
    name: "Mood Companion",
    product: "Music & movies",
    tagline: "Quiz, journal, and sentiment — then a soundtrack for how you feel.",
    href: "https://mood-companion.netlify.app/",
    stack: ["React", "Redux", "Tailwind"],
    span: "lg:col-span-5 lg:row-span-2",
  },
  {
    id: "calendar",
    name: "Morrow",
    product: "Team calendar",
    tagline: "Shared week view, invitations, and per-member calendars.",
    href: "https://meeting-calender-app.netlify.app/",
    stack: ["Next.js", "TypeScript"],
    span: "lg:col-span-6",
  },
  {
    id: "quest",
    name: "Next.Quest",
    product: "Learn by playing",
    tagline: "Lessons, in-browser exercises, XP, and an AI tutor for Next.js.",
    href: "https://nextjs-quest.netlify.app/",
    stack: ["React", "Redux", "CodeMirror"],
    span: "lg:col-span-6",
  },
  {
    id: "onboarding",
    name: "Benefits Enrollment",
    product: "Onboarding flow",
    tagline: "Eight-step application with progress, validation, and saved state.",
    href: "https://onboarding-flow-app.netlify.app/",
    stack: ["React", "Multi-step form"],
    span: "lg:col-span-5",
  },
  {
    id: "admin",
    name: "Exchange Admin",
    product: "Control center",
    tagline: "Providers, consumers, roles, and inbox — search and create from one console.",
    href: "https://exchange-admin-panel.netlify.app/",
    stack: ["React", "Chakra UI"],
    span: "lg:col-span-7",
  },
];
