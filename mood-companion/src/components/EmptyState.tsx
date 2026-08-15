import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: string;
}

export const EmptyState = ({ title, description, action, icon = "✨" }: Props) => (
  <div className="card p-12 flex flex-col items-center text-center">
    <div className="text-4xl mb-3 opacity-80">{icon}</div>
    <h3 className="heading text-lg text-ink-50">{title}</h3>
    {description && (
      <p className="text-sm text-ink-300 mt-2 max-w-sm">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
