import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import { CATEGORIES, CONDITIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', condition: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({ title: data.title, description: data.description || '', price: data.price, category: data.category, condition: data.condition })
    })
  }, [id])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('products').update({
      title: form.title, description: form.description,
      price: Number(form.price), category: form.category, condition: form.condition,
    }).eq('id', id)
    if (error) toast.error('Update failed')
    else { toast.success('Product updated!'); navigate('/seller/products') }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="card p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
          <input value={form.title} onChange={set('title')} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea value={form.description} onChange={set('description')} className="input min-h-[100px] resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={set('category')} className="input">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
            <select value={form.condition} onChange={set('condition')} className="input">
              {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
          <input type="number" min="0" value={form.price} onChange={set('price')} className="input" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/seller/products')} className="btn-secondary py-3 px-8">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
