import { useState, useEffect } from 'react'
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 })
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const [{ count: users }, { count: products }, { data: orders }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price, status'),
      ])
      const revenue = orders?.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total_price || 0), 0) || 0
      setStats({ users: users || 0, products: products || 0, orders: orders?.length || 0, revenue })

      const { data: ru } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
      setRecentUsers(ru || [])
    }
    fetch()
  }, [])

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Products Listed', value: stats.products, icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-orange-50 text-orange-600' },
    { label: 'Platform Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
  ]

  const chartData = [
    { month: 'Jan', users: 12, products: 34 },
    { month: 'Feb', users: 28, products: 67 },
    { month: 'Mar', users: 45, products: 98 },
    { month: 'Apr', users: 78, products: 145 },
    { month: 'May', users: 102, products: 210 },
    { month: 'Jun', users: 134, products: 267 },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

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

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="products" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{u.full_name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  u.role === 'admin' ? 'bg-red-100 text-red-700' :
                  u.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
