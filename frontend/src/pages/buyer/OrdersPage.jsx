import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../store/authStore'

const STATUS_CONFIG = {
  pending:   { icon: Clock,        color: 'text-yellow-600 bg-yellow-50',  label: 'Pending' },
  confirmed: { icon: CheckCircle,  color: 'text-blue-600 bg-blue-50',      label: 'Confirmed' },
  delivered: { icon: CheckCircle,  color: 'text-green-600 bg-green-50',    label: 'Delivered' },
  cancelled: { icon: XCircle,      color: 'text-red-600 bg-red-50',        label: 'Cancelled' },
}

export default function OrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, products(title, images, price), profiles!seller_id(full_name, whatsapp)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    fetch()
  }, [user.id])

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Loading orders...</div>

  if (orders.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">📦</p>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
      <p className="text-gray-500 mb-6">Your order history will appear here</p>
      <Link to="/" className="btn-primary">Start Shopping</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const S = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
          const Icon = S.icon
          return (
            <div key={order.id} className="card p-5 flex gap-4">
              <img
                src={order.products?.images?.[0] || 'https://placehold.co/80x80/e0e7ff/4338ca?text=P'}
                alt=""
                className="w-16 h-16 object-cover rounded-xl bg-gray-50"
                onError={e => { e.target.src = 'https://placehold.co/80x80/e0e7ff/4338ca?text=P' }}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{order.products?.title}</h3>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${S.color}`}>
                    <Icon size={12} /> {S.label}
                  </span>
                </div>
                <p className="text-primary-700 font-bold mt-1">₹{order.total_price?.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Seller: {order.profiles?.full_name} · {new Date(order.created_at).toLocaleDateString()}
                </p>
                {order.profiles?.whatsapp && order.status === 'pending' && (
                  <a
                    href={`https://wa.me/${order.profiles.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent('Hi! I just placed an order on CampusMart. Can we arrange pickup?')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg font-medium transition-colors"
                  >
                    📱 Contact Seller on WhatsApp
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
