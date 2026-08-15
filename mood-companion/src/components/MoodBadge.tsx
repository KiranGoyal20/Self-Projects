import type { Mood } from "../types/domain";

interface Props {
  mood: Mood;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeMap = {
  sm: "h-8 w-8 text-sm",
  md: "h-12 w-12 text-xl",
  lg: "h-16 w-16 text-2xl",
};

export const MoodBadge = ({ mood, size = "md", showLabel = false }: Props) => (
  <div className="inline-flex items-center gap-3">
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${mood.gradient} shadow-card ${sizeMap[size]}`}
      title={mood.label}
      aria-label={mood.label}
    >
      <span>{mood.emoji}</span>
    </div>
    {showLabel && (
      <div className="flex flex-col">
        <span className="font-display font-semibold text-ink-50">
          {mood.label}
        </span>
        <span className="text-xs text-ink-300">{mood.tagline}</span>
      </div>
    )}
  </div>
);
