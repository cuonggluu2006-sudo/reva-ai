import { Star, MessageSquare, AlertTriangle } from 'lucide-react'

export default function ReviewsSummary({ average, total, needingAttention }) {
  const stats = [
    {
      label: 'Điểm trung bình',
      value: average.toFixed(1),
      suffix: '/ 5',
      icon: Star,
      accent: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'Tổng đánh giá',
      value: total,
      icon: MessageSquare,
      accent: 'text-zinc-600',
      bg: 'bg-zinc-100',
    },
    {
      label: 'Cần chú ý',
      value: needingAttention,
      icon: AlertTriangle,
      accent: needingAttention > 0 ? 'text-red-600' : 'text-emerald-600',
      bg: needingAttention > 0 ? 'bg-red-50' : 'bg-emerald-50',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.accent}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-semibold tracking-tight text-zinc-900">
                {stat.value}
                {stat.suffix && (
                  <span className="text-base font-normal text-zinc-400">
                    {stat.suffix}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
