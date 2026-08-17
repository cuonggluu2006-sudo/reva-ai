import { useState } from 'react'
import { MessageCircle, MapPin, Check, Link2, Unlink } from 'lucide-react'

export default function IntegrationsPanel() {
  const [zaloConnected, setZaloConnected] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(true)

  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Tích hợp</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Kết nối các nền tảng để REVA AI tự động thu lead và quản lý đánh giá.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Zalo Official Account</h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-zinc-500">
                  Kết nối Zalo OA để REVA AI tự động trả lời tin nhắn, thu lead và
                  gửi follow-up cho khách hàng qua Zalo.
                </p>
                {zaloConnected && (
                  <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <Check className="h-3 w-3" />
                    Đã kết nối
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0">
              {!zaloConnected ? (
                <button
                  type="button"
                  onClick={() => setZaloConnected(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  <Link2 className="h-4 w-4" />
                  Kết nối Zalo OA
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setZaloConnected(false)}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  <Unlink className="h-4 w-4" />
                  Ngắt kết nối
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-zinc-900">
                    Google Business Profile
                  </h3>
                  {googleConnected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      <Check className="h-3 w-3" />
                      Đã kết nối
                    </span>
                  )}
                </div>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-zinc-500">
                  Đồng bộ đánh giá Google, nhận cảnh báo review rủi ro và đăng phản
                  hồi AI trực tiếp lên Google Business Profile.
                </p>
                {googleConnected && (
                  <p className="mt-2 text-xs text-zinc-400">
                    Spa Glow Beauty · Quận 1, TP.HCM
                  </p>
                )}
              </div>
            </div>
            <div className="shrink-0">
              {googleConnected ? (
                <button
                  type="button"
                  onClick={() => setGoogleConnected(false)}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  <Unlink className="h-4 w-4" />
                  Ngắt kết nối
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setGoogleConnected(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  <Link2 className="h-4 w-4" />
                  Kết nối Google
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
