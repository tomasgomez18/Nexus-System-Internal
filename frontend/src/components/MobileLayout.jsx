import { NavLink, Outlet } from 'react-router-dom'

const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

const TableIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m-6 4h6m-9-9a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
  </svg>
)

const links = [
  { to: '/', label: 'Inicio', icon: HomeIcon },
  { to: '/nuevo', label: 'Nuevo', icon: PlusIcon },
  { to: '/contable', label: 'Contable', icon: TableIcon },
]

const desktopNavClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
    isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-gray-200'
  }`

const mobileNavClass = ({ isActive }) =>
  `flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
    isActive ? 'text-emerald-400' : 'text-gray-400'
  }`

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 bg-gray-900 border-r border-gray-800 flex-col p-4">
        <h1 className="text-xl font-bold text-white px-4 py-3">NexusInterno</h1>
        <nav className="mt-2 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={desktopNavClass}>
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="md:pl-60">
        <div className="max-w-md mx-auto p-4 pb-24 md:max-w-6xl md:pb-8">
          <Outlet />
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-10">
        <div className="max-w-md mx-auto grid grid-cols-3 bg-gray-900 border-t border-gray-800">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={mobileNavClass}>
              <Icon className="w-6 h-6 mb-0.5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}