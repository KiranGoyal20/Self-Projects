import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MOODS } from "../data/moods";
import type { MoodEntry } from "../types/domain";
import { daysAgo } from "../utils/dates";

interface Props {
  entries: MoodEntry[];
  days?: number;
}

interface Point {
  date: string;
  label: string;
  valence: number | null;
  energy: number | null;
  emoji: string | null;
}

export const MoodTrendChart = ({ entries, days = 14 }: Props) => {
  const data = useMemo<Point[]>(() => {
    const points: Point[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = daysAgo(i);
      const key = d.toISOString().slice(0, 10);
      const dayEntries = entries.filter(
        (e) => e.createdAt.slice(0, 10) === key
      );
      if (dayEntries.length === 0) {
        points.push({
          date: key,
          label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          valence: null,
          energy: null,
          emoji: null,
        });
        continue;
      }
      const avgVal =
        dayEntries.reduce((s, e) => s + MOODS[e.moodId].valence, 0) /
        dayEntries.length;
      const avgEn =
        dayEntries.reduce((s, e) => s + MOODS[e.moodId].energy, 0) /
        dayEntries.length;
      const lastMood = dayEntries[0].moodId;
      points.push({
        date: key,
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        valence: Math.round(avgVal),
        energy: Math.round(avgEn),
        emoji: MOODS[lastMood].emoji,
      });
    }
    return points;
  }, [entries, days]);

  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="heading text-lg text-ink-50">
          Last {days} days
        </h3>
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
            Pleasantness
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Energy
          </span>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="valence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e879f9" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#e879f9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="energy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.35)"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="rgba(255,255,255,0.35)"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
            />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.15)" }}
              contentStyle={{
                background: "rgba(10,11,26,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
                color: "#e9ebf2",
              }}
              formatter={(value, name) => [
                value === null || value === undefined ? "—" : (value as number),
                name,
              ]}
            />
            <Area
              type="monotone"
              dataKey="valence"
              stroke="#e879f9"
              strokeWidth={2}
              fill="url(#valence)"
              connectNulls
              name="Pleasantness"
            />
            <Area
              type="monotone"
              dataKey="energy"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#energy)"
              connectNulls
              name="Energy"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
