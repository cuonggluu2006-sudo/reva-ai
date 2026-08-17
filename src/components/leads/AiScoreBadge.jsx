import { Sparkles } from 'lucide-react'
import { getScoreTier } from '../../lib/leadUtils'

export default function AiScoreBadge({ score, reason, compact = false }) {
  const tier = getScoreTier(score)

  return (
    <div className={compact ? '' : 'max-w-[180px]'}>
      <span
        className={[
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ring-1 ring-inset',
          tier.className,
        ].join(' ')}
        title={reason}
      >
        {(tier.key === 'hot' || score >= 80) && (
          <Sparkles className="h-3 w-3" />
        )}
        {score} · {tier.label}
      </span>
      {reason && !compact && (
        <p className="mt-1 line-clamp-2 text-xs text-zinc-400" title={reason}>
          {reason}
        </p>
      )}
    </div>
  )
}
