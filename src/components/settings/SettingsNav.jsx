import { User, Plug, Sparkles } from 'lucide-react'

const SETTINGS_TABS = [
  { id: 'ai', label: 'Cấu hình AI', icon: Sparkles },
  { id: 'integrations', label: 'Tích hợp', icon: Plug },
  { id: 'account', label: 'Tài khoản', icon: User },
]

export default function SettingsNav({ activeTab, onTabChange }) {
  return (
    <nav className="space-y-1">
      {SETTINGS_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={[
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
          ].join(' ')}
        >
          <tab.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
