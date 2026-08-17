import { Bot } from 'lucide-react'

export default function BackupAiBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-inset ring-sky-600/15">
      <Bot className="h-3 w-3" />
      Generated via Backup AI Engine
    </span>
  )
}
