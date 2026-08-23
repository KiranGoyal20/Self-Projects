const rows = [
  { name: "Aisha Patel", email: "aisha.patel@careplus.com", org: "CarePlus Clinic", status: "active" },
  { name: "Marcus Chen", email: "marcus.chen@healthnet.org", org: "HealthNet Group", status: "active" },
  { name: "Elena Ruiz", email: "elena.ruiz@wellpath.io", org: "WellPath", status: "inactive" },
];

export function AdminWidget() {
  return (
    <div className="flex h-full overflow-hidden rounded-2xl bg-[#f4f6f9] text-slate-800 shadow-widget">
      <aside className="hidden w-[88px] shrink-0 flex-col bg-[#13253f] p-3 text-white sm:flex">
        <p className="text-[9px] uppercase tracking-wider text-white/60">Control</p>
        <p className="text-xs font-bold">Admin</p>
        <nav className="mt-4 space-y-1 text-[10px] font-semibold">
          {["Providers", "Consumers", "Admins", "Inbox"].map((item, i) => (
            <div
              key={item}
              className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-teal-600/40" : "text-white/70"}`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Providers</p>
            <p className="text-[11px] text-slate-500">Search records or add a provider.</p>
          </div>
          <span className="rounded-md bg-teal-700 px-2.5 py-1 text-[10px] font-semibold text-white">
            Add provider
          </span>
        </div>

        <div className="mb-2 flex gap-2">
          <span className="h-7 flex-1 rounded-md border border-slate-200 bg-white px-2 text-[11px] leading-7 text-slate-400">
            Search by name or email
          </span>
          <span className="h-7 rounded-md bg-[#13253f] px-3 text-[11px] font-semibold leading-7 text-white">
            Search
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-2 py-1.5 font-medium">Name</th>
                <th className="hidden px-2 py-1.5 font-medium sm:table-cell">Organization</th>
                <th className="px-2 py-1.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.email} className="border-t border-slate-100">
                  <td className="px-2 py-1.5">
                    <p className="font-medium">{row.name}</p>
                    <p className="truncate text-[10px] text-slate-500">{row.email}</p>
                  </td>
                  <td className="hidden px-2 py-1.5 sm:table-cell">{row.org}</td>
                  <td className="px-2 py-1.5">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        row.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
