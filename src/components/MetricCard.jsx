export default function MetricCard({ label, value, icon: Icon, trend, accent }) {
  const accentStyles = {
    default: 'bg-zinc-50 text-zinc-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentStyles[accent] ?? accentStyles.default}`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
        {trend && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  )
}
