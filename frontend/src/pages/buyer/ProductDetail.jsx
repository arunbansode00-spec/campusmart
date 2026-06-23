import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, MessageCircle, Share2, ArrowLeft, User } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { CONDITION_COLORS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore(s => s.addItem)
  const { toggle, has } = useWishlistStore()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, profiles(full_name, whatsapp, email)')
        .eq('id', id)
        .single()
      setProduct(data)
      // Increment views
      if (data) await supabase.from('products').update({ views: (data.views || 0) + 1 }).eq('id', id)
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded w-2/3" />
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-lg font-semibold">Product not found</p>
      <Link to="/" className="btn-primary mt-4 inline-block">Go Home</Link>
    </div>
  )

  const images = product.images?.length > 0
    ? product.images
    : [`https://placehold.co/600x500/e0e7ff/4338ca?text=${encodeURIComponent(product.title?.slice(0,10) || 'Product')}`]

  const whatsappLink = product.profiles?.whatsapp
    ? `https://wa.me/${product.profiles.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi! I'm interested in your listing on CampusMart: "${product.title}" (₹${product.price}). Is it still available?`)}`
    : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to listings
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-square mb-3">
            <img src={images[activeImg]} alt={product.title} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://placehold.co/600x500/e0e7ff/4338ca?text=No+Image' }} />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-primary-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full">{product.category}</span>
            {product.condition && (
              <span className={`${CONDITION_COLORS[product.condition]} text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>
                {product.condition.replace('_', ' ')}
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl font-bold text-gray-900 mb-3 leading-snug">{product.title}</h1>

          <div className="text-3xl font-extrabold text-primary-700 mb-4">
            {product.price === 0 ? <span className="text-green-600">Free</span> : `₹${product.price.toLocaleString()}`}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Seller info */}
          <div className="card p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Listed by</p>
              <p className="font-semibold text-gray-800">{product.profiles?.full_name}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors">
                <MessageCircle size={18} />
                Contact Seller on WhatsApp
              </a>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { addItem(product); toast.success('Added to cart') }} className="btn-primary py-3 flex items-center justify-center gap-2">
                <ShoppingCart size={17} /> Add to Cart
              </button>
              <button onClick={() => { toggle(product); toast.success(has(product.id) ? 'Removed from wishlist' : 'Added to wishlist') }} className={`btn-secondary py-3 flex items-center justify-center gap-2 ${has(product.id) ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100' : ''}`}>
                <Heart size={17} className={has(product.id) ? 'fill-red-500' : ''} />
                {has(product.id) ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
