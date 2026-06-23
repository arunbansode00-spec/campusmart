import { useState, useEffect } from 'react'
import { Search, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { CONDITION_COLORS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetch = async () => {
    setLoading(true)
    let q = supabase
      .from('products')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
    if (search) q = q.ilike('title', `%${search}%`)
    const { data } = await q
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [search])

  const deleteProduct = async (id) => {
    if (!confirm('Permanently delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product deleted')
    fetch()
  }

  const toggleStatus = async (id, status) => {
    const newStatus = status === 'active' ? 'paused' : 'active'
    await supabase.from('products').update({ status: newStatus }).eq('id', id)
    toast.success(`Product ${newStatus}`)
    fetch()
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Product Management</h1>
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input pl-10 py-2.5 text-sm" />
        </div>
        <button onClick={fetch} className="btn-secondary py-2.5 px-4 flex items-center gap-2 text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-4 py-4">Seller</th>
              <th className="text-left px-4 py-4">Category</th>
              <th className="text-left px-4 py-4">Price</th>
              <th className="text-left px-4 py-4">Condition</th>
              <th className="text-left px-4 py-4">Status</th>
              <th className="text-left px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0] || 'https://placehold.co/48x48/e0e7ff/4338ca?text=P'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                      onError={e => { e.target.src = 'https://placehold.co/48x48/e0e7ff/4338ca?text=P' }}
                    />
                    <span className="font-medium text-gray-900 max-w-[160px] truncate">{p.title}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-gray-700 font-medium text-xs">{p.profiles?.full_name}</p>
                  <p className="text-gray-400 text-xs">{p.profiles?.email}</p>
                </td>
                <td className="px-4 py-4 text-gray-500 capitalize text-xs">{p.category}</td>
                <td className="px-4 py-4 font-semibold text-primary-700">
                  {p.price === 0 ? 'Free' : `₹${p.price.toLocaleString()}`}
                </td>
                <td className="px-4 py-4">
                  {p.condition && (
                    <span className={`${CONDITION_COLORS[p.condition]} text-[10px] font-bold uppercase px-2 py-0.5 rounded-full`}>
                      {p.condition.replace('_', ' ')}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>{p.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(p.id, p.status)}
                      className="p-1.5 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 rounded-lg transition-colors"
                      title={p.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {p.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-8 text-gray-400 text-sm">Loading products...</div>}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
