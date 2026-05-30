'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FiSearch, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

interface Product { id: number; name: string; barcode: string; price: number; costPrice: number; categoryName?: string }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(false)

  const fetch = async () => {
    setLoading(true)
    api.get(`/api/products?q=${search}&size=50`).then(r => setProducts(r.data.content || [])).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [search])

  const remove = async (id: number) => {
    if (!confirm('ยืนยันการลบสินค้า?')) return
    await api.delete(`/api/products/${id}`)
    toast.success('ลบสินค้าแล้ว')
    fetch()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
        <button className="btn-primary flex items-center gap-2"><FiPlus />เพิ่มสินค้า</button>
      </div>
      <div className="card">
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder="ค้นหาสินค้า..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">ชื่อสินค้า</th>
              <th className="pb-3 font-medium">บาร์โค้ด</th>
              <th className="pb-3 font-medium">หมวดหมู่</th>
              <th className="pb-3 font-medium text-right">ราคาขาย</th>
              <th className="pb-3 font-medium text-right">ราคาทุน</th>
              <th className="pb-3 font-medium text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">กำลังโหลด...</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 font-medium">{p.name}</td>
                <td className="py-3 text-gray-500 font-mono text-xs">{p.barcode || '-'}</td>
                <td className="py-3 text-gray-500">{p.categoryName || '-'}</td>
                <td className="py-3 text-right text-blue-600 font-medium">฿{p.price?.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-500">฿{p.costPrice?.toLocaleString()}</td>
                <td className="py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-blue-500 hover:text-blue-700"><FiEdit2 /></button>
                    <button onClick={() => remove(p.id)} className="text-red-400 hover:text-red-600"><FiTrash2 /></button>
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
