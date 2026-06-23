import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle, MapPin } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, total, clear } = useCartStore()
  const { user, profile } = useAuthStore()
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  if (items.length === 0 && !done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-lg font-semibold text-gray-600">Your cart is empty</p>
        <Link to="/" className="btn-primary mt-4 inline-block">Browse Products</Link>
      </div>
    )
  }

  if (done) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
      <p className="text-gray-500 mb-6">The seller will contact you on WhatsApp to arrange pickup/delivery on campus.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/orders" className="btn-primary">View Orders</Link>
        <Link to="/" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  )

  const handleOrder = async () => {
    if (!address.trim()) { toast.error('Please enter a pickup/meeting location'); return }
    setLoading(true)
    try {
      for (const item of items) {
        await supabase.from('orders').insert({
          buyer_id: user.id,
          seller_id: item.seller_id,
          product_id: item.id,
          quantity: item.qty,
          total_price: item.price * item.qty,
          address,
          note,
          status: 'pending',
        })
      }
      clear()
      setDone(true)
      toast.success('Order placed!')
    } catch (err) {
      toast.error('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={16} className="text-primary-500" /> Meeting Location</h3>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g., Main Block Canteen, Hostel A Gate, Library Entrance..."
              className="input min-h-[100px] resize-none"
              required
            />
            <p className="text-xs text-gray-400 mt-2">This is where you'll meet the seller to exchange the item.</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Note to Seller (Optional)</h3>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Any specific requests or timing preferences..."
              className="input min-h-[80px] resize-none"
            />
          </div>
          <div className="card p-4 bg-yellow-50 border-yellow-100">
            <p className="text-sm text-yellow-800">
              💡 <strong>Payment on delivery.</strong> Pay the seller cash when you meet on campus. The seller will contact you on WhatsApp.
            </p>
          </div>
        </div>

        <div>
          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.images?.[0] || 'https://placehold.co/60x60/e0e7ff/4338ca?text=P'} alt="" className="w-12 h-12 object-cover rounded-lg" onError={e => { e.target.src = 'https://placehold.co/60x60/e0e7ff/4338ca?text=P' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-semibold">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total to Pay (COD)</span>
                <span className="text-primary-700 text-lg">₹{total().toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleOrder} disabled={loading} className="btn-primary w-full py-3.5 text-base disabled:opacity-60">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
