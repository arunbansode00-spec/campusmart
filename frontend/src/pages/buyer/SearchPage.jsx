import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import ProductCard from '../../components/product/ProductCard'
import { CATEGORIES, CONDITIONS } from '../../utils/constants'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(q)
  const [category, setCategory] = useState(params.get('cat') || '')
  const [condition, setCondition] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    if (!q && !category) return
    const fetch = async () => {
      setLoading(true)
      let db = supabase
        .from('products')
        .select('*, profiles(full_name, whatsapp)')
        .eq('status', 'active')

      if (q) db = db.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      if (category) db = db.eq('category', category)
      if (condition) db = db.eq('condition', condition)
      if (sort === 'newest') db = db.order('created_at', { ascending: false })
      if (sort === 'price_asc') db = db.order('price', { ascending: true })
      if (sort === 'price_desc') db = db.order('price', { ascending: false })

      const { data } = await db
      setProducts(data || [])
      setLoading(false)
    }
    fetch()
  }, [q, category, condition, sort])

  const handleSearch = (e) => {
    e.preventDefault()
    setParams({ q: query, ...(category && { cat: category }) })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="input pl-12 py-3.5 text-base"
            />
          </div>
          <button type="submit" className="btn-primary px-8">Search</button>
        </div>
      </form>

      <div className="flex flex-wrap gap-3 mb-8">
        <select value={category} onChange={e => setCategory(e.target.value)} className="input w-auto text-sm py-2">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>
        <select value={condition} onChange={e => setCondition(e.target.value)} className="input w-auto text-sm py-2">
          <option value="">All Conditions</option>
          {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input w-auto text-sm py-2">
          <option value="newest">Newest First</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>

      {q && <h2 className="font-display text-xl font-bold text-gray-800 mb-6">
        {loading ? 'Searching...' : `${products.length} results for "${q}"`}
      </h2>}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="card animate-pulse aspect-[3/4] bg-gray-50" />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : q ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-semibold text-gray-600">No results for "{q}"</p>
          <p className="text-sm">Try different keywords</p>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-sm">Type something to search across all listings</p>
        </div>
      )}
    </div>
  )
}
