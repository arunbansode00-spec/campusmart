import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { CATEGORIES } from '../../utils/constants'

const COLORS = ['#6366f1', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

export default function AdminReports() {
  const [catData, setCatData] = useState([])
  const [orderStats, setOrderStats] = useState([])
  const [summary, setSummary] = useState({ totalRevenue: 0, avgOrderValue: 0, topCategory: '' })

  useEffect(() => {
    const fetch = async () => {
      const { data: products } = await supabase.from('products').select('category')
      const catCount = {}
      products?.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1 })
      const catArr = Object.entries(catCount)
        .map(([name, count]) => {
          const cat = CATEGORIES.find(c => c.id === name)
          return { name: cat?.label || name, count }
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 7)
      setCatData(catArr)

      const { data: orders } = await supabase.from('orders').select('status, total_price')
      const statusCount = {}
      orders?.forEach(o => { statusCount[o.status] = (statusCount[o.status] || 0) + 1 })
      setOrderStats(Object.entries(statusCount).map(([name, value]) => ({ name, value })))

      const delivered = orders?.filter(o => o.status === 'delivered') || []
      const revenue = delivered.reduce((s, o) => s + (o.total_price || 0), 0)
      setSummary({
        totalRevenue: revenue,
        avgOrderValue: delivered.length ? Math.round(revenue / delivered.length) : 0,
        topCategory: catArr[0]?.name || 'N/A',
      })
    }
    fetch()
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Platform Reports</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-5 text-center">
          <p className="text-2xl font-bold text-primary-700">₹{summary.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Total Revenue (Delivered)</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-2xl font-bold text-primary-700">₹{summary.avgOrderValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Avg Order Value</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-xl font-bold text-primary-700">{summary.topCategory}</p>
          <p className="text-xs text-gray-500 mt-1">Top Category</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          {orderStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={orderStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {orderStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">No order data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
