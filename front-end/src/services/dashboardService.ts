import api from '@/lib/api'

export interface DailySummary { count: number; total: number }
export interface LowStockItem { id: number; quantity: number; minQuantity: number; productName: string }

export const dashboardService = {
  getTodaySummary: () => api.get<DailySummary>('/api/orders/summary/today').then(r => r.data),
  getLowStock:     () => api.get<LowStockItem[]>('/api/stock/low').then(r => r.data),
}
