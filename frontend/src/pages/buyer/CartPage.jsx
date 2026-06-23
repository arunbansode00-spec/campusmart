import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCartStore()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">🛒</p>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Start adding products from the marketplace</p>
      <Link to="/" className="btn-primary">Browse Products</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <img
                src={item.images?.[0] || `https://placehold.co/100x100/e0e7ff/4338ca?text=Item`}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-xl bg-gray-50"
                onError={e => { e.target.src = 'https://placehold.co/100x100/e0e7ff/4338ca?text=Item' }}
              />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-primary-700 text-sm leading-snug line-clamp-2">{item.title}</Link>
                <p className="text-primary-700 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                    <Plus size={13} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
                <span className="font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {items.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span className="truncate max-w-[150px]">{i.title}</span>
                  <span>₹{(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="text-primary-700">₹{total().toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Payment on delivery (meet on campus)</p>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <ShoppingBag size={18} /> Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
