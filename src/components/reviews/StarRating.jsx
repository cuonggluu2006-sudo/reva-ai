import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={[
            sizeClass,
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-zinc-200 text-zinc-200',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
