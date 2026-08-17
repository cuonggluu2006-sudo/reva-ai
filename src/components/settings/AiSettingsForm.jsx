import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'

const TONE_OPTIONS = [
  'Lịch sự & Chuyên nghiệp',
  'Gần gũi & Thân thiện',
  'Sang trọng',
]

const DEFAULT_VALUES = {
  brandName: 'Spa Glow Beauty',
  tone: 'Lịch sự & Chuyên nghiệp',
  complaintPolicy:
    'Luôn xin lỗi trước khi giải thích. Không đổ lỗi cho khách hàng hoặc nhân viên. Đề xuất tặng voucher 20% hoặc chăm sóc lại miễn phí cho các trường hợp phàn nàn về chất lượng dịch vụ. Phản hồi trong vòng 2 giờ làm việc.',
}

export default function AiSettingsForm() {
  const [brandName, setBrandName] = useState(DEFAULT_VALUES.brandName)
  const [tone, setTone] = useState(DEFAULT_VALUES.tone)
  const [complaintPolicy, setComplaintPolicy] = useState(
    DEFAULT_VALUES.complaintPolicy,
  )
  const [saved, setSaved] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
          <Sparkles className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Cấu hình AI</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Thiết lập ngữ cảnh để REVA AI phản hồi leads và reviews đúng phong cách
            thương hiệu của bạn.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="brandName"
            className="block text-sm font-medium text-zinc-700"
          >
            Tên thương hiệu
          </label>
          <input
            id="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="VD: Spa Glow Beauty"
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          />
          <p className="mt-1.5 text-xs text-zinc-400">
            REVA AI sẽ sử dụng tên này khi chào hỏi và ký tên trong phản hồi.
          </p>
        </div>

        <div>
          <label
            htmlFor="tone"
            className="block text-sm font-medium text-zinc-700"
          >
            Giọng điệu AI
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-2 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          >
            {TONE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-zinc-400">
            Quyết định cách AI giao tiếp với khách hàng qua tin nhắn và review.
          </p>
        </div>

        <div>
          <label
            htmlFor="complaintPolicy"
            className="block text-sm font-medium text-zinc-700"
          >
            Chính sách xử lý phàn nàn
          </label>
          <textarea
            id="complaintPolicy"
            value={complaintPolicy}
            onChange={(e) => setComplaintPolicy(e.target.value)}
            rows={5}
            placeholder="VD: Luôn xin lỗi trước, đề xuất tặng voucher 20% hoặc chăm sóc lại miễn phí..."
            className="mt-2 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          />
          <p className="mt-1.5 text-xs text-zinc-400">
            Các quy tắc này được đưa vào prompt khi AI tạo phản hồi cho đánh giá
            tiêu cực hoặc lead không hài lòng.
          </p>
        </div>

        <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Lưu cấu hình
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Check className="h-4 w-4" />
              Đã lưu thành công
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
