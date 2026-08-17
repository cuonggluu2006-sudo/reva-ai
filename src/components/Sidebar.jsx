import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Star,
  BarChart3,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function NavItem({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-zinc-900 text-white'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        ].join(' ')
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
      {label}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-zinc-900">
                REVA AI
              </p>
              <p className="text-[11px] text-zinc-400">Spa Intelligence</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 lg:hidden"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onClose} />
          ))}
        </nav>

        <div className="border-t border-zinc-100 p-4">
          <div className="rounded-lg bg-zinc-50 px-3 py-2.5">
            <p className="text-xs font-medium text-zinc-900">Spa Glow Beauty</p>
            <p className="mt-0.5 text-[11px] text-zinc-400">Gói Pro · Hết hạn 15/09</p>
          </div>
        </div>
      </aside>
    </>
  )
}
