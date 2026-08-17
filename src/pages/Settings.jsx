import { useState } from 'react'
import SettingsNav from '../components/settings/SettingsNav'
import AiSettingsForm from '../components/settings/AiSettingsForm'
import IntegrationsPanel from '../components/settings/IntegrationsPanel'
import AccountPanel from '../components/settings/AccountPanel'

function SettingsContent({ activeTab }) {
  switch (activeTab) {
    case 'integrations':
      return <IntegrationsPanel />
    case 'account':
      return <AccountPanel />
    case 'ai':
    default:
      return <AiSettingsForm />
  }
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('ai')

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Cài đặt
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Cấu hình AI, tích hợp bên thứ ba và thông tin tài khoản spa.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm lg:sticky lg:top-24">
            <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </aside>

        <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <SettingsContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}
