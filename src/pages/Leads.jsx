import { useEffect, useMemo, useState } from 'react'
import { Search, Filter, Users, Flame, Loader2, Sparkles } from 'lucide-react'
import { fetchLeads } from '../lib/fetchLeads'
import { LEAD_STATUS_FILTERS } from '../lib/leadUtils'
import StatusBadge from '../components/leads/StatusBadge'
import AiScoreBadge from '../components/leads/AiScoreBadge'
import LeadSlideOver from '../components/leads/LeadSlideOver'
import LeadFollowUpDrawer from '../components/leads/LeadFollowUpDrawer'
import Toast from '../components/ui/Toast'

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadWarning, setLoadWarning] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState(null)
  const [followUpLead, setFollowUpLead] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      const { data, error, fromMock } = await fetchLeads()
      if (cancelled) return
      setLeads(data)
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

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase()

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.phone.includes(query)

      const matchesStatus =
        statusFilter === 'all' || lead.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [leads, search, statusFilter])

  const hotCount = leads.filter((l) => l.score >= 80).length

  function handleLeadUpdated(id, updates) {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)),
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Quản lý Leads
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            AI Lead Scoring &amp; tin nhắn follow-up tự động cho {leads.length} leads.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm">
            <Users className="h-4 w-4 text-zinc-400" />
            <span className="font-medium text-zinc-900">{filteredLeads.length}</span>
            <span className="text-zinc-400">leads</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm">
            <Flame className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-700">{hotCount}</span>
            <span className="text-red-600">nóng</span>
          </div>
        </div>
      </div>

      {loadWarning && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadWarning}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc số điện thoại..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          />
        </div>
        <div className="relative sm:w-52">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-8 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          >
            {LEAD_STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang tải leads từ cơ sở dữ liệu...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80">
                  <th className="px-4 py-3 font-medium text-zinc-500">Khách hàng</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">AI Score</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">Dịch vụ</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">Tương tác</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                      Không tìm thấy lead phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isHot = lead.score >= 80
                    const isWarm = lead.score >= 50 && lead.score < 80

                    return (
                      <tr
                        key={`${lead.id}-${lead.status}-${lead.suggested_followup ?? ''}`}
                        onClick={() => setSelectedLead(lead)}
                        className={[
                          'cursor-pointer transition-colors hover:bg-zinc-50',
                          isHot ? 'bg-red-50/20 hover:bg-red-50/40' : '',
                          isWarm ? 'bg-amber-50/20 hover:bg-amber-50/40' : '',
                        ].join(' ')}
                      >
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="font-medium text-zinc-900">{lead.name}</p>
                            <p className="mt-0.5 text-xs text-zinc-400">{lead.phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={lead.status} label={lead.status_label} />
                        </td>
                        <td className="px-4 py-3.5">
                          <AiScoreBadge
                            score={lead.score}
                            reason={lead.score_reason}
                          />
                        </td>
                        <td className="px-4 py-3.5 text-zinc-700">
                          {lead.service_interest}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-500">
                          {lead.last_interaction}
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFollowUpLead(lead)
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Soạn tin nhắn AI
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LeadSlideOver
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      <LeadFollowUpDrawer
        key={followUpLead?.id}
        lead={followUpLead}
        onClose={() => setFollowUpLead(null)}
        onSaved={handleLeadUpdated}
        onToast={setToast}
      />

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  )
}
