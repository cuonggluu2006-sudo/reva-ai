const sentimentStyles = {
  Positive: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  Neutral: 'bg-zinc-100 text-zinc-600 ring-zinc-500/10',
  Negative: 'bg-red-50 text-red-700 ring-red-600/10',
}

export default function SentimentBadge({ sentiment }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${sentimentStyles[sentiment] ?? sentimentStyles.Neutral}`}
    >
      {sentiment}
    </span>
  )
}
