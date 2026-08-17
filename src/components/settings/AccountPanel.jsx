import { User, Mail, Building2, Phone } from 'lucide-react'

const accountInfo = [
  { label: 'Chủ spa', value: 'Nguyễn Thị Lan', icon: User },
  { label: 'Email', value: 'lan@spaglowbeauty.vn', icon: Mail },
  { label: 'Tên cơ sở', value: 'Spa Glow Beauty', icon: Building2 },
  { label: 'Hotline', value: '1900-xxxx', icon: Phone },
]

export default function AccountPanel() {
  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Tài khoản</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Thông tin tài khoản và cơ sở spa của bạn trên REVA AI.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white shadow-sm">
        <dl className="divide-y divide-zinc-100">
          {accountInfo.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                <item.icon className="h-4 w-4 text-zinc-500" />
              </div>
              <div>
                <dt className="text-xs font-medium text-zinc-400">{item.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-zinc-900">
                  {item.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
        <p className="text-sm font-medium text-zinc-700">Gói đang sử dụng</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Pro
        </p>
        <p className="mt-1 text-sm text-zinc-500">Gia hạn vào 15/09/2026</p>
      </div>
    </div>
  )
}
