import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye, Package } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function SellerProducts() {
  const { user } = useAuthStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [user.id])

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error('Delete failed')
    else { toast.success('Product deleted'); fetch() }
  }

  const toggleStatus = async (id, status) => {
    const newStatus = status === 'active' ? 'paused' : 'active'
    await supabase.from('products').update({ status: newStatus }).eq('id', id)
    fetch()
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Loading products...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">My Products</h1>
        <Link to="/seller/products/add" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium mb-4">No products yet</p>
          <Link to="/seller/products/add" className="btn-primary">List Your First Product</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-4 py-4">Category</th>
                <th className="text-left px-4 py-4">Price</th>
                <th className="text-left px-4 py-4">Views</th>
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
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        onError={e => { e.target.src = 'https://placehold.co/48x48/e0e7ff/4338ca?text=P' }}
                      />
                      <span className="font-medium text-gray-900 max-w-[180px] truncate">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 capitalize">{p.category}</td>
                  <td className="px-4 py-4 font-semibold text-primary-700">
                    {p.price === 0 ? 'Free' : `₹${p.price.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-4 text-gray-500 flex items-center gap-1">
                    <Eye size={13} /> {p.views || 0}
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => toggleStatus(p.id, p.status)} className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                      p.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      {p.status === 'active' ? 'Active' : 'Paused'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/seller/products/edit/${p.id}`} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </Link>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
