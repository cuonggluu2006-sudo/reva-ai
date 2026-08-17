import { AlertTriangle } from 'lucide-react'

const riskStyles = {
  Low: 'bg-zinc-50 text-zinc-600 ring-zinc-500/10',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  High: 'bg-red-50 text-red-700 ring-red-600/10',
}

export default function RiskBadge({ riskLevel }) {
  const isHigh = riskLevel === 'High'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${riskStyles[riskLevel] ?? riskStyles.Low}`}
    >
      {isHigh && <AlertTriangle className="h-3 w-3" />}
      {riskLevel === 'High' ? 'Rủi ro cao' : riskLevel === 'Medium' ? 'Rủi ro TB' : 'An toàn'}
    </span>
  )
}
