import api from '@/lib/api'

export interface Product {
  id: number
  name: string
  barcode?: string
  price: number
  costPrice: number
  categoryId?: number
  categoryName?: string
  supplierId?: number
  supplierName?: string
  stockQuantity?: number
}

export interface ProductPage { content: Product[]; totalElements: number; totalPages: number }

export interface CreateProductRequest {
  name: string
  barcode?: string
  price: number
  costPrice: number
  categoryId?: number
  supplierId?: number
}

export const productService = {
  getAll: (q = '', categoryId?: number, size = 50) => {
    const params = new URLSearchParams({ q, size: String(size) })
    if (categoryId) params.set('categoryId', String(categoryId))
    return api.get<ProductPage>(`/api/products?${params}`).then(r => r.data)
  },
  getByBarcode: (barcode: string)                   => api.get<Product>(`/api/products/barcode/${encodeURIComponent(barcode)}`).then(r => r.data),
  create:       (data: CreateProductRequest)        => api.post<Product>('/api/products', data).then(r => r.data),
  update:       (id: number, data: CreateProductRequest) => api.put<Product>(`/api/products/${id}`, data).then(r => r.data),
  remove:       (id: number)                        => api.delete(`/api/products/${id}`),
}
