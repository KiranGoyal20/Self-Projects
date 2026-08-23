const steps = [
  "Personal",
  "Address",
  "Citizenship",
  "Pregnancy",
  "Medical",
  "Income",
  "Additional",
  "Attestations",
];

export function OnboardingWidget() {
  return (
    <div className="h-full rounded-2xl bg-white p-4 text-slate-800 shadow-widget">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Online application
      </p>
      <p className="text-sm font-semibold">Benefits enrollment</p>
      <p className="mt-1 text-xs text-slate-500">Complete each section. Progress is kept on this site.</p>

      <ol className="mt-3 flex flex-wrap gap-1.5">
        {steps.map((step, i) => (
          <li
            key={step}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              i === 0
                ? "bg-sky-600 text-white"
                : i === 1
                  ? "bg-sky-50 text-sky-800 ring-1 ring-sky-200"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}. {step}
          </li>
        ))}
      </ol>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold">Personal information</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[10px] text-slate-500">First name</span>
            <span className="mt-0.5 block h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] leading-7 text-slate-400">
              Maya
            </span>
          </label>
          <label className="block">
            <span className="text-[10px] text-slate-500">Last name</span>
            <span className="mt-0.5 block h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] leading-7 text-slate-400">
              Chen
            </span>
          </label>
          <label className="col-span-2 block">
            <span className="text-[10px] text-slate-500">Email</span>
            <span className="mt-0.5 block h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] leading-7 text-slate-400">
              maya.chen@example.com
            </span>
          </label>
        </div>
        <div className="mt-3 flex justify-end">
          <span className="rounded-lg bg-sky-600 px-3 py-1 text-[11px] font-semibold text-white">
            Continue
          </span>
        </div>
      </div>
    </div>
  );
}
