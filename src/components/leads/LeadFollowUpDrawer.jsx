import { useEffect, useState } from 'react'
import {
  X,
  Sparkles,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  MessageCircle,
  Bot,
  Phone,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { generateFollowUp } from '../../lib/ai'
import { saveLeadFollowUp } from '../../lib/fetchLeads'
import BackupAiBadge from '../ui/BackupAiBadge'
import StatusBadge from './StatusBadge'
import AiScoreBadge from './AiScoreBadge'

const journeyIcons = {
  inquiry: MessageCircle,
  auto: Bot,
  call: Phone,
  visit: Calendar,
  closed: CheckCircle2,
}

export default function LeadFollowUpDrawer({
  lead,
  onClose,
  onSaved,
  onToast,
}) {
  const shouldAutoGenerate = !lead?.suggested_followup?.trim()

  const [draftMessage, setDraftMessage] = useState(lead?.suggested_followup ?? '')
  const [isGenerating, setIsGenerating] = useState(shouldAutoGenerate)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)
  const [usedBackup, setUsedBackup] = useState(false)

  useEffect(() => {
    if (!lead || !shouldAutoGenerate) return undefined

    let cancelled = false

    generateFollowUp({
      name: lead.name,
      service_interest: lead.service_interest,
      last_interaction: lead.last_interaction,
      last_objection: lead.last_objection,
      score: lead.score,
    })
      .then(({ text, usedBackup: backup }) => {
        if (!cancelled) {
          setDraftMessage(text)
          setUsedBackup(backup)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Không thể tạo tin nhắn AI. Vui lòng thử lại.'
          setError(msg)
          onToast?.({ message: msg, type: 'error' })
        }
      })
      .finally(() => {
        if (!cancelled) setIsGenerating(false)
      })

    return () => {
      cancelled = true
    }
  }, [lead, shouldAutoGenerate, onToast])

  if (!lead) return null

  async function handleGenerate() {
    if (!lead) return

    setIsGenerating(true)
    setError(null)
    setUsedBackup(false)

    try {
      const { text, usedBackup: backup } = await generateFollowUp({
        name: lead.name,
        service_interest: lead.service_interest,
        last_interaction: lead.last_interaction,
        last_objection: lead.last_objection,
        score: lead.score,
      })
      setDraftMessage(text)
      setUsedBackup(backup)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Không thể tạo tin nhắn AI. Vui lòng thử lại.'
      setError(msg)
      onToast?.({ message: msg, type: 'error' })
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy() {
    if (!draftMessage.trim()) return

    try {
      await navigator.clipboard.writeText(draftMessage)
      setCopied(true)
      onToast?.({ message: 'Đã sao chép tin nhắn!', type: 'success' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const msg = 'Không thể sao chép. Vui lòng chọn và copy thủ công.'
      setError(msg)
      onToast?.({ message: msg, type: 'error' })
    }
  }

  async function handleSave() {
    const trimmed = draftMessage.trim()
    if (!trimmed) {
      setError('Vui lòng nhập nội dung tin nhắn trước khi lưu.')
      return
    }

    setIsSaving(true)
    setError(null)

    const { data, error: saveError } = await saveLeadFollowUp(lead.id, trimmed)

    if (saveError) {
      setError(saveError.message)
      onToast?.({ message: saveError.message, type: 'error' })
      setIsSaving(false)
      return
    }

    onSaved?.(lead.id, {
      suggested_followup: data.suggested_followup ?? trimmed,
      status: 'contacted',
      status_label: 'Đã chăm sóc',
      recommended_action: data.recommended_action ?? trimmed,
    })
    onToast?.({ message: 'Đã lưu và đánh dấu đã chăm sóc!', type: 'success' })
    setIsSaving(false)
    onClose()
  }

  const recentHistory = lead.customer_journey?.slice(-3) ?? []

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-zinc-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Soạn tin nhắn AI · {lead.id}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900">{lead.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={lead.status} label={lead.status_label} />
              <AiScoreBadge score={lead.score} compact />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-zinc-400">Dịch vụ quan tâm</dt>
              <dd className="mt-0.5 font-medium text-zinc-900">
                {lead.service_interest}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Tương tác gần nhất</dt>
              <dd className="mt-0.5 font-medium text-zinc-900">
                {lead.last_interaction}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-zinc-400">Rào cản / Objection</dt>
              <dd className="mt-0.5 font-medium text-zinc-900">
                {lead.last_objection}
              </dd>
            </div>
          </dl>

          {recentHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-zinc-900">
                Lịch sử tương tác gần nhất
              </h3>
              <ul className="mt-3 space-y-2">
                {recentHistory.map((step, index) => {
                  const Icon = journeyIcons[step.type] ?? MessageCircle
                  return (
                    <li
                      key={`${step.date}-${index}`}
                      className="flex gap-3 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-400">{step.date}</p>
                        <p className="text-sm text-zinc-700">{step.event}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" />
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                  Tin nhắn follow-up AI
                </p>
                {usedBackup && <BackupAiBadge />}
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || isSaving}
                className="text-xs font-medium text-violet-600 hover:text-violet-800 disabled:opacity-50"
              >
                Tạo lại
              </button>
            </div>

            {isGenerating ? (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                <p className="text-sm font-medium text-violet-700">
                  AI đang soạn tin nhắn...
                </p>
              </div>
            ) : (
              <textarea
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                rows={7}
                className="mt-3 w-full resize-y rounded-lg border border-violet-200/60 bg-white/80 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-900/5"
                placeholder="Tin nhắn AI sẽ xuất hiện tại đây..."
              />
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="break-words text-sm leading-relaxed text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-100 px-6 py-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!draftMessage.trim() || isGenerating}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  Đã sao chép!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Sao chép tin nhắn
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isGenerating || !draftMessage.trim()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Lưu &amp; Đánh dấu đã chăm sóc
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
