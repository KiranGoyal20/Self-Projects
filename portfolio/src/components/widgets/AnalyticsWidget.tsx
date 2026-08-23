const kpis = [
  { label: "Revenue", value: "$128.4k", delta: "+12.4%", up: true },
  { label: "Active users", value: "48,210", delta: "+5.1%", up: true },
  { label: "Conversion", value: "3.8%", delta: "−0.3pp", up: false },
  { label: "Churn", value: "1.2%", delta: "−0.2pp", up: true },
];

const channels = [
  { name: "Organic", pct: 38, color: "#0f4c5c" },
  { name: "Paid", pct: 24, color: "#e36414" },
  { name: "Direct", pct: 18, color: "#2a9d8f" },
  { name: "Referral", pct: 12, color: "#7b8c94" },
  { name: "Social", pct: 8, color: "#c9a227" },
];

export function AnalyticsWidget() {
  return (
    <div className="h-full rounded-2xl bg-[#f3f6f8] p-3 text-[#1a2b32] shadow-widget sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5b6b73]">
            Overview
          </p>
          <p className="font-semibold" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
            Operational insights
          </p>
        </div>
        <div className="flex gap-1">
          {["Overview", "Sales", "Engagement"].map((tab, i) => (
            <span
              key={tab}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                i === 0 ? "bg-[#0f4c5c] text-white" : "bg-white text-[#5b6b73]"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[10px] text-[#5b6b73]">{kpi.label}</p>
            <p className="text-lg font-semibold leading-tight">{kpi.value}</p>
            <p className={`text-[10px] font-semibold ${kpi.up ? "text-emerald-600" : "text-rose-600"}`}>
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#5b6b73]">
            Weekly traffic
          </p>
          <svg viewBox="0 0 240 88" className="h-20 w-full" aria-hidden>
            <defs>
              <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f4c5c" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#0f4c5c" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M8 62 C 28 58, 48 44, 68 48 C 88 52, 108 28, 128 32 C 148 36, 168 18, 188 22 C 208 26, 220 14, 232 16 L 232 80 L 8 80 Z"
              fill="url(#trafficFill)"
            />
            <path
              className="spark-line"
              d="M8 62 C 28 58, 48 44, 68 48 C 88 52, 108 28, 128 32 C 148 36, 168 18, 188 22 C 208 26, 220 14, 232 16"
              fill="none"
              stroke="#0f4c5c"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="232" cy="16" r="3.2" fill="#e36414" />
          </svg>
          <div className="mt-1 flex justify-between text-[9px] text-[#5b6b73]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#5b6b73]">
            Traffic by channel
          </p>
          <div className="space-y-2">
            {channels.map((ch) => (
              <div key={ch.name}>
                <div className="mb-0.5 flex justify-between text-[10px]">
                  <span>{ch.name}</span>
                  <span className="text-[#5b6b73]">{ch.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#eef3f5]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${ch.pct}%`, background: ch.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
