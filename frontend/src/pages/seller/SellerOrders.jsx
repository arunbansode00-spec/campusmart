import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled']

export default function SellerOrders() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, products(title, images), profiles!buyer_id(full_name, whatsapp)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [user.id])

  const updateStatus = async (id, status, productId) => {
    await supabase.from('orders').update({ status }).eq('id', id)

    if (status === 'delivered') {
      await supabase.from('products').update({ status: 'paused' }).eq('id', productId)
      toast.success('Order delivered! Listing marked as sold automatically.')
    } else if (status === 'cancelled') {
      await supabase.from('products').update({ status: 'active' }).eq('id', productId)
      toast.success('Order cancelled. Listing is active again.')
    } else {
      toast.success(`Order marked as ${status}`)
    }
    fetchOrders()
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Loading orders...</div>

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="font-medium text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex gap-4">
                <img
                  src={order.products?.images?.[0] || 'https://placehold.co/64x64/e0e7ff/4338ca?text=P'}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover"
                  onError={e => { e.target.src = 'https://placehold.co/64x64/e0e7ff/4338ca?text=P' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{order.products?.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Buyer: {order.profiles?.full_name} · {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      {order.address && <p className="text-xs text-gray-400 mt-0.5">📍 {order.address}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold text-primary-700">₹{order.total_price?.toLocaleString()}</span>
                      {order.status === 'delivered' && (
                        <p className="text-[10px] text-green-600 font-semibold mt-0.5">✅ Listing auto-paused</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    {order.profiles?.whatsapp && (

                        href={`https://wa.me/${order.profiles.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent('Hi! I got your order on CampusMart. Let\'s arrange pickup.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        📱 WhatsApp Buyer
                      </a>
                    )}
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value, order.product_id)}
                      className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}