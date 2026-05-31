'use client'
import { useEffect, useState } from 'react'
import { dashboardService, type DailySummary, type LowStockItem } from '@/services/dashboardService'
import { FiShoppingBag, FiDollarSign, FiAlertTriangle } from 'react-icons/fi'

export default function DashboardPage() {
  const [summary,  setSummary]  = useState<DailySummary>({ count: 0, total: 0 })
  const [lowStock, setLowStock] = useState<LowStockItem[]>([])

  useEffect(() => {
    dashboardService.getTodaySummary().then(setSummary).catch(() => {})
    dashboardService.getLowStock().then(setLowStock).catch(() => {})
  }, [])

  const stats = [
    { label: 'ยอดขายวันนี้',  value: `฿${Number(summary.total).toLocaleString()}`, icon: FiDollarSign, color: 'text-green-600 bg-green-100' },
    { label: 'จำนวนบิลวันนี้', value: summary.count,  icon: FiShoppingBag,  color: 'text-blue-600 bg-blue-100' },
    { label: 'สินค้าใกล้หมด', value: lowStock.length, icon: FiAlertTriangle, color: 'text-red-600 bg-red-100' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ภาพรวมระบบ</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}><Icon size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>
      {lowStock.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-red-600">
            <FiAlertTriangle /> สินค้าที่ต้องเติมสต็อก
          </h2>
          <div className="space-y-2">
            {lowStock.map(s => (
              <div key={s.id} className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">{s.productName}</span>
                <span className="text-sm text-red-600">เหลือ {s.quantity} / ขั้นต่ำ {s.minQuantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
