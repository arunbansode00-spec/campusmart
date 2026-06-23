import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, MapPin } from 'lucide-react'
import { useWishlistStore } from '../../store/wishlistStore'
import { useCartStore } from '../../store/cartStore'
import { CONDITION_COLORS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { toggle, has } = useWishlistStore()
  const addItem = useCartStore(s => s.addItem)
  const wishlisted = has(product.id)

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleCart = (e) => {
    e.preventDefault()
    addItem(product)
    toast.success('Added to cart')
  }

  const img = product.images?.[0] || `https://placehold.co/400x300/e0e7ff/4338ca?text=${encodeURIComponent(product.title?.slice(0,10) || 'Product')}`

  return (
    <Link to={`/product/${product.id}`} className="product-card card block overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={img}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = `https://placehold.co/400x300/e0e7ff/4338ca?text=No+Image` }}
        />
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart size={15} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
        </button>
        {product.condition && (
          <span className={`absolute top-2.5 left-2.5 ${CONDITION_COLORS[product.condition]} text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full`}>
            {product.condition.replace('_', ' ')}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] text-primary-500 font-semibold uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors">{product.title}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <MapPin size={11} />
          <span>{product.profiles?.full_name || 'Campus Seller'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-700">
            {product.price === 0 ? <span className="text-green-600">Free</span> : `₹${product.price.toLocaleString()}`}
          </span>
          <button
            onClick={handleCart}
            className="w-8 h-8 bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  )
}
