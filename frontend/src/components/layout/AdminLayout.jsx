import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Users, Package, ShoppingBag, Flag, Shield, ArrowLeft } from 'lucide-react'

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/reports', icon: Flag, label: 'Reports' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-60 shrink-0 bg-primary-900 flex flex-col py-6 px-3">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-white">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-primary-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="flex items-center gap-2 px-3 py-2.5 text-sm text-primary-300 hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back to Store
        </Link>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
