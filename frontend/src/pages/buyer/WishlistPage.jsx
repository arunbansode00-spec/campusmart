import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useWishlistStore } from '../../store/wishlistStore'
import ProductCard from '../../components/product/ProductCard'

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore()

  if (items.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">🤍</p>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Wishlist is empty</h2>
      <p className="text-gray-500 mb-6">Save items you love and come back to them later</p>
      <Link to="/" className="btn-primary">Explore Products</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">My Wishlist ({items.length} items)</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
