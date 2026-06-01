'use client'
import { useEffect, useState } from 'react'
import { productService, type Product } from '@/services/productService'
import { orderService, type OrderItem } from '@/services/orderService'
import toast from 'react-hot-toast'
import { FiSearch, FiTrash2, FiShoppingCart } from 'react-icons/fi'

interface CartItem extends Product { quantity: number }

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart,    setCart]     = useState<CartItem[]>([])
  const [search,  setSearch]   = useState('')
  const [method,  setMethod]   = useState('CASH')
  const [loading, setLoading]  = useState(false)

  useEffect(() => {
    productService.getAll('', undefined, 100).then(r => setProducts(r.content)).catch(() => {})
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode || '').includes(search))

  const addToCart = (p: Product) => setCart(prev => {
    const found = prev.find(i => i.id === p.id)
    return found ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
                 : [...prev, { ...p, quantity: 1 }]
  })

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id))
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const checkout = async () => {
    if (!cart.length) return toast.error('ไม่มีสินค้าในตะกร้า')
    setLoading(true)
    try {
      const items: OrderItem[] = cart.map(i => ({ productId: i.id, quantity: i.quantity }))
      await orderService.create(items, method)
      toast.success('ชำระเงินสำเร็จ!')
      setCart([])
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col">
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder="ค้นหาสินค้า หรือ สแกนบาร์โค้ด..."
            value={search} onChange={e => setSearch(e.target.value)} autoFocus />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-auto">
          {filtered.map(p => (
            <button key={p.id} onClick={() => addToCart(p)}
              className="card text-left hover:shadow-md hover:border-blue-200 transition-all active:scale-95 cursor-pointer">
              <div className="text-sm font-medium line-clamp-2">{p.name}</div>
              <div className="text-blue-600 font-bold mt-2">฿{p.price.toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-80 flex flex-col">
        <div className="card flex-1 flex flex-col overflow-hidden">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <FiShoppingCart /> ตะกร้า ({cart.length})
          </h2>
          <div className="flex-1 overflow-auto space-y-2">
            {!cart.length && <p className="text-gray-400 text-sm text-center py-8">ยังไม่มีสินค้า</p>}
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-blue-600">฿{item.price.toLocaleString()}</p>
                </div>
                <input type="number" min={1} className="w-14 text-center border rounded px-1 py-0.5 text-sm"
                  value={item.quantity} onChange={e => updateQty(item.id, +e.target.value)} />
                <button onClick={() => updateQty(item.id, 0)} className="text-red-400 hover:text-red-600">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4 space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>รวม</span>
              <span className="text-blue-600">฿{total.toLocaleString()}</span>
            </div>
            <select className="input" value={method} onChange={e => setMethod(e.target.value)}>
              <option value="CASH">เงินสด</option>
              <option value="QR_CODE">QR Code</option>
              <option value="CARD">บัตรเครดิต/เดบิต</option>
              <option value="TRANSFER">โอนเงิน</option>
            </select>
            <button className="btn-primary w-full" onClick={checkout} disabled={loading}>
              {loading ? 'กำลังชำระ...' : 'ชำระเงิน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
