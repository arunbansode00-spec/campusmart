import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Loader } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../store/authStore'
import { CATEGORIES, CONDITIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function AddProduct() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: '', condition: 'good',
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 4)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removeImage = (i) => {
    setImages(imgs => imgs.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.condition) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      // Upload images
      const imageUrls = []
      for (const img of images) {
        const ext = img.name.split('.').pop()
        const path = `products/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('product-images').upload(path, img)
        if (!error) {
          const { data } = supabase.storage.from('product-images').getPublicUrl(path)
          imageUrls.push(data.publicUrl)
        }
      }

      const { error } = await supabase.from('products').insert({
        title: form.title,
        description: form.description,
        price: Number(form.price) || 0,
        category: form.category,
        condition: form.condition,
        images: imageUrls,
        seller_id: user.id,
        status: 'active',
        views: 0,
      })

      if (error) throw error
      toast.success('Product listed successfully!')
      navigate('/seller/products')
    } catch (err) {
      toast.error(err.message || 'Failed to add product')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Title *</label>
            <input value={form.title} onChange={set('title')} placeholder="e.g., Engineering Physics Textbook (Halliday)" className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} placeholder="Describe your item — condition details, edition, why you're selling..." className="input min-h-[120px] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select value={form.category} onChange={set('category')} className="input" required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition *</label>
              <select value={form.condition} onChange={set('condition')} className="input">
                {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
            <input type="number" min="0" value={form.price} onChange={set('price')} placeholder="0 for free" className="input" />
            <p className="text-xs text-gray-400 mt-1">Leave 0 if you're giving it away for free</p>
          </div>
        </div>

        {/* Image upload */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Product Images (up to 4)</label>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X size={10} />
                </button>
              </div>
            ))}
            {previews.length < 4 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-primary-50">
                <Upload size={20} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Add photo</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400">JPG, PNG, WebP. Good photos = more buyers!</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><Loader size={18} className="animate-spin" /> Listing Product...</> : 'List Product on CampusMart'}
        </button>
      </form>
    </div>
  )
}
