export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

export const formatDateTime = (iso: string): string =>
  `${formatDate(iso)} · ${formatTime(iso)}`;

export const formatDuration = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const startOfDay = (iso: string): string => {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

export const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
};
