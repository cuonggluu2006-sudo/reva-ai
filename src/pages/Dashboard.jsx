import {
  DollarSign,
  UserX,
  Flame,
  RefreshCw,
  Star,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import MetricCard from '../components/MetricCard'

const metrics = [
  {
    label: 'Doanh thu thu hồi',
    value: '86.400.000đ',
    icon: DollarSign,
    accent: 'green',
    trend: '+12%',
  },
  {
    label: 'Lead chưa mua',
    value: '1.284',
    icon: UserX,
    accent: 'default',
  },
  {
    label: 'Lead nóng',
    value: '126',
    icon: Flame,
    accent: 'amber',
    trend: 'Ưu tiên',
  },
  {
    label: 'Khách quay lại',
    value: '47',
    icon: RefreshCw,
    accent: 'blue',
    trend: '+8',
  },
]

export default function Dashboard() {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-sm text-zinc-500">{today}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Chào mừng trở lại, Spa Glow Beauty
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-500">
          Tổng quan hiệu suất thu hồi lead và quản lý đánh giá Google của bạn.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <Star className="h-[18px] w-[18px] fill-amber-400 text-amber-400" />
            </div>
            <h2 className="text-sm font-medium text-zinc-500">Google Rating</h2>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-tight text-zinc-900">
              4.7
            </span>
            <div className="mb-2 flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
              <Star className="h-4 w-4 fill-zinc-200 text-zinc-200" />
            </div>
          </div>

          <p className="mt-2 text-sm text-zinc-500">Dựa trên 248 đánh giá</p>

          <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-900">Review rủi ro</p>
              <p className="text-lg font-semibold text-red-700">4</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Hoạt động gần đây
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Cập nhật tự động từ REVA AI
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5" />
              Đang hoạt động
            </div>
          </div>

          <ul className="mt-6 divide-y divide-zinc-100">
            {[
              {
                text: 'Lead Nguyễn Thị Mai đã phản hồi tin nhắn thu hồi',
                time: '5 phút trước',
              },
              {
                text: 'Review 1 sao mới từ Google — cần xử lý',
                time: '23 phút trước',
              },
              {
                text: '3 lead nóng sẵn sàng đặt lịch tuần này',
                time: '1 giờ trước',
              },
              {
                text: 'Khách quay lại: Trần Văn Hùng đã đặt combo facial',
                time: '2 giờ trước',
              },
            ].map((item) => (
              <li
                key={item.text}
                className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <p className="text-sm text-zinc-700">{item.text}</p>
                <span className="shrink-0 text-xs text-zinc-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
