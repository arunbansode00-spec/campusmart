import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      let q = supabase
        .from('orders')
        .select('*, products(title, images), profiles!buyer_id(full_name), profiles!seller_id(full_name)')
        .order('created_at', { ascending: false })
      if (filter) q = q.eq('status', filter)
      const { data } = await q
      setOrders(data || [])
      setLoading(false)
    }
    fetch()
  }, [filter])

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">All Orders</h1>
      <div className="flex gap-2 mb-6">
        {['', 'pending', 'confirmed', 'delivered', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="font-medium">No orders found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-4 py-4">Buyer</th>
                <th className="text-left px-4 py-4">Seller</th>
                <th className="text-left px-4 py-4">Amount</th>
                <th className="text-left px-4 py-4">Status</th>
                <th className="text-left px-4 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.products?.images?.[0] || 'https://placehold.co/40x40/e0e7ff/4338ca?text=P'}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover"
                        onError={e => { e.target.src = 'https://placehold.co/40x40/e0e7ff/4338ca?text=P' }}
                      />
                      <span className="font-medium text-gray-800 max-w-[140px] truncate text-xs">{order.products?.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-xs">{order.profiles?.full_name}</td>
                  <td className="px-4 py-4 text-gray-600 text-xs">{order.seller?.full_name || '—'}</td>
                  <td className="px-4 py-4 font-bold text-primary-700">₹{order.total_price?.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
