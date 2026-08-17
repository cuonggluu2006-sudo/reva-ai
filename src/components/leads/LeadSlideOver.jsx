import { X, Phone, Sparkles, MessageCircle, Calendar, CheckCircle2, Bot } from 'lucide-react'
import StatusBadge from './StatusBadge'
import AiScoreBadge from './AiScoreBadge'

const journeyIcons = {
  inquiry: MessageCircle,
  auto: Bot,
  call: Phone,
  visit: Calendar,
  closed: CheckCircle2,
}

const journeyColors = {
  inquiry: 'bg-blue-100 text-blue-600',
  auto: 'bg-violet-100 text-violet-600',
  call: 'bg-amber-100 text-amber-600',
  visit: 'bg-emerald-100 text-emerald-600',
  closed: 'bg-zinc-900 text-white',
}

export default function LeadSlideOver({ lead, onClose }) {
  if (!lead) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-panel-title"
      >
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {lead.id}
            </p>
            <h2
              id="lead-panel-title"
              className="mt-1 text-lg font-semibold text-zinc-900"
            >
              {lead.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={lead.status} label={lead.status_label} />
              <AiScoreBadge score={lead.score ?? lead.ai_score} compact />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Đóng panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-zinc-400">Số điện thoại</dt>
              <dd className="mt-0.5 font-medium text-zinc-900">{lead.phone}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Dịch vụ quan tâm</dt>
              <dd className="mt-0.5 font-medium text-zinc-900">
                {lead.service_interest ?? lead.service_interested}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-zinc-400">Tương tác gần nhất</dt>
              <dd className="mt-0.5 font-medium text-zinc-900">
                {lead.last_interaction}
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-violet-900">
                AI Recommendation
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-violet-900/90">
              {lead.ai_recommendation}
            </p>
            <div className="mt-4 rounded-lg bg-white/70 px-3 py-2.5">
              <p className="text-xs font-medium text-violet-700">Hành động đề xuất</p>
              <p className="mt-0.5 text-sm text-zinc-800">{lead.recommended_action}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-zinc-900">Customer Journey</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Lịch sử tương tác đầy đủ
            </p>

            <ol className="relative mt-5 space-y-0">
              {lead.customer_journey.map((step, index) => {
                const Icon = journeyIcons[step.type] ?? MessageCircle
                const isLast = index === lead.customer_journey.length - 1

                return (
                  <li key={`${step.date}-${index}`} className="relative flex gap-4 pb-6">
                    {!isLast && (
                      <span
                        className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-zinc-200"
                        aria-hidden="true"
                      />
                    )}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${journeyColors[step.type] ?? journeyColors.inquiry}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <time className="text-xs font-medium text-zinc-400">
                        {step.date}
                      </time>
                      <p className="mt-0.5 text-sm text-zinc-700">{step.event}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="border-t border-zinc-100 px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <Phone className="h-4 w-4" />
              Gọi ngay
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <MessageCircle className="h-4 w-4" />
              Nhắn tin
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
