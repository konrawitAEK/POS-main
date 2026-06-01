'use client'
import { useEffect, useState } from 'react'
import { productService, type Product } from '@/services/productService'
import { categoryService, type Category } from '@/services/categoryService'
import ProductDrawer from '@/components/ProductDrawer'
import toast from 'react-hot-toast'
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiFilter } from 'react-icons/fi'

export default function ProductsPage() {
  const [products,        setProducts]        = useState<Product[]>([])
  const [search,          setSearch]          = useState('')
  const [categoryFilter,  setCategoryFilter]  = useState<number | undefined>(undefined)
  const [categories,      setCategories]      = useState<Category[]>([])
  const [loading,         setLoading]         = useState(false)
  const [drawerOpen,      setDrawerOpen]      = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const load = () => {
    setLoading(true)
    productService.getAll(search, categoryFilter)
      .then(r => setProducts(r.content))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    productService.getAll(search, categoryFilter)
      .then(r => setProducts(r.content))
      .finally(() => setLoading(false))
  }, [search, categoryFilter])

  const openCreate = () => {
    setSelectedProduct(null)
    setDrawerOpen(true)
  }

  const openEdit = (p: Product) => {
    setSelectedProduct(p)
    setDrawerOpen(true)
  }

  const handleClose = () => {
    setDrawerOpen(false)
    setSelectedProduct(null)
  }

  const remove = async (id: number) => {
    if (!confirm('ยืนยันการลบสินค้า?')) return
    await productService.remove(id)
    toast.success('ลบสินค้าแล้ว')
    load()
  }

  return (
    <div>
      <ProductDrawer
        open={drawerOpen}
        onClose={handleClose}
        onSuccess={load}
        editProduct={selectedProduct}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus />เพิ่มสินค้า
        </button>
      </div>

      <div className="card">
        {/* Search + Filter row */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-10"
              placeholder="ค้นหาชื่อสินค้าหรือบาร์โค้ด..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              className="input pl-9 pr-8 min-w-[160px]"
              value={categoryFilter ?? ''}
              onChange={e => setCategoryFilter(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">ทุกหมวดหมู่</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">ชื่อสินค้า</th>
              <th className="pb-3 font-medium">บาร์โค้ด</th>
              <th className="pb-3 font-medium">หมวดหมู่</th>
              <th className="pb-3 font-medium">แบรน</th>
              <th className="pb-3 font-medium text-right">ราคาขาย</th>
              <th className="pb-3 font-medium text-right">ราคาทุน</th>
              <th className="pb-3 font-medium text-center">สต็อก</th>
              <th className="pb-3 font-medium text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">กำลังโหลด...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">ไม่พบสินค้า</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 font-medium">{p.name}</td>
                <td className="py-3 text-gray-500 font-mono text-xs">{p.barcode || '-'}</td>
                <td className="py-3 text-gray-500">{p.categoryName || '-'}</td>
                <td className="py-3 text-gray-500">{p.supplierName || '-'}</td>
                <td className="py-3 text-right text-blue-600 font-medium">฿{p.price?.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-500">฿{p.costPrice?.toLocaleString()}</td>
                <td className="py-3 text-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                    ${(p.stockQuantity ?? 0) <= 5
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-700'}`}>
                    {p.stockQuantity ?? 0}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-blue-500 hover:text-blue-700"
                      title="แก้ไข"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-red-400 hover:text-red-600"
                      title="ลบ"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
