import { useState } from 'react'
import {
  Sparkles,
  Check,
  MessageSquareQuote,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { generateReply } from '../../lib/ai'
import { saveReviewReply } from '../../lib/fetchReviews'
import BackupAiBadge from '../ui/BackupAiBadge'
import StarRating from './StarRating'
import SentimentBadge from './SentimentBadge'
import RiskBadge from './RiskBadge'

function hasReply(reply) {
  return Boolean(reply?.trim())
}

export default function ReviewCard({ review, onReplySaved, onSaveSuccess, onSaveError }) {
  const [draftReply, setDraftReply] = useState(review.ai_suggested_reply ?? '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showEditor, setShowEditor] = useState(hasReply(review.ai_suggested_reply))
  const [usedBackup, setUsedBackup] = useState(false)

  const isAlert =
    review.sentiment === 'Negative' || review.risk_level === 'High'

  async function handleGenerate() {
    setIsGenerating(true)
    setError(null)
    setUsedBackup(false)

    try {
      const { text, usedBackup: backup } = await generateReply(
        review.comment,
        review.sentiment,
        review.customer_name,
      )
      setDraftReply(text)
      setUsedBackup(backup)
      setShowEditor(true)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Không thể tạo phản hồi AI. Vui lòng thử lại.'
      setError(message)
      onSaveError?.(message)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSave() {
    const trimmed = draftReply.trim()

    if (!trimmed) {
      const message = 'Vui lòng nhập nội dung phản hồi trước khi lưu.'
      setError(message)
      return
    }

    setIsSaving(true)
    setError(null)

    const { data, error: saveError } = await saveReviewReply(review.id, trimmed)

    if (saveError) {
      setError(saveError.message)
      onSaveError?.(saveError.message)
      setIsSaving(false)
      return
    }

    const savedReply = data?.ai_suggested_reply ?? trimmed
    setDraftReply(savedReply)
    setShowEditor(true)
    onReplySaved?.(review.id, savedReply)
    onSaveSuccess?.('Đã lưu phản hồi thành công!')
    setIsSaving(false)
  }

  return (
    <article
      className={[
        'rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
        isAlert ? 'border-red-200 ring-1 ring-red-100' : 'border-zinc-200',
      ].join(' ')}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-zinc-900">{review.customer_name}</h3>
            {isAlert && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-700">
                Cần xử lý
              </span>
            )}
            {hasReply(review.ai_suggested_reply) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                <Check className="h-3 w-3" />
                Đã có phản hồi
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StarRating rating={review.rating} />
            <span className="text-xs text-zinc-400">{review.date}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <SentimentBadge sentiment={review.sentiment} />
          <RiskBadge riskLevel={review.risk_level} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
        &ldquo;{review.comment}&rdquo;
      </p>

      <div className="mt-5 border-t border-zinc-100 pt-4">
        {!showEditor && !isGenerating && (
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <Sparkles className="h-4 w-4" />
            Tạo phản hồi AI
          </button>
        )}

        {isGenerating && (
          <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
            <p className="text-sm font-medium text-violet-700">AI đang suy nghĩ...</p>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="break-words text-sm leading-relaxed text-red-700">{error}</p>
          </div>
        )}

        {showEditor && !isGenerating && (
          <div className="space-y-4">
            <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <MessageSquareQuote className="h-4 w-4 text-violet-600" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    Phản hồi REVA AI
                  </p>
                  {usedBackup && <BackupAiBadge />}
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isSaving}
                  className="text-xs font-medium text-violet-600 hover:text-violet-800 disabled:opacity-50"
                >
                  Tạo lại
                </button>
              </div>
              <textarea
                value={draftReply}
                onChange={(e) => setDraftReply(e.target.value)}
                rows={5}
                className="mt-3 w-full resize-y rounded-lg border border-violet-200/60 bg-white/80 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-900/5"
                placeholder="Nội dung phản hồi sẽ xuất hiện tại đây..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !draftReply.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Lưu phản hồi
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
