'use client'
import { useEffect, useRef, useState } from 'react'
import { productService, type CreateProductRequest, type Product } from '@/services/productService'
import { categoryService, type Category } from '@/services/categoryService'
import { supplierService, type Supplier } from '@/services/supplierService'
import { stockService } from '@/services/stockService'
import toast from 'react-hot-toast'
import { FiX, FiMinus, FiPlus } from 'react-icons/fi'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  editProduct?: Product | null
}

type FormState = CreateProductRequest & { id?: number; stockQuantity?: number }

const EMPTY: FormState = {
  name: '', barcode: '', price: 0, costPrice: 0,
  categoryId: undefined, supplierId: undefined,
}

export default function ProductDrawer({ open, onClose, onSuccess, editProduct }: Props) {
  const [form,             setForm]             = useState<FormState>(EMPTY)
  const [categories,       setCategories]       = useState<Category[]>([])
  const [suppliers,        setSuppliers]        = useState<Supplier[]>([])
  const [loading,          setLoading]          = useState(false)
  const [stockDelta,       setStockDelta]       = useState(0)
  const [barcodeChecking,  setBarcodeChecking]  = useState(false)

  const prevBarcode = useRef('')

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {})
    supplierService.getAll().then(setSuppliers).catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) {
      setForm(EMPTY)
      setStockDelta(0)
      prevBarcode.current = ''
      return
    }
    if (editProduct) {
      setForm({
        id:            editProduct.id,
        name:          editProduct.name,
        barcode:       editProduct.barcode ?? '',
        price:         editProduct.price,
        costPrice:     editProduct.costPrice,
        categoryId:    editProduct.categoryId,
        supplierId:    editProduct.supplierId,
        stockQuantity: editProduct.stockQuantity,
      })
      prevBarcode.current = editProduct.barcode ?? ''
    }
  }, [open, editProduct])

  const set = (field: keyof FormState, value: string | number | undefined) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleBarcodeBlur = async () => {
    const barcode = (form.barcode ?? '').trim()
    if (!barcode || barcode === prevBarcode.current) return
    setBarcodeChecking(true)
    try {
      const found = await productService.getByBarcode(barcode)
      setForm({
        id:            found.id,
        name:          found.name,
        barcode:       found.barcode ?? '',
        price:         found.price,
        costPrice:     found.costPrice,
        categoryId:    found.categoryId,
        supplierId:    found.supplierId,
        stockQuantity: found.stockQuantity,
      })
      prevBarcode.current = barcode
      toast.success('พบสินค้าในระบบแล้ว')
    } catch {
      // barcode not found — keep create mode
    } finally {
      setBarcodeChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: CreateProductRequest = {
        name:       form.name,
        barcode:    form.barcode || undefined,
        price:      Number(form.price),
        costPrice:  Number(form.costPrice),
        categoryId: form.categoryId || undefined,
        supplierId: form.supplierId || undefined,
      }

      let saved: Product
      if (form.id) {
        saved = await productService.update(form.id, payload)
        toast.success('แก้ไขสินค้าแล้ว')
      } else {
        saved = await productService.create(payload)
        toast.success('เพิ่มสินค้าสำเร็จ')
      }

      if (stockDelta !== 0) {
        await stockService.adjust(saved.id, stockDelta)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const isEditMode      = Boolean(form.id)
  const currentStock    = (form.stockQuantity ?? 0) + stockDelta
  const stockAfterSave  = currentStock

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50
        flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold">
              {isEditMode ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
            </h2>
            {isEditMode && (
              <p className="text-xs text-blue-500 mt-0.5">{`#${form.id} · กำลังแก้ไข`}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-5">

          {/* ชื่อสินค้า */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อสินค้า <span className="text-red-500">*</span>
            </label>
            <input
              className="input"
              placeholder="ชื่อสินค้า"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              autoFocus={!isEditMode}
            />
          </div>

          {/* บาร์โค้ด */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">บาร์โค้ด</label>
            <div className="relative">
              <input
                className="input font-mono pr-10"
                placeholder="สแกนหรือพิมพ์บาร์โค้ด"
                value={form.barcode ?? ''}
                onChange={e => set('barcode', e.target.value)}
                onBlur={handleBarcodeBlur}
              />
              {barcodeChecking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {isEditMode && (
              <p className="mt-1 text-xs text-emerald-600">✓ พบสินค้าในระบบ</p>
            )}
          </div>

          {/* ราคา */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ราคาขาย (฿) <span className="text-red-500">*</span>
              </label>
              <input
                className="input"
                type="number" min={0} step="0.01" placeholder="0.00"
                value={form.price || ''}
                onChange={e => set('price', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคาทุน (฿)</label>
              <input
                className="input"
                type="number" min={0} step="0.01" placeholder="0.00"
                value={form.costPrice || ''}
                onChange={e => set('costPrice', e.target.value)}
              />
            </div>
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
            <select
              className="input"
              value={form.categoryId ?? ''}
              onChange={e => set('categoryId', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">-- ไม่ระบุ --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* แบรน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">แบรน</label>
            <select
              className="input"
              value={form.supplierId ?? ''}
              onChange={e => set('supplierId', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">-- ไม่ระบุ --</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* จัดการสต็อก */}
          <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">จัดการสต็อก</h3>

            {isEditMode ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">สต็อกปัจจุบัน</span>
                  <span className="font-bold text-lg">{form.stockQuantity ?? 0} ชิ้น</span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">ปรับจำนวน (+ รับเข้า / − ตัดออก)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStockDelta(d => d - 1)}
                      className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center
                        hover:bg-red-50 hover:border-red-300 text-red-500 transition-colors"
                    >
                      <FiMinus size={14} />
                    </button>
                    <input
                      type="number"
                      className="input text-center flex-1"
                      value={stockDelta}
                      onChange={e => setStockDelta(Number(e.target.value))}
                    />
                    <button
                      type="button"
                      onClick={() => setStockDelta(d => d + 1)}
                      className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center
                        hover:bg-green-50 hover:border-green-300 text-green-500 transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  {stockDelta !== 0 && (
                    <p className={`mt-1.5 text-xs font-medium ${stockDelta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {stockDelta > 0 ? `+${stockDelta}` : stockDelta} ชิ้น → คงเหลือ {stockAfterSave} ชิ้น
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm text-gray-500 mb-2">จำนวนสต็อกเริ่มต้น</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStockDelta(d => Math.max(0, d - 1))}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center
                      hover:bg-red-50 hover:border-red-300 text-red-500 transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <input
                    type="number"
                    className="input text-center flex-1"
                    min={0}
                    value={stockDelta}
                    onChange={e => setStockDelta(Math.max(0, Number(e.target.value)))}
                  />
                  <button
                    type="button"
                    onClick={() => setStockDelta(d => d + 1)}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center
                      hover:bg-green-50 hover:border-green-300 text-green-500 transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">ยกเลิก</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>

        </form>
      </div>
    </>
  )
}
