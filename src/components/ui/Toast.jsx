import { Check, AlertCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null

  const isSuccess = type === 'success'

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={[
          'flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
          isSuccess
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-red-200 bg-red-50',
        ].join(' ')}
        role="status"
      >
        {isSuccess ? (
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        )}
        <p
          className={[
            'flex-1 text-sm font-medium',
            isSuccess ? 'text-emerald-800' : 'text-red-700',
          ].join(' ')}
        >
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded p-0.5 text-zinc-400 hover:text-zinc-600"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
