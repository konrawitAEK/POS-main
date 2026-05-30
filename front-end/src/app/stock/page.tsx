'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FiAlertTriangle } from 'react-icons/fi'
import clsx from 'clsx'

interface StockItem { id: number; productId: number; productName: string; quantity: number; minQuantity: number; maxQuantity: number; lowStock: boolean }

export default function StockPage() {
  const [stocks,    setStocks]    = useState<StockItem[]>([])
  const [adjustId,  setAdjustId]  = useState<number | null>(null)
  const [adjustQty, setAdjustQty] = useState(0)

  const fetch = () => api.get('/api/stock').then(r => setStocks(r.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const save = async (productId: number) => {
    await api.patch(`/api/stock/${productId}/adjust`, { quantity: adjustQty })
    toast.success('ปรับสต็อกสำเร็จ'); setAdjustId(null); fetch()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">จัดการสต็อกสินค้า</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">สินค้า</th>
              <th className="pb-3 font-medium text-center">คงเหลือ</th>
              <th className="pb-3 font-medium text-center">ขั้นต่ำ</th>
              <th className="pb-3 font-medium text-center">สถานะ</th>
              <th className="pb-3 font-medium text-center">ปรับสต็อก</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stocks.map(s => (
              <tr key={s.id} className={clsx('hover:bg-gray-50', s.lowStock && 'bg-red-50')}>
                <td className="py-3 font-medium">{s.productName}</td>
                <td className="py-3 text-center font-bold">{s.quantity}</td>
                <td className="py-3 text-center text-gray-500">{s.minQuantity}</td>
                <td className="py-3 text-center">
                  {s.lowStock
                    ? <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full"><FiAlertTriangle size={12} />ใกล้หมด</span>
                    : <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">ปกติ</span>}
                </td>
                <td className="py-3 text-center">
                  {adjustId === s.productId ? (
                    <div className="flex items-center justify-center gap-2">
                      <input type="number" className="w-20 border rounded px-2 py-1 text-sm text-center"
                        value={adjustQty} onChange={e => setAdjustQty(+e.target.value)} />
                      <button onClick={() => save(s.productId)} className="btn-primary text-xs py-1 px-3">บันทึก</button>
                      <button onClick={() => setAdjustId(null)} className="btn-secondary text-xs py-1 px-3">ยกเลิก</button>
                    </div>
                  ) : (
                    <button onClick={() => { setAdjustId(s.productId); setAdjustQty(0) }}
                      className="text-blue-500 hover:text-blue-700 text-sm underline">ปรับ</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
