import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, Menu, X, Store, Shield, LogOut, Package } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, logout } = useAuthStore()
  const cartCount = useCartStore(s => s.count())
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Store size={18} className="text-white" />
          </div>
          <span className="font-display font-800 text-primary-900 text-lg hidden sm:block">
            Campus<span className="text-accent-500">Mart</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, books, cycles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link to="/wishlist" className="p-2.5 rounded-xl hover:bg-primary-50 text-gray-600 hover:text-primary-600 transition-colors">
                <Heart size={20} />
              </Link>
              <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-primary-50 text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={15} className="text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[100px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 py-2 z-50" onClick={() => setDropOpen(false)}>
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{profile?.full_name}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">{profile?.role}</span>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                      <Package size={15} /> My Orders
                    </Link>
                    {(profile?.role === 'seller' || profile?.role === 'admin' || profile?.role === 'super_admin') && (
                      <Link to="/seller" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        <Store size={15} /> Seller Dashboard
                      </Link>
                    )}
                    {(profile?.role === 'admin' || profile?.role === 'super_admin') && (
                      <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Category bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {['Electronics','Books','Notes','Cycles','Furniture','Hostel','Services','Events','Lost & Found'].map(cat => (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase().replace(/ & /g,'-').replace(/ /g,'-')}`}
              className="shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
