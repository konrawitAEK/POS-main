import api from '@/lib/api'

export interface Product {
  id: number
  name: string
  barcode: string
  price: number
  costPrice: number
  categoryName?: string
}

export interface ProductPage { content: Product[]; totalElements: number; totalPages: number }

export interface CreateProductRequest {
  name: string
  barcode?: string
  price: number
  costPrice: number
  categoryId?: number
}

export const productService = {
  getAll:  (q = '', size = 50)          => api.get<ProductPage>(`/api/products?q=${encodeURIComponent(q)}&size=${size}`).then(r => r.data),
  create:  (data: CreateProductRequest) => api.post<Product>('/api/products', data).then(r => r.data),
  remove:  (id: number)                 => api.delete(`/api/products/${id}`),
}
