import api from '@/lib/api'

export interface StockItem {
  id: number
  productId: number
  productName: string
  quantity: number
  minQuantity: number
  maxQuantity: number
  lowStock: boolean
}

export const stockService = {
  getAll: ()                                       => api.get<StockItem[]>('/api/stock').then(r => r.data),
  adjust: (productId: number, quantity: number)    => api.patch(`/api/stock/${productId}/adjust`, { quantity }),
}
