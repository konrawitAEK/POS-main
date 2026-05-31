'use client'
import { useEffect, useState } from 'react'
import { productService, type CreateProductRequest } from '@/services/productService'
import { categoryService, type Category } from '@/services/categoryService'
import toast from 'react-hot-toast'
import { FiX } from 'react-icons/fi'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const EMPTY: CreateProductRequest = { name: '', barcode: '', price: 0, costPrice: 0, categoryId: undefined }

export default function ProductDrawer({ open, onClose, onSuccess }: Props) {
  const [form,       setForm]       = useState<CreateProductRequest>(EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) setForm(EMPTY)
  }, [open])

  const set = (field: keyof CreateProductRequest, value: string | number | undefined) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await productService.create({
        ...form,
        price:      Number(form.price),
        costPrice:  Number(form.costPrice),
        categoryId: form.categoryId || undefined,
        barcode:    form.barcode || undefined,
      })
      toast.success('เพิ่มสินค้าสำเร็จ')
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col
        transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">เพิ่มสินค้าใหม่</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า <span className="text-red-500">*</span></label>
            <input
              className="input"
              placeholder="ชื่อสินค้า"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">บาร์โค้ด</label>
            <input
              className="input font-mono"
              placeholder="บาร์โค้ด (ถ้ามี)"
              value={form.barcode ?? ''}
              onChange={e => set('barcode', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคาขาย (฿) <span className="text-red-500">*</span></label>
              <input
                className="input"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={form.price || ''}
                onChange={e => set('price', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคาทุน (฿) <span className="text-red-500">*</span></label>
              <input
                className="input"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={form.costPrice || ''}
                onChange={e => set('costPrice', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
            <select
              className="input"
              value={form.categoryId ?? ''}
              onChange={e => set('categoryId', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">-- ไม่ระบุหมวดหมู่ --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              ยกเลิก
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
