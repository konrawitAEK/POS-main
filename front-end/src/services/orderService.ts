import api from '@/lib/api'

export interface Order {
  id: number
  orderNumber: string
  status: string
  total: number
  createdAt: string
  userName: string
}

export interface OrderItem { productId: number; quantity: number }

export const orderService = {
  getAll:  (size = 50)                                        => api.get<{ content: Order[] }>(`/api/orders?size=${size}`).then(r => r.data.content),
  create:  (items: OrderItem[], paymentMethod: string)        => api.post('/api/orders', { items, paymentMethod }),
}
