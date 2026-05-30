'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface Order { id: number; orderNumber: string; status: string; total: number; createdAt: string; userName: string }

const statusLabel: Record<string, string> = { COMPLETED:'สำเร็จ', PENDING:'รอ', CANCELLED:'ยกเลิก', REFUNDED:'คืนเงิน' }
const statusColor: Record<string, string> = {
  COMPLETED:'bg-green-100 text-green-700', PENDING:'bg-yellow-100 text-yellow-700',
  CANCELLED:'bg-red-100 text-red-700',     REFUNDED:'bg-gray-100 text-gray-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.get('/api/orders?size=50').then(r => setOrders(r.data.content || [])).catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ประวัติการขาย</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">เลขที่บิล</th>
              <th className="pb-3 font-medium">พนักงาน</th>
              <th className="pb-3 font-medium text-right">ยอดรวม</th>
              <th className="pb-3 font-medium text-center">สถานะ</th>
              <th className="pb-3 font-medium">วันเวลา</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="py-3 font-mono text-xs">{o.orderNumber}</td>
                <td className="py-3">{o.userName}</td>
                <td className="py-3 text-right font-medium text-blue-600">฿{Number(o.total).toLocaleString()}</td>
                <td className="py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[o.status] || ''}`}>
                    {statusLabel[o.status] || o.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleString('th-TH')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
