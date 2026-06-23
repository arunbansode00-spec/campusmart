import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, Store, ArrowLeft } from 'lucide-react'

const links = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/seller/products', icon: Package, label: 'My Products' },
  { to: '/seller/products/add', icon: PlusCircle, label: 'Add Product' },
  { to: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
]

export default function SellerLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-3">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Store size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-primary-900">Seller Hub</span>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={15} /> Back to Store
        </Link>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
