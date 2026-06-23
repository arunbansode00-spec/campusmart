import { Link } from 'react-router-dom'
import { Store } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg">Campus<span className="text-accent-400">Mart</span></span>
          </div>
          <p className="text-primary-200 text-sm leading-relaxed">
            MIT Manipal's official campus marketplace. Buy, sell, and exchange within your campus community.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-300">Browse</h4>
          <ul className="space-y-2 text-sm text-primary-200">
            {['Electronics','Books','Cycles','Furniture','Services'].map(c => (
              <li key={c}><Link to={`/category/${c.toLowerCase()}`} className="hover:text-white transition-colors">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-300">Sell</h4>
          <ul className="space-y-2 text-sm text-primary-200">
            <li><Link to="/seller" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
            <li><Link to="/seller/products/add" className="hover:text-white transition-colors">List a Product</Link></li>
            <li><Link to="/seller/orders" className="hover:text-white transition-colors">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-300">Help</h4>
          <ul className="space-y-2 text-sm text-primary-200">
            <li><a href="mailto:campusmart@learner.manipal.edu" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><span className="text-primary-300">MIT Manipal Campus</span></li>
            <li><span className="text-primary-300">Manipal, Karnataka</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-primary-400">
          <span>© 2025 CampusMart · MIT Manipal Student Marketplace</span>
          <span>Made with ❤️ for MIT Manipal</span>
        </div>
      </div>
    </footer>
  )
}
