import { useState, useEffect } from 'react'
import { Search, Shield, UserX, RefreshCw } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'

const ROLES = ['student', 'seller', 'admin', 'super_admin']

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetch = async () => {
    setLoading(true)
    let q = supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (search) q = q.ilike('full_name', `%${search}%`)
    const { data } = await q
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [search])

  const updateRole = async (id, role) => {
    await supabase.from('profiles').update({ role }).eq('id', id)
    toast.success('Role updated')
    fetch()
  }

  const toggleSuspend = async (id, suspended) => {
    await supabase.from('profiles').update({ suspended: !suspended }).eq('id', id)
    toast.success(suspended ? 'User unsuspended' : 'User suspended')
    fetch()
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">User Management</h1>
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input pl-10 py-2.5 text-sm" />
        </div>
        <button onClick={fetch} className="btn-secondary py-2.5 px-4 flex items-center gap-2 text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-4">User</th>
              <th className="text-left px-4 py-4">Email</th>
              <th className="text-left px-4 py-4">Role</th>
              <th className="text-left px-4 py-4">Joined</th>
              <th className="text-left px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(user => (
              <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.suspended ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                      {user.full_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      {user.suspended && <span className="text-xs text-red-500 font-medium">Suspended</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-500 text-xs">{user.email}</td>
                <td className="px-4 py-4">
                  <select
                    value={user.role}
                    onChange={e => updateRole(user.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4 text-gray-400 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => toggleSuspend(user.id, user.suspended)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      user.suspended
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {user.suspended ? <><RefreshCw size={11} /> Unsuspend</> : <><UserX size={11} /> Suspend</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-8 text-gray-400">Loading...</div>}
      </div>
    </div>
  )
}
