import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, ShieldCheck, MessageCircle, TrendingUp } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import ProductCard from '../../components/product/ProductCard'
import { CATEGORIES } from '../../utils/constants'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, profiles(full_name, whatsapp)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(8)
      setFeatured(data || [])

      const { data: trend } = await supabase
        .from('products')
        .select('*, profiles(full_name, whatsapp)')
        .eq('status', 'active')
        .order('views', { ascending: false })
        .limit(4)
      setTrending(trend || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Zap size={14} className="text-accent-300" />
            Only for MIT Manipal students
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Buy. Sell. Exchange.<br />
            <span className="text-accent-400">Right on Campus.</span>
          </h1>
          <p className="text-primary-100 text-lg md:text-xl max-w-xl mx-auto mb-10">
            The student-to-student marketplace for MIT Manipal. From books to cycles, hostel essentials to services — find everything you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/category/electronics" className="btn-accent text-base px-8 py-3.5">
              Start Shopping
            </Link>
            <Link to="/seller/products/add" className="bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-3.5 rounded-xl transition-all border border-white/30">
              List Something
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-primary-200">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-400" /> Verified Students Only</span>
            <span className="flex items-center gap-2"><MessageCircle size={16} className="text-blue-300" /> WhatsApp Connect</span>
            <span className="flex items-center gap-2"><Zap size={16} className="text-accent-300" /> Instant Listings</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="card flex flex-col items-center gap-2 py-4 px-2 hover:border-primary-200 hover:shadow-card-hover transition-all text-center group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-xs font-medium text-gray-700 group-hover:text-primary-700 leading-tight">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-accent-500" />
            <h2 className="font-display text-2xl font-bold text-gray-900">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Latest products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Latest Listings</h2>
          <Link to="/search" className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-gray-100 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-lg font-semibold text-gray-600">No listings yet</p>
            <p className="text-sm mb-6">Be the first to list something!</p>
            <Link to="/seller/products/add" className="btn-primary">List a Product</Link>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-accent-500 to-accent-600 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="font-display text-2xl font-bold mb-1">Got something to sell?</h3>
            <p className="text-orange-100">List it in under 2 minutes. Reach 10,000+ MIT Manipal students.</p>
          </div>
          <Link to="/seller/products/add" className="bg-white text-accent-600 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all whitespace-nowrap">
            Start Selling →
          </Link>
        </div>
      </section>
    </div>
  )
}
