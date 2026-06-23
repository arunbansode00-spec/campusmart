import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', whatsapp: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    try {
      await register(form.email, form.password, form.fullName, form.whatsapp)
      toast.success('Account created! Please check your email to verify.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Store size={22} className="text-white" />
            </div>
            <span className="font-display text-2xl font-extrabold text-primary-900">
              Campus<span className="text-accent-500">Mart</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Join CampusMart</h1>
          <p className="text-gray-500 text-sm mt-1">MIT Manipal students only</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input value={form.fullName} onChange={set('fullName')} placeholder="Your full name" className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">MIT Manipal Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="yourname@learner.manipal.edu" className="input" required />
              <p className="text-xs text-gray-400 mt-1">Must be @learner.manipal.edu or @manipal.edu</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
              <input type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+91 9876543210" className="input" required />
              <p className="text-xs text-gray-400 mt-1">Buyers will contact you on this number</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min 6 characters" className="input pr-12" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password" className="input" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-60">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
