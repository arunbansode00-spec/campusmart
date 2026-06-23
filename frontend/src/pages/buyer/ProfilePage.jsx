import { useState } from 'react'
import { User, Mail, Phone, Shield } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { profile, fetchProfile, user } = useAuthStore()
  const [form, setForm] = useState({ full_name: profile?.full_name || '', whatsapp: profile?.whatsapp || '' })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase.from('profiles').update(form).eq('id', user.id)
    if (error) toast.error('Update failed')
    else { await fetchProfile(user.id); toast.success('Profile updated!') }
    setLoading(false)
  }

  const requestSeller = async () => {
    const { error } = await supabase.from('profiles').update({ role: 'seller' }).eq('id', user.id)
    if (error) toast.error('Failed')
    else { await fetchProfile(user.id); toast.success('You are now a seller! Go to Seller Dashboard.') }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
      <div className="card p-8 space-y-5">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
            <User size={28} className="text-primary-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{profile?.full_name}</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full">{profile?.role}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><Mail size={14} /> Email</label>
          <input value={profile?.email} disabled className="input opacity-60 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><Phone size={14} /> WhatsApp</label>
          <input value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} className="input" placeholder="+91 9876543210" />
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        {profile?.role === 'student' && (
          <div className="border-t border-gray-100 pt-5">
            <div className="bg-primary-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2"><Shield size={15} className="text-primary-600" /> Want to sell?</h3>
              <p className="text-sm text-gray-500 mb-3">Become a seller to list your products on CampusMart.</p>
              <button onClick={requestSeller} className="btn-secondary text-sm py-2">Become a Seller</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
