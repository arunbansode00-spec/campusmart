import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import ProductCard from '../../components/product/ProductCard'
import { CATEGORIES, CONDITIONS } from '../../utils/constants'

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [condition, setCondition] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const cat = CATEGORIES.find(c => c.id === slug || c.label.toLowerCase().replace(/ & /g,'-').replace(/ /g,'-') === slug)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      let q = supabase
        .from('products')
        .select('*, profiles(full_name, whatsapp)')
        .eq('status', 'active')
        .ilike('category', `%${slug}%`)

      if (condition) q = q.eq('condition', condition)
      if (priceMax) q = q.lte('price', Number(priceMax))
      if (sort === 'newest') q = q.order('created_at', { ascending: false })
      if (sort === 'price_asc') q = q.order('price', { ascending: true })
      if (sort === 'price_desc') q = q.order('price', { ascending: false })
      if (sort === 'popular') q = q.order('views', { ascending: false })

      const { data } = await q
      setProducts(data || [])
      setLoading(false)
    }
    fetch()
  }, [slug, sort, condition, priceMax])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">
          {cat?.emoji} {cat?.label || slug}
        </h1>
        <p className="text-gray-500 mt-1">{products.length} listings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 card">
        <select value={sort} onChange={e => setSort(e.target.value)} className="input w-auto text-sm py-2">
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
        <select value={condition} onChange={e => setCondition(e.target.value)} className="input w-auto text-sm py-2">
          <option value="">All Conditions</option>
          {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <input
          type="number"
          placeholder="Max price (₹)"
          value={priceMax}
          onChange={e => setPriceMax(e.target.value)}
          className="input w-40 text-sm py-2"
        />
        {(condition || priceMax) && (
          <button onClick={() => { setCondition(''); setPriceMax('') }} className="text-sm text-red-500 hover:text-red-700 font-medium px-3">
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="card animate-pulse aspect-[3/4] bg-gray-50" />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-semibold text-gray-600">No products found</p>
          <p className="text-sm">Try different filters or check back later</p>
        </div>
      )}
    </div>
  )
}
