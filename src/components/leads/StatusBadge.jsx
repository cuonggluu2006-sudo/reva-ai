import { getStatusLabel } from '../../lib/leadUtils'

const statusStyles = {
  new: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  contacted: 'bg-violet-50 text-violet-700 ring-violet-600/10',
  won: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  lost: 'bg-zinc-100 text-zinc-600 ring-zinc-500/10',
  'Mới': 'bg-blue-50 text-blue-700 ring-blue-600/10',
  'Đang tư vấn': 'bg-amber-50 text-amber-700 ring-amber-600/10',
  'Đã chốt': 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  'Mất tích': 'bg-zinc-100 text-zinc-600 ring-zinc-500/10',
}

export default function StatusBadge({ status, label }) {
  const display = label ?? getStatusLabel(status)

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status] ?? statusStyles.new}`}
    >
      {display}
    </span>
  )
}
