import { useEffect, useMemo, useState } from 'react'
import { Filter, Loader2 } from 'lucide-react'
import { getReviewsSummary } from '../data/reviews'
import { fetchReviews } from '../lib/fetchReviews'
import ReviewsSummary from '../components/reviews/ReviewsSummary'
import ReviewCard from '../components/reviews/ReviewCard'
import Toast from '../components/ui/Toast'

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả đánh giá' },
  { value: 'attention', label: 'Cần chú ý' },
  { value: 'positive', label: 'Tích cực' },
  { value: 'negative', label: 'Tiêu cực' },
]

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadWarning, setLoadWarning] = useState(null)
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      const { data, error, fromMock } = await fetchReviews()
      if (cancelled) return
      setReviews(data)
      setLoadWarning(fromMock && error ? error.message : null)
      setIsLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const summary = useMemo(() => getReviewsSummary(reviews), [reviews])

  const filteredReviews = useMemo(() => {
    switch (filter) {
      case 'attention':
        return reviews.filter(
          (r) => r.risk_level === 'High' || r.sentiment === 'Negative',
        )
      case 'positive':
        return reviews.filter((r) => r.sentiment === 'Positive')
      case 'negative':
        return reviews.filter((r) => r.sentiment === 'Negative')
      default:
        return reviews
    }
  }, [reviews, filter])

  const sortedReviews = useMemo(() => {
    const priority = { High: 0, Medium: 1, Low: 2 }
    return [...filteredReviews].sort(
      (a, b) => priority[a.risk_level] - priority[b.risk_level],
    )
  }, [filteredReviews])

  function handleSaveSuccess(message) {
    setToast({ message, type: 'success' })
  }

  function handleSaveError(message) {
    setToast({ message, type: 'error' })
  }

  function handleReplySaved(id, reply) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ai_suggested_reply: reply } : r)),
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Google Reviews
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Quản lý đánh giá Google Business Profile và phản hồi thông minh với REVA AI.
        </p>
      </div>

      {loadWarning && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadWarning}
        </div>
      )}

      <ReviewsSummary {...summary} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Hiển thị{' '}
          <span className="font-medium text-zinc-900">{sortedReviews.length}</span>{' '}
          đánh giá
        </p>
        <div className="relative sm:w-56">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-8 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Đang tải đánh giá từ cơ sở dữ liệu...
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white px-4 py-12 text-center text-sm text-zinc-400">
              Không có đánh giá phù hợp với bộ lọc.
            </div>
          ) : (
            sortedReviews.map((review) => (
              <ReviewCard
                key={`${review.id}-${review.ai_suggested_reply ?? ''}`}
                review={review}
                onReplySaved={handleReplySaved}
                onSaveSuccess={handleSaveSuccess}
                onSaveError={handleSaveError}
              />
            ))
          )}
        </div>
      )}

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  )
}
