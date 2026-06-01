import api from '@/lib/api'

export interface Supplier { id: number; name: string }

export const supplierService = {
  getAll:  ()               => api.get<Supplier[]>('/api/suppliers').then(r => r.data),
  create:  (name: string)   => api.post<Supplier>('/api/suppliers', { name }).then(r => r.data),
}
