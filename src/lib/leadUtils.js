export const STATUS_TO_LABEL = {
  new: 'Mới',
  contacted: 'Đã chăm sóc',
  won: 'Đã chốt',
  lost: 'Mất tích',
  'Mới': 'Mới',
  'Đang tư vấn': 'Đang tư vấn',
  'Đã chốt': 'Đã chốt',
  'Mất tích': 'Mất tích',
}

export const LABEL_TO_STATUS = {
  Mới: 'new',
  'Đang tư vấn': 'contacted',
  'Đã chốt': 'won',
  'Mất tích': 'lost',
  'Đã chăm sóc': 'contacted',
}

export const LEAD_STATUS_FILTERS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'new', label: 'Mới' },
  { value: 'contacted', label: 'Đã chăm sóc' },
  { value: 'won', label: 'Đã chốt' },
  { value: 'lost', label: 'Mất tích' },
]

const enrichmentById = {
  'LD-001': {
    score_reason: 'Hỏi giá 3 lần — sẵn sàng chốt trong 24h',
    last_objection: 'So sánh giá gói 5 buổi vs 10 buổi',
  },
  'LD-002': {
    score_reason: 'Đã đặt cọc — khách tiềm năng cao',
    last_objection: 'Cần hướng dẫn chuẩn bị trước liệu trình',
  },
  'LD-003': {
    score_reason: 'Lead mới — chưa phản hồi tin nhắn đầu',
    last_objection: 'Chưa rõ hiệu quả triệt lông vùng nách',
  },
  'LD-004': {
    score_reason: 'Không phản hồi sau 3 lần follow-up',
    last_objection: 'Im lặng sau khi nhận báo giá massage',
  },
  'LD-005': {
    score_reason: 'Xem album 5 lần — quan tâm sâu',
    last_objection: 'Lo lắng về độ bền màu phun môi',
  },
  'LD-006': {
    score_reason: 'Quan tâm detox nhưng chưa hỏi giá',
    last_objection: 'Cần thêm thông tin liệu trình 7 ngày',
  },
  'LD-007': {
    score_reason: 'VIP — đã thanh toán full gói Laser',
    last_objection: 'Không còn — đã chốt thành công',
  },
  'LD-008': {
    score_reason: 'Không phản hồi sau 4 lần tiếp cận',
    last_objection: 'Không sử dụng voucher gội đầu miễn phí',
  },
  'LD-009': {
    score_reason: 'Hỏi chi tiết về đau và thời gian nghỉ',
    last_objection: 'Lo ngại HIFU có đau không',
  },
  'LD-010': {
    score_reason: 'Tìm kiếm Google — cần giáo dục thêm',
    last_objection: 'Chưa rõ loại nám và phương pháp phù hợp',
  },
  'LD-011': {
    score_reason: 'Khách quay lại — vừa chốt combo',
    last_objection: 'Ghi chú dị ứng retinol cần tránh',
  },
  'LD-012': {
    score_reason: 'Im lặng sau báo giá tắm trắng',
    last_objection: 'So sánh giá với spa khác',
  },
}

export function normalizeStatus(raw) {
  if (!raw) return 'new'
  if (LABEL_TO_STATUS[raw]) return LABEL_TO_STATUS[raw]
  if (STATUS_TO_LABEL[raw]) return raw
  return raw
}

export function getStatusLabel(statusKey) {
  return STATUS_TO_LABEL[statusKey] ?? statusKey
}

export function getScoreTier(score) {
  if (score >= 80) return { key: 'hot', label: 'Nóng', className: 'bg-red-50 text-red-700 ring-red-600/20' }
  if (score >= 50) return { key: 'warm', label: 'Ấm', className: 'bg-amber-50 text-amber-700 ring-amber-600/20' }
  return { key: 'cold', label: 'Lạnh', className: 'bg-zinc-100 text-zinc-600 ring-zinc-500/10' }
}

export function normalizeLead(row, mock) {
  const enrichment = enrichmentById[row.id] ?? enrichmentById[mock?.id] ?? {}
  const score = row.score ?? row.ai_score ?? mock?.ai_score ?? 0
  const statusKey = normalizeStatus(row.status ?? mock?.status)

  return {
    id: row.id,
    name: row.name ?? mock?.name,
    phone: row.phone ?? mock?.phone,
    status: statusKey,
    status_label: getStatusLabel(statusKey),
    score,
    score_reason:
      row.score_reason ??
      enrichment.score_reason ??
      mock?.score_reason ??
      'Điểm dựa trên mức độ tương tác và khả năng chốt',
    last_objection:
      row.last_objection ??
      enrichment.last_objection ??
      mock?.last_objection ??
      'Chưa xác định rõ',
    service_interest:
      row.service_interest ??
      row.service_interested ??
      mock?.service_interested ??
      '',
    suggested_followup:
      row.suggested_followup ??
      row.recommended_action ??
      mock?.suggested_followup ??
      '',
    last_interaction:
      row.last_interaction ?? mock?.last_interaction ?? '',
    ai_recommendation:
      mock?.ai_recommendation ??
      'REVA AI đang phân tích lead này. Vui lòng quay lại sau.',
    customer_journey: mock?.customer_journey ?? [],
    // legacy aliases
    ai_score: score,
    service_interested:
      row.service_interest ??
      row.service_interested ??
      mock?.service_interested ??
      '',
    recommended_action:
      row.suggested_followup ??
      row.recommended_action ??
      mock?.recommended_action ??
      '',
  }
}
