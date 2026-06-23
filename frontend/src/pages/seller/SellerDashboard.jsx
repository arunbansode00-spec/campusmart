import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Eye, TrendingUp, PlusCircle } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../store/authStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function SellerDashboard() {
  const { user, profile } = useAuthStore()
  const [stats, setStats] = useState({ products: 0, orders: 0, views: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data: products } = await supabase.from('products').select('id, views').eq('seller_id', user.id)
      const totalViews = products?.reduce((s, p) => s + (p.views || 0), 0) || 0

      const { data: orders } = await supabase.from('orders').select('*').eq('seller_id', user.id)
      const revenue = orders?.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total_price || 0), 0) || 0

      setStats({ products: products?.length || 0, orders: orders?.length || 0, views: totalViews, revenue })

      const { data: recent } = await supabase
        .from('orders')
        .select('*, products(title), profiles!buyer_id(full_name)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentOrders(recent || [])

      // Simple weekly chart mock
      setChartData([
        { day: 'Mon', orders: 2 }, { day: 'Tue', orders: 5 },
        { day: 'Wed', orders: 3 }, { day: 'Thu', orders: 7 },
        { day: 'Fri', orders: 4 }, { day: 'Sat', orders: 8 },
        { day: 'Sun', orders: 6 },
      ])
    }
    fetch()
  }, [user.id])

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Views', value: stats.views, icon: Eye, color: 'bg-orange-50 text-orange-600' },
    { label: 'Revenue (COD)', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {profile?.full_name?.split(' ')[0]}</p>
        </div>
        <Link to="/seller/products/add" className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Orders This Week</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{order.products?.title}</p>
                    <p className="text-xs text-gray-400">{order.profiles?.full_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-700">₹{order.total_price?.toLocaleString()}</p>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
