import api from '@/lib/api'

export interface Category { id: number; name: string; description: string }

export const categoryService = {
  getAll:  ()                                  => api.get<Category[]>('/api/categories').then(r => r.data),
  create:  (name: string, description: string) => api.post('/api/categories', { name, description }),
  remove:  (id: number)                        => api.delete(`/api/categories/${id}`),
}
