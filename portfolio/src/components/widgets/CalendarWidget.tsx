const days = [
  { day: "MON", date: 6, events: [{ title: "Weekly product sync", time: "9:00", color: "#e77954" }] },
  { day: "TUE", date: 7, events: [{ title: "Research playback", time: "11:30", color: "#2ea77f" }] },
  { day: "WED", date: 8, events: [{ title: "Homepage critique", time: "2:00", color: "#b56bd6" }] },
  { day: "THU", date: 9, events: [{ title: "Q3 launch planning", time: "10:00", color: "#5c7cfa" }] },
  { day: "FRI", date: 10, events: [{ title: "Deep work", time: "1:00", color: "#d1a13b" }] },
];

const avatars = [
  { initials: "AM", color: "#e77954" },
  { initials: "MC", color: "#5c7cfa" },
  { initials: "JB", color: "#b56bd6" },
  { initials: "SR", color: "#2ea77f" },
];

export function CalendarWidget() {
  return (
    <div className="h-full rounded-2xl bg-[#f7f4f1] p-3 text-[#2b241c] shadow-widget sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7d72]">
            Workspace calendar
          </p>
          <p className="text-sm font-semibold">July 6–12, 2026</p>
        </div>
        <div className="flex -space-x-1.5">
          {avatars.map((a) => (
            <span
              key={a.initials}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-[#f7f4f1]"
              style={{ background: a.color }}
            >
              {a.initials}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {days.map((col) => (
          <div key={col.day} className="min-w-0 rounded-xl bg-white p-2 shadow-sm">
            <p className="text-[9px] font-semibold text-[#8a7d72]">{col.day}</p>
            <p className="mb-2 text-sm font-semibold">{col.date}</p>
            {col.events.map((ev) => (
              <div
                key={ev.title}
                className="rounded-lg px-1.5 py-1 text-[10px] leading-tight text-white"
                style={{ background: ev.color }}
              >
                <p className="font-semibold">{ev.time}</p>
                <p className="truncate opacity-95">{ev.title}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
